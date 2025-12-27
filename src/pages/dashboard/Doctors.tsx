// app/doctors/page.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { AddDoctorSheet } from "@/components/add-doctor-sheet";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  Download,
  User,
  Phone,
  Mail,
  Activity,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Stethoscope,
  Hospital,
  DollarSign,
  Star,
  GraduationCap,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionCards, type CardData } from "@/components/section-cards";
import { cn } from "@/lib/utils";
import {
  DataTable,
  type TableAction,
  type TableField,
} from "@/components/data-table";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReduxDoctors } from "@/hooks/useReduxDoctors";
import { type Doctor as DoctorType } from "@/types/doctors";
import { toast } from "sonner";

// Update Doctor interface
interface Doctor extends DoctorType {
  doctorId?: string;
  fullName: string;
  experienceLevel?: "New" | "Junior" | "Experienced" | "Senior" | "Veteran";
  status: "active" | "inactive";
  availability?: "available" | "busy" | "on-leave";
}

// Search input component
function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-10 w-full text-sm md:text-base", className)}
        placeholder="Search doctors..."
        {...props}
      />
    </div>
  );
}

// Helper to calculate experience level
const getExperienceLevel = (
  years?: number
): "New" | "Junior" | "Experienced" | "Senior" | "Veteran" => {
  if (!years) return "New";
  if (years < 3) return "Junior";
  if (years < 10) return "Experienced";
  if (years < 20) return "Senior";
  return "Veteran";
};

// Helper to get availability status
const getAvailability = (
  doctor: DoctorType
): "available" | "busy" | "on-leave" => {
  // Simplified logic - in real app, check schedule
  const now = new Date();
  const hasAppointmentsNow = doctor.appointments?.some((app) => {
    const appDate = new Date(app.date);
    return (
      appDate.getDate() === now.getDate() &&
      appDate.getMonth() === now.getMonth() &&
      appDate.getFullYear() === now.getFullYear() &&
      ["SCHEDULED", "CONFIRMED", "IN_PROGRESS"].includes(app.status)
    );
  });

  if (!doctor.isActive) return "on-leave";
  if (hasAppointmentsNow) return "busy";
  return "available";
};

// Helper to get upcoming appointments count
const getUpcomingAppointments = (doctor: DoctorType): number => {
  const now = new Date();
  return (
    doctor.appointments?.filter((app) => {
      const appDate = new Date(app.date);
      return appDate > now && ["SCHEDULED", "CONFIRMED"].includes(app.status);
    }).length || 0
  );
};

// Helper to format consultation fee
const formatConsultationFee = (fee?: string): string => {
  if (!fee) return "Not specified";
  const amount = parseFloat(fee);
  if (isNaN(amount)) return fee;
  return `$${amount.toFixed(2)}`;
};

// Helper to check license expiry
const checkLicenseExpiry = (
  expiryDate?: string
): { status: "valid" | "expired" | "expiring"; days: number } => {
  if (!expiryDate) return { status: "valid", days: Infinity };

  const expiry = new Date(expiryDate);
  const today = new Date();
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysUntilExpiry < 0)
    return { status: "expired", days: Math.abs(daysUntilExpiry) };
  if (daysUntilExpiry <= 30)
    return { status: "expiring", days: daysUntilExpiry };
  return { status: "valid", days: daysUntilExpiry };
};

export default function DoctorsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [specializationFilter, setSpecializationFilter] =
    useState<string>("all");
  const [hospitalFilter, setHospitalFilter] = useState<string>("all");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [selectedDoctors, setSelectedDoctors] = useState<Doctor[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const isMobile = useIsMobile();

  // Use Redux doctors hook
  const {
    doctors,
    loading,
    error,
    pagination,
    getDoctors,

    getDoctor,
    removeDoctor,
    toggleAvailability,
    updateFilters,
    resetFilters,
  } = useReduxDoctors();

  // Transform doctors data for the table
  const tableDoctors: Doctor[] = useMemo(() => {
    return doctors.map((doctor) => {
      const experienceLevel = getExperienceLevel(doctor.yearsOfExperience);
      const availability = getAvailability(doctor);
      const upcomingAppointments = getUpcomingAppointments(doctor);
      const licenseStatus = checkLicenseExpiry(doctor.licenseExpiryDate);

      return {
        ...doctor,
        doctorId: `DR-${doctor.id.slice(0, 8).toUpperCase()}`,
        fullName: `${doctor.title || ""} ${doctor.firstName} ${
          doctor.lastName
        }`.trim(),
        experienceLevel,
        status: doctor.isActive ? "active" : ("inactive" as const),
        availability,
        upcomingAppointments,
        licenseStatus,
      };
    });
  }, [doctors]);

  // Filter doctors based on search and filters
  const filteredDoctors = useMemo(() => {
    return tableDoctors.filter((doctor) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        doctor.fullName.toLowerCase().includes(searchLower) ||
        doctor.doctorId?.toLowerCase().includes(searchLower) ||
        doctor.email.toLowerCase().includes(searchLower) ||
        doctor.phone?.toLowerCase().includes(searchLower) ||
        doctor.specialization?.toLowerCase().includes(searchLower) ||
        doctor.specialty?.toLowerCase().includes(searchLower) ||
        doctor.medicalLicense?.toLowerCase().includes(searchLower);

      const matchesStatus =
        statusFilter === "all" || doctor.status === statusFilter;

      const matchesSpecialization =
        specializationFilter === "all" ||
        doctor.specialization === specializationFilter ||
        doctor.specialty === specializationFilter;

      const matchesHospital =
        hospitalFilter === "all" || doctor.hospital === hospitalFilter;

      const matchesAvailability =
        availabilityFilter === "all" ||
        doctor.availability === availabilityFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSpecialization &&
        matchesHospital &&
        matchesAvailability
      );
    });
  }, [
    tableDoctors,
    searchQuery,
    statusFilter,
    specializationFilter,
    hospitalFilter,
    availabilityFilter,
  ]);

  // Calculate stats
  const stats = useMemo(() => {
    if (doctors.length === 0) {
      return {
        total: 0,
        active: 0,
        onDuty: 0,
        upcomingAppointments: 0,
        specializations: 0,
        criticalLicenses: 0,
      };
    }

    const total = doctors.length;
    const active = doctors.filter((d) => d.isActive).length;
    const onDuty = doctors.filter(
      (d) => getAvailability(d) === "available"
    ).length;
    const upcomingAppointments = doctors.reduce(
      (acc, doctor) => acc + getUpcomingAppointments(doctor),
      0
    );

    // Count unique specializations
    const specializationsSet = new Set(
      doctors
        .map((d) => d.specialization)
        .filter(Boolean)
        .concat(doctors.map((d) => d.specialty).filter(Boolean))
    );

    const criticalLicenses = doctors.filter((d) => {
      const status = checkLicenseExpiry(d.licenseExpiryDate);
      return status.status === "expired" || status.status === "expiring";
    }).length;

    return {
      total,
      active,
      onDuty,
      upcomingAppointments,
      specializations: specializationsSet.size,
      criticalLicenses,
    };
  }, [doctors]);

  // Load doctors on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        await getDoctors({ page: 1, limit: 50 });
      } catch (error) {
        console.error("Failed to load doctors:", error);
      }
    };

    loadData();
  }, [getDoctors]);

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        updateFilters({ search: searchQuery.trim() });
      } else {
        resetFilters();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, updateFilters, resetFilters]);

  // Get unique specializations and hospitals for filters
  const uniqueSpecializations = useMemo(() => {
    const allSpecs = doctors
      .map((d) => d.specialization)
      .filter(Boolean)
      .concat(doctors.map((d) => d.specialty).filter(Boolean));
    return Array.from(new Set(allSpecs)).sort();
  }, [doctors]);

  // Card data for SectionCards
  const doctorStatsCards: CardData[] = [
    {
      title: "Total Doctors",
      value: stats.total.toString(),
      icon: <User className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All registered doctors",
      change: {
        value: "8%",
        trend: "up",
        description: "from last month",
      },
    },
    {
      title: "Active Doctors",
      value: stats.active.toString(),
      icon: <Activity className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Currently active",
      change: {
        value: "5%",
        trend: "up",
        description: "from last week",
      },
    },
    {
      title: "On Duty",
      value: stats.onDuty.toString(),
      icon: <Stethoscope className="size-4" />,
      iconBgColor: "bg-purple-400 dark:bg-purple-900/20",
      footerDescription: "Available now",
      change: {
        value: "12%",
        trend: "up",
        description: "from yesterday",
      },
    },
    {
      title: "Specializations",
      value: stats.specializations.toString(),
      icon: <GraduationCap className="size-4" />,
      iconBgColor: "bg-amber-400 dark:bg-amber-900/20",
      footerDescription: "Unique specializations",
      change: {
        value: "3",
        trend: "up",
        description: "new added",
      },
    },
  ];

  // Desktop table fields configuration
  const doctorFields: TableField<Doctor>[] = [
    {
      key: "doctorId",
      header: "Doctor ID",
      cell: (value) => (
        <span className="font-medium text-sm md:text-base">
          {value as string}
        </span>
      ),
      width: "120px",
      enableSorting: true,
    },
    {
      key: "fullName",
      header: "Doctor Name",
      cell: (value, row) => (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="hidden md:flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-md bg-primary/10">
            <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm md:text-base truncate">
              {value as string}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground truncate flex items-center gap-2">
              <Stethoscope className="h-3 w-3" />
              <span>{row.specialization || row.specialty || "General"}</span>
            </div>
          </div>
        </div>
      ),
      width: "200px",
      enableSorting: true,
    },
    {
      key: "professionalInfo",
      header: "Professional Info",
      cell: (_, row) => (
        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
            <DollarSign className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {formatConsultationFee(row.consultationFee)}
            </span>
          </div>
          <div className="text-xs md:text-sm text-muted-foreground truncate hidden md:block">
            <Star className="inline h-3 w-3 mr-1" />
            {row.experienceLevel} ({row.yearsOfExperience || 0} yrs)
          </div>
        </div>
      ),
      width: "180px",
    },
    {
      key: "contactInfo",
      header: "Contact Info",
      cell: (_, row) => (
        <div className="space-y-1 min-w-0">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground truncate">
            <Mail className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{row.email}</span>
          </div>
          <div className="md:hidden text-xs text-muted-foreground truncate">
            {row.email}
          </div>
          {row.phone && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
              <Phone className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{row.phone}</span>
            </div>
          )}
        </div>
      ),
      width: "200px",
    },
    {
      key: "licenseInfo",
      header: "License Info",
      cell: (_, row) => {
        const licenseStatus =
          row.licenseStatus || checkLicenseExpiry(row.licenseExpiryDate);
        return (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm">
              <Activity className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span
                className={cn(
                  licenseStatus.status === "expired"
                    ? "text-red-600"
                    : licenseStatus.status === "expiring"
                    ? "text-amber-600"
                    : "text-green-600"
                )}
              >
                {licenseStatus.status.charAt(0).toUpperCase() +
                  licenseStatus.status.slice(1)}
              </span>
            </div>
            <div className="text-xs md:text-sm text-muted-foreground truncate hidden md:block">
              {row.medicalLicense || "No license"}
            </div>
          </div>
        );
      },
      width: "140px",
    },
    {
      key: "status",
      header: "Status",
      cell: (_value, row) => {
        const statusConfig = {
          active: {
            label: "Active",
            variant: "outline" as const,
            color: "bg-green-500",
            icon: <CheckCircle className="h-3 w-3" />,
          },
          inactive: {
            label: "Inactive",
            variant: "outline" as const,
            color: "bg-gray-500",
            icon: <Clock className="h-3 w-3" />,
          },
        };
        const config = statusConfig[row.status];
        return (
          <Badge
            variant={config.variant}
            className="gap-1 px-2 md:px-3 text-xs md:text-sm rounded-sm"
          >
            <span className="hidden md:inline">{config.icon}</span>
            {config.label}
          </Badge>
        );
      },
      width: "100px",
      align: "center",
      enableSorting: true,
    },
    {
      key: "availability",
      header: "Availability",
      cell: (value) => {
        const availability = value as Doctor["availability"];
        const availabilityConfig = {
          available: {
            label: "Available",
            variant: "outline" as const,
            color: "text-green-600",
            icon: <CheckCircle className="h-3 w-3" />,
          },
          busy: {
            label: "Busy",
            variant: "outline" as const,
            color: "text-amber-600",
            icon: <Clock className="h-3 w-3" />,
          },
          "on-leave": {
            label: "On Leave",
            variant: "outline" as const,
            color: "text-red-600",
            icon: <AlertCircle className="h-3 w-3" />,
          },
        };
        const config = availabilityConfig[availability || "available"];
        return (
          <Badge
            variant={config.variant}
            className={cn(
              config.color,
              "rounded-sm px-2 md:px-3 text-xs md:text-sm hidden md:flex gap-2"
            )}
          >
            <span className="hidden md:inline">{config.icon}</span>
            {config.label}
          </Badge>
        );
      },
      width: "140px",
      align: "center",
      enableSorting: true,
    },
  ];

  // Mobile table fields (simplified view)
  const mobileDoctorFields: TableField<Doctor>[] = [
    {
      key: "doctorInfo",
      header: "Doctor",
      cell: (_, row) => {
        const licenseStatus =
          row.licenseStatus || checkLicenseExpiry(row.licenseExpiryDate);
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">
                DR-{row.id.slice(0, 8).toUpperCase()}
              </span>
              <Badge variant="outline" className="text-xs">
                {row.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">
                  {row.title || ""} {row.firstName} {row.lastName}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Stethoscope className="h-3 w-3" />
                  <span>
                    {row.specialization || row.specialty || "General"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <Hospital className="h-3 w-3" />
                  <span>{row.hospital || "No hospital"}</span>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground truncate">
              <Mail className="inline h-3 w-3 mr-1" />
              {row.email}
            </div>
            <div className="flex items-center justify-between text-sm">
              <Badge
                variant="outline"
                className={cn(
                  licenseStatus.status === "expired"
                    ? "text-red-600"
                    : licenseStatus.status === "expiring"
                    ? "text-amber-600"
                    : "text-green-600",
                  "text-xs"
                )}
              >
                License: {licenseStatus.status}
              </Badge>
              <Badge
                variant="outline"
                className={cn(
                  row.availability === "available"
                    ? "text-green-600"
                    : row.availability === "busy"
                    ? "text-amber-600"
                    : "text-red-600",
                  "text-xs"
                )}
              >
                {row.availability}
              </Badge>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
  ];

  // Table actions
  const doctorActions: TableAction<Doctor>[] = [
    {
      type: "view",
      label: "View Doctor",
      icon: <Eye className="size-4" />,
      onClick: async (doctor) => {
        try {
          await getDoctor(doctor.id);
          toast.success(`Viewing ${doctor.firstName} ${doctor.lastName}`);
        } catch (error) {
          toast.error("Failed to load doctor details");
        }
      },
    },
    {
      type: "edit",
      label: "Edit Doctor",
      icon: <Edit className="size-4" />,
      onClick: (doctor) => {
        toast.info(`Edit doctor: ${doctor.firstName} ${doctor.lastName}`);
      },
    },
    {
      type: "custom",
      label: "Toggle Availability",
      icon: <Activity className="size-4" />,
      onClick: async (doctor) => {
        try {
          await toggleAvailability(doctor.id);
          const newStatus = !doctor.isActive;
          toast.success(
            `Doctor ${newStatus ? "activated" : "deactivated"} successfully`
          );
        } catch (error: any) {
          toast.error(error.message || "Failed to toggle availability");
        }
      },
    },
    {
      type: "delete",
      label: "Delete Doctor",
      icon: <Trash2 className="size-4" />,
      onClick: async (doctor) => {
        if (
          confirm(
            `Are you sure you want to delete ${doctor.firstName} ${doctor.lastName}?`
          )
        ) {
          try {
            await removeDoctor(doctor.id);
            toast.success("Doctor deleted successfully");
          } catch (error: any) {
            toast.error(error.message || "Failed to delete doctor");
          }
        }
      },
      disabled: (doctor) => {
        return (doctor.appointments?.length || 0) > 0;
      },
    },
  ];

  const handleRowClick = useCallback(
    async (doctor: Doctor) => {
      try {
        await getDoctor(doctor.id);
        toast.info(`Selected ${doctor.firstName} ${doctor.lastName}`);
      } catch (error) {
        toast.error("Failed to load doctor details");
      }
    },
    [getDoctor]
  );

  const handleSelectionChange = useCallback((selected: Doctor[]) => {
    setSelectedDoctors(selected);
  }, []);

  const handleExport = useCallback(() => {
    if (selectedDoctors.length === 0) {
      toast.error("Please select doctors to export");
      return;
    }

    try {
      const headers = [
        "Doctor ID",
        "Name",
        "Specialization",
        "Email",
        "Phone",
        "Status",
        "Hospital",
      ];
      const csvContent = [
        headers.join(","),
        ...selectedDoctors.map((doctor) =>
          [
            doctor.doctorId,
            `${doctor.firstName} ${doctor.lastName}`,
            doctor.specialization || doctor.specialty || "General",
            doctor.email,
            doctor.phone || "",
            doctor.isActive ? "Active" : "Inactive",
            doctor.hospital || "",
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `doctors_export_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success(`Exported ${selectedDoctors.length} doctors`);
    } catch (error) {
      toast.error("Failed to export doctors");
    }
  }, [selectedDoctors]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setSpecializationFilter("all");
    setHospitalFilter("all");
    setAvailabilityFilter("all");
    resetFilters();
  }, [resetFilters]);

  const handleRefresh = useCallback(async () => {
    try {
      await getDoctors({ page: pagination.page, limit: pagination.limit });
      toast.success("Doctors list refreshed");
    } catch (error) {
      toast.error("Failed to refresh doctors");
    }
  }, [getDoctors, pagination.page, pagination.limit]);

  const hasActiveFilters =
    searchQuery ||
    statusFilter !== "all" ||
    specializationFilter !== "all" ||
    hospitalFilter !== "all" ||
    availabilityFilter !== "all";

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleDoctorAdded = useCallback(async () => {
    try {
      await getDoctors({ page: pagination.page, limit: pagination.limit });
    } catch (error) {
      console.error("Failed to refresh doctors after adding:", error);
    }
  }, [getDoctors, pagination.page, pagination.limit]);

  return (
    <>
      <SiteHeader
        rightActions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10"
              onClick={handleRefresh}
              disabled={loading}
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </Button>
            <Button
              variant={"secondary"}
              className="h-9 md:h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold text-white text-sm md:text-base"
              onClick={() => setSheetOpen(true)}
              disabled={loading}
            >
              <Plus className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
              <span className="sm:inline">Add Doctor</span>
            </Button>
          </div>
        }
      />

      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Stats Overview - Responsive grid */}
        <div className="mb-4 md:mb-6">
          <SectionCards
            cards={doctorStatsCards}
            layout={isMobile ? "2x2" : "1x4"}
            className="gap-2 md:gap-4"
          />
        </div>

        {/* Search and Filters - Mobile optimized */}
        <Card className="mb-4 md:mb-6 border-none shadow-none p-0 pt-2">
          <CardContent className="p-3 md:p-4 lg:p-6">
            {/* Top row: Search and Filter toggle */}
            <div className="flex flex-col gap-3 mb-3 md:mb-4">
              <div className="flex items-center gap-2">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />

                {/* Mobile filter toggle */}
                {isMobile && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0"
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    disabled={loading}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                )}
              </div>

              {/* Mobile filters panel */}
              {isMobile && showMobileFilters && (
                <div className="space-y-2 p-2 border rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Filters</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowMobileFilters(false)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={specializationFilter}
                    onValueChange={setSpecializationFilter}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {uniqueSpecializations
                        .filter(
                          (spec): spec is string => !!spec && spec.trim() !== ""
                        )
                        .map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Availability</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearFilters}
                      className="flex-1 text-xs h-8"
                      disabled={loading}
                    >
                      Clear
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 text-xs h-8"
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Desktop filters row */}
            {!isMobile && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px] text-sm">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={specializationFilter}
                    onValueChange={setSpecializationFilter}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[200px] text-sm">
                      <Stethoscope className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Specialization" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {uniqueSpecializations
                        .filter(
                          (spec): spec is string => !!spec && spec.trim() !== ""
                        )
                        .map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={availabilityFilter}
                    onValueChange={setAvailabilityFilter}
                    disabled={loading}
                  >
                    <SelectTrigger className="w-[180px] text-sm">
                      <Activity className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Availability" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Availability</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="busy">Busy</SelectItem>
                      <SelectItem value="on-leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>

                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-9 text-sm"
                      disabled={loading}
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Actions row */}
            <div className="flex items-center justify-between">
              {/* Filter summary */}
              {hasActiveFilters && (
                <div className="flex items-center gap-1 md:gap-2 flex-wrap">
                  <span className="text-xs md:text-sm text-muted-foreground">
                    Filtered:
                  </span>
                  {searchQuery && (
                    <Badge variant="secondary" className="text-xs h-6">
                      "{searchQuery}"
                    </Badge>
                  )}
                  {statusFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {statusFilter}
                    </Badge>
                  )}
                  {specializationFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {specializationFilter}
                    </Badge>
                  )}
                  {hospitalFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {hospitalFilter}
                    </Badge>
                  )}
                  {availabilityFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {availabilityFilter}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs h-6">
                    {filteredDoctors.length} of {tableDoctors.length}
                  </Badge>
                </div>
              )}

              {/* Selected actions */}
              {selectedDoctors.length > 0 && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="h-8 md:h-9 text-xs md:text-sm"
                    disabled={loading}
                  >
                    <Download className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">Exp</span>
                    <span className="ml-1">({selectedDoctors.length})</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Doctors Table */}
        <Card className="border-none shadow-none">
          <CardContent className={cn("p-0", isMobile ? "px-2" : "px-6")}>
            <div className="overflow-x-auto">
              <DataTable
                title="Doctors"
                description="Manage and view all doctor records"
                data={filteredDoctors}
                fields={isMobile ? mobileDoctorFields : doctorFields}
                actions={doctorActions}
                loading={loading}
                enableSelection={isMobile ? false : true}
                enablePagination={true}
                pageSize={isMobile ? 6 : 8}
                onRowClick={handleRowClick}
                onSelectionChange={handleSelectionChange}
                emptyMessage={
                  loading ? "Loading doctors..." : "No doctors found"
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <AddDoctorSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onSuccess={handleDoctorAdded}
      />
    </>
  );
}

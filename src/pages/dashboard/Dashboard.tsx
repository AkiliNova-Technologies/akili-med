"use client";

import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type TableData,
  type TableField,
  type TableAction,
} from "@/components/data-table";
import { SectionCards, type CardData } from "@/components/section-cards";
import {
  Users,
  Calendar,
  Stethoscope,
  Clock,
  DollarSign,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Bed,
  Clipboard,
  Filter,
  Search,
  X,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

// Recent Appointments Data
interface Appointment extends TableData {
  id: number;
  patient: string;
  doctor: string;
  type: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "In Progress";
  room: string;
}

const recentAppointments: Appointment[] = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Sarah Smith",
    type: "Consultation",
    time: "09:00 AM",
    status: "Scheduled",
    room: "Room 101",
  },
  {
    id: 2,
    patient: "Jane Smith",
    doctor: "Dr. Michael Johnson",
    type: "Follow-up",
    time: "10:15 AM",
    status: "Completed",
    room: "Room 102",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    doctor: "Dr. Emily Williams",
    type: "Emergency",
    time: "11:30 AM",
    status: "In Progress",
    room: "ER",
  },
  {
    id: 4,
    patient: "Sarah Williams",
    doctor: "Dr. David Brown",
    type: "Lab Test",
    time: "02:00 PM",
    status: "Scheduled",
    room: "Lab",
  },
  {
    id: 5,
    patient: "Michael Brown",
    doctor: "Dr. Jennifer Taylor",
    type: "Therapy",
    time: "03:45 PM",
    status: "Scheduled",
    room: "Room 201",
  },
  {
    id: 6,
    patient: "Emma Wilson",
    doctor: "Dr. Sarah Smith",
    type: "Checkup",
    time: "04:30 PM",
    status: "Cancelled",
    room: "Room 103",
  },
];

const appointmentFields: TableField<Appointment>[] = [
  {
    key: "patient",
    header: "Patient",
    enableSorting: true,
    width: "150px",
    cell: (value) => (
      <span className="font-medium text-sm md:text-base">
        {value as string}
      </span>
    ),
  },
  {
    key: "doctor",
    header: "Doctor",
    enableSorting: true,
    width: "150px",
  },
  {
    key: "type",
    header: "Type",
    enableSorting: true,
    width: "120px",
  },
  {
    key: "time",
    header: "Time",
    enableSorting: true,
    width: "100px",
  },
  {
    key: "status",
    header: "Status",
    width: "120px",
    cell: (value) => {
      const status = value as string;
      return (
        <Badge
          className={cn(
            "px-2 py-1 text-xs font-medium",
            status === "Completed"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : status === "Cancelled"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : status === "In Progress"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          )}
        >
          {status}
        </Badge>
      );
    },
  },
  {
    key: "room",
    header: "Room",
    enableSorting: true,
    width: "100px",
  },
];

const mobileAppointmentFields: TableField<Appointment>[] = [
  {
    key: "appointmentInfo",
    header: "Appointment",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-sm">{row.patient}</span>
            <div className="text-xs text-muted-foreground">{row.time}</div>
          </div>
          <Badge
            className={cn(
              "px-2 py-0.5 text-xs",
              row.status === "Completed"
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                : row.status === "Cancelled"
                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                : row.status === "In Progress"
                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
            )}
          >
            {row.status}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Doctor</div>
            <div className="font-medium truncate">{row.doctor}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Type</div>
            <div className="font-medium">{row.type}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Room</div>
            <div className="font-medium">{row.room}</div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                console.log("View", row);
              }}
            >
              <Eye className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={(e) => {
                e.stopPropagation();
                console.log("Edit", row);
              }}
            >
              <Edit className="size-3" />
            </Button>
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },
];

const appointmentActions: TableAction<Appointment>[] = [
  {
    type: "view",
    onClick: (row) => console.log("View", row),
    icon: <Eye className="size-4" />,
  },
  {
    type: "edit",
    onClick: (row) => console.log("Edit", row),
    icon: <Edit className="size-4" />,
  },
];

// Recent Patients Data
interface Patient extends TableData {
  id: number;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: "Active" | "Inactive" | "Critical";
}

const recentPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    lastVisit: "2024-01-14",
    condition: "Diabetes",
    status: "Active",
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 68,
    gender: "Male",
    lastVisit: "2024-01-13",
    condition: "Heart Disease",
    status: "Critical",
  },
  {
    id: 4,
    name: "Sarah Williams",
    age: 28,
    gender: "Female",
    lastVisit: "2024-01-12",
    condition: "Asthma",
    status: "Active",
  },
  {
    id: 5,
    name: "Michael Brown",
    age: 52,
    gender: "Male",
    lastVisit: "2024-01-10",
    condition: "Arthritis",
    status: "Inactive",
  },
];

const patientFields: TableField<Patient>[] = [
  {
    key: "name",
    header: "Patient Name",
    enableSorting: true,
    width: "180px",
    cell: (value) => (
      <span className="font-medium text-sm md:text-base">
        {value as string}
      </span>
    ),
  },
  {
    key: "age",
    header: "Age",
    enableSorting: true,
    width: "80px",
  },
  {
    key: "gender",
    header: "Gender",
    enableSorting: true,
    width: "100px",
  },
  {
    key: "lastVisit",
    header: "Last Visit",
    width: "120px",
    cell: (value) => new Date(value as string).toLocaleDateString(),
  },
  {
    key: "condition",
    header: "Condition",
    enableSorting: true,
    width: "150px",
  },
  {
    key: "status",
    header: "Status",
    width: "100px",
    cell: (value) => {
      const status = value as string;
      let color = "";
      if (status === "Active") color = "text-green-600";
      else if (status === "Critical") color = "text-red-600";
      else color = "text-gray-600";

      return <span className={`font-medium text-sm ${color}`}>{status}</span>;
    },
  },
];

const mobilePatientFields: TableField<Patient>[] = [
  {
    key: "patientInfo",
    header: "Patient",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium text-sm">{row.name}</span>
            <div className="text-xs text-muted-foreground">
              {row.gender}, {row.age} years
            </div>
          </div>
          <span
            className={cn(
              "text-xs font-medium",
              row.status === "Active"
                ? "text-green-600"
                : row.status === "Critical"
                ? "text-red-600"
                : "text-gray-600"
            )}
          >
            {row.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-muted-foreground">Condition</div>
            <div className="font-medium truncate">{row.condition}</div>
          </div>
          <div>
            <div className="text-muted-foreground">Last Visit</div>
            <div className="font-medium">
              {new Date(row.lastVisit).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    ),
    enableSorting: true,
  },
];

// Statistics Cards Data
const statCards: CardData[] = [
  {
    title: "Total Patients",
    value: "1,284",
    change: { value: "12%", trend: "up", description: "From last month" },
    icon: <Users className="size-4" />,
    iconBgColor: "bg-blue-400 dark:bg-blue-900",
  },
  {
    title: "Today's Appointments",
    value: "24",
    change: { value: "2", trend: "down", description: "From yesterday" },
    icon: <Calendar className="size-4" />,
    iconBgColor: "bg-green-400 dark:bg-green-900",
  },
  {
    title: "Available Doctors",
    value: "18",
    change: { value: "3", trend: "up", description: "Currently available" },
    icon: <Stethoscope className="size-4" />,
    iconBgColor: "bg-purple-400 dark:bg-purple-900",
  },
  {
    title: "Monthly Revenue",
    value: "$42,580",
    change: { value: "8.2%", trend: "up", description: "From last month" },
    icon: <DollarSign className="size-4" />,
    iconBgColor: "bg-amber-400 dark:bg-amber-900",
  },
  {
    title: "Occupancy Rate",
    value: "78%",
    change: { value: "5%", trend: "up", description: "Hospital beds" },
    icon: <Bed className="size-4" />,
    iconBgColor: "bg-red-400 dark:bg-red-900",
  },
  {
    title: "Avg. Wait Time",
    value: "15m",
    change: { value: "3m", trend: "down", description: "From last week" },
    icon: <Clock className="size-4" />,
    iconBgColor: "bg-indigo-400 dark:bg-indigo-900",
  },
];

// Alerts Data
const alerts = [
  {
    id: 1,
    type: "critical",
    message: "Patient #103 requires immediate attention",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "warning",
    message: "Low stock alert: Paracetamol running low",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "info",
    message: "Dr. Smith's shift starts in 30 minutes",
    time: "2 hours ago",
  },
  {
    id: 4,
    type: "success",
    message: "Monthly revenue target achieved",
    time: "1 day ago",
  },
];

// Search input component
function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-10 w-full text-sm md:text-base", className)}
        placeholder="Search appointments, patients..."
        {...props}
      />
    </div>
  );
}

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [appointmentFilter, setAppointmentFilter] = useState("all");
  const [patientFilter, setPatientFilter] = useState("all");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const isMobile = useIsMobile();

  const clearFilters = () => {
    setSearchQuery("");
    setAppointmentFilter("all");
    setPatientFilter("all");
  };

  const filteredAppointments = recentAppointments.filter((appointment) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        appointment.patient.toLowerCase().includes(query) ||
        appointment.doctor.toLowerCase().includes(query) ||
        appointment.type.toLowerCase().includes(query)
      );
    }
    if (appointmentFilter !== "all") {
      return (
        appointment.status.toLowerCase() === appointmentFilter.toLowerCase()
      );
    }
    return true;
  });

  const filteredPatients = recentPatients.filter((patient) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.condition.toLowerCase().includes(query)
      );
    }
    if (patientFilter !== "all") {
      return patient.status.toLowerCase() === patientFilter.toLowerCase();
    }
    return true;
  });

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                Medical Dashboard
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                Welcome back! Here's what's happening at your clinic today.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                className="gap-1 md:gap-2 flex-1 sm:flex-none h-9 md:h-10"
              >
                <Download className="size-3.5 md:size-4" />
                <span className="hidden sm:inline">Export Report</span>
                <span className="sm:hidden">Export</span>
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="shadow-none border-none p-0">
            <CardContent className="p-3 md:p-6">
              <div className="flex flex-col gap-3 md:gap-4">
                <div className="flex items-center gap-2">
                  <SearchInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1"
                  />

                  {/* Mobile filter toggle */}
                  {isMobile && (
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-9 w-9 flex-shrink-0"
                      onClick={() => setShowMobileFilters(!showMobileFilters)}
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
                      value={appointmentFilter}
                      onValueChange={setAppointmentFilter}
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Appointment Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Appointments</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={patientFilter}
                      onValueChange={setPatientFilter}
                    >
                      <SelectTrigger className="w-full text-sm">
                        <SelectValue placeholder="Patient Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Patients</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="flex-1 text-xs h-8"
                      >
                        Clear
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setShowMobileFilters(false)}
                        className="flex-1 text-xs h-8"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                )}

                {/* Desktop filters row */}
                {!isMobile && (
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Select
                        value={appointmentFilter}
                        onValueChange={setAppointmentFilter}
                      >
                        <SelectTrigger className="w-[160px] text-sm">
                          <SelectValue placeholder="Appointment Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Appointments</SelectItem>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="in progress">
                            In Progress
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={patientFilter}
                        onValueChange={setPatientFilter}
                      >
                        <SelectTrigger className="w-[160px] text-sm">
                          <SelectValue placeholder="Patient Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Patients</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="h-9 text-sm"
                      >
                        Clear Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Mobile Tabs for sections */}
          {isMobile && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList className="grid grid-cols-3 h-auto">
                <TabsTrigger value="overview" className="gap-1 text-xs py-1.5">
                  <Activity className="size-3" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="gap-1 text-xs py-1.5"
                >
                  <Calendar className="size-3" />
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="patients" className="gap-1 text-xs py-1.5">
                  <Users className="size-3" />
                  Patients
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                {/* Quick Stats */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Overview</h2>
                  </div>
                  <SectionCards cards={statCards} layout="2x3" />
                </div>

                {/* System Alerts */}
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <AlertCircle className="size-4" />
                      System Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 p-4 pt-0">
                    {alerts.slice(0, 3).map((alert) => (
                      <div
                        key={alert.id}
                        className="flex items-start gap-3 p-2.5 rounded-lg border"
                      >
                        <div
                          className={`mt-1 size-2 rounded-full ${
                            alert.type === "critical"
                              ? "bg-red-500"
                              : alert.type === "warning"
                              ? "bg-yellow-500"
                              : alert.type === "info"
                              ? "bg-blue-500"
                              : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="text-xs font-medium">{alert.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            {alert.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="appointments">
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4">
                    <div>
                      <CardTitle className="text-base mb-2">
                        Today's Appointments
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <DataTable
                      data={filteredAppointments}
                      fields={mobileAppointmentFields}
                      enableSelection={false}
                      enablePagination={true}
                      pageSize={4}
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="patients">
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4">
                    <div>
                      <CardTitle className="text-base mb-2">
                        Recent Patients
                      </CardTitle>
                      <CardDescription className="text-xs">
                        Patients added in the last 7 days
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <DataTable
                      data={filteredPatients}
                      fields={mobilePatientFields}
                      enableSelection={false}
                      enablePagination={true}
                      pageSize={4}
                      onRowClick={(row) => console.log("View patient", row)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}

          {/* Desktop Layout */}
          {!isMobile && (
            <>
              {/* Quick Stats */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Overview</h2>
                </div>
                <SectionCards cards={statCards} layout="2x3" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                {/* Left Column - Appointments & Quick Actions */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6">
                  {/* Today's Appointments */}
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base md:text-lg lg:text-xl mb-2">
                            Today's Appointments
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {new Date().toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <DataTable
                        data={filteredAppointments}
                        fields={appointmentFields}
                        actions={appointmentActions}
                        enableSelection={false}
                        enablePagination={false}
                      />
                    </CardContent>
                  </Card>

                  {/* Recent Patients */}
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4 md:p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base md:text-lg lg:text-xl mb-2">
                            Recent Patients
                          </CardTitle>
                          <CardDescription className="text-sm">
                            Patients added in the last 7 days
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      <DataTable
                        data={filteredPatients}
                        fields={patientFields}
                        enableSelection={false}
                        enablePagination={false}
                        onRowClick={(row) => console.log("View patient", row)}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Health Metrics, Alerts, Quick Actions */}
                <div className="space-y-4 md:space-y-6">
                  {/* System Alerts */}
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <AlertCircle className="size-4 md:size-5" />
                        System Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                      {alerts.map((alert) => (
                        <div
                          key={alert.id}
                          className="flex items-start gap-3 p-3 rounded-lg border"
                        >
                          <div
                            className={`mt-1 size-2 rounded-full ${
                              alert.type === "critical"
                                ? "bg-red-500"
                                : alert.type === "warning"
                                ? "bg-yellow-500"
                                : alert.type === "info"
                                ? "bg-blue-500"
                                : "bg-green-500"
                            }`}
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {alert.message}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {alert.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Upcoming Events */}
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="text-base md:text-lg lg:text-xl">
                        Upcoming Events
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Meetings and important dates
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                        <div>
                          <p className="font-medium text-sm">Staff Meeting</p>
                          <p className="text-xs text-muted-foreground">
                            Tomorrow, 10:00 AM
                          </p>
                        </div>
                        <Clock className="size-4 text-blue-500" />
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                        <div>
                          <p className="font-medium text-sm">
                            Medical Supplies Delivery
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Jan 18, 2:00 PM
                          </p>
                        </div>
                        <Clipboard className="size-4 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Bottom Row - Additional Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                {/* Doctor Availability */}
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Doctor Availability
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Current shift status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-3 md:space-y-4">
                      {[
                        "Dr. Sarah Smith",
                        "Dr. Michael Johnson",
                        "Dr. Emily Williams",
                      ].map((doctor, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Stethoscope className="size-4 text-blue-600 dark:text-blue-300" />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{doctor}</p>
                              <p className="text-xs text-muted-foreground">
                                General Physician
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-xs"
                          >
                            Available
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Room Utilization */}
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Room Utilization
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Current usage status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 md:p-6 pt-0">
                    <div className="space-y-3 md:space-y-4">
                      {[
                        {
                          room: "Room 101",
                          status: "Occupied",
                          patient: "John Doe",
                        },
                        { room: "Room 102", status: "Available", patient: "" },
                        { room: "Room 201", status: "Cleaning", patient: "" },
                        {
                          room: "ER",
                          status: "Occupied",
                          patient: "Emergency",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`size-8 rounded-full flex items-center justify-center ${
                                item.status === "Occupied"
                                  ? "bg-red-100 dark:bg-red-900"
                                  : item.status === "Available"
                                  ? "bg-green-100 dark:bg-green-900"
                                  : "bg-yellow-100 dark:bg-yellow-900"
                              }`}
                            >
                              <Bed
                                className={`size-4 ${
                                  item.status === "Occupied"
                                    ? "text-red-600 dark:text-red-300"
                                    : item.status === "Available"
                                    ? "text-green-600 dark:text-green-300"
                                    : "text-yellow-600 dark:text-yellow-300"
                                }`}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-sm">{item.room}</p>
                              {item.patient && (
                                <p className="text-xs text-muted-foreground">
                                  {item.patient}
                                </p>
                              )}
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-xs ${
                              item.status === "Occupied"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : item.status === "Available"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4 md:p-6">
                    <CardTitle className="text-base md:text-lg lg:text-xl">
                      Performance Metrics
                    </CardTitle>
                    <CardDescription className="text-sm">
                      Clinic performance indicators
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                    {[
                      {
                        label: "Patient Satisfaction",
                        value: 94,
                        color: "green",
                      },
                      {
                        label: "Appointment Adherence",
                        value: 88,
                        color: "blue",
                      },
                      {
                        label: "Treatment Success Rate",
                        value: 91,
                        color: "purple",
                      },
                      { label: "Average Wait Time", value: 60, color: "amber" },
                    ].map((metric, index) => (
                      <div key={index} className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">
                            {metric.label}
                          </span>
                          <span
                            className={`text-sm font-bold ${
                              metric.color === "green"
                                ? "text-green-600"
                                : metric.color === "blue"
                                ? "text-blue-600"
                                : metric.color === "purple"
                                ? "text-purple-600"
                                : "text-amber-600"
                            }`}
                          >
                            {metric.label === "Average Wait Time"
                              ? "15m"
                              : `${metric.value}%`}
                          </span>
                        </div>
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              metric.color === "green"
                                ? "bg-green-500"
                                : metric.color === "blue"
                                ? "bg-blue-500"
                                : metric.color === "purple"
                                ? "bg-purple-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${metric.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

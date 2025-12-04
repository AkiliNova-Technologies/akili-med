// app/patients/page.tsx
"use client"

import { useState, useCallback } from "react"
import { AddPatientSheet } from "@/components/add-patient-sheet"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  User,
  Phone,
  Mail,
  Calendar,
  Activity,
  Eye,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle,
  X
} from "lucide-react"

import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SectionCards, type CardData } from "@/components/section-cards"
import { cn } from "@/lib/utils"
import { DataTable, type TableAction, type TableField } from "@/components/data-table"
import { useIsMobile } from "@/hooks/use-mobile"

// Define patient data type
interface Patient {
  id: string
  patientId: string
  firstName: string
  lastName: string
  fullName: string
  age: number
  gender: string
  email: string
  phone: string
  lastVisit: string
  nextAppointment: string
  status: "active" | "inactive" | "pending"
  medicalStatus: "stable" | "critical" | "recovering"
  bloodType: string
  primaryDoctor: string
  [key: string]: any
}

// Mock patient data
const mockPatients: Patient[] = [
  {
    id: "1",
    patientId: "PAT-001",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    age: 45,
    gender: "Male",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    lastVisit: "2024-01-15",
    nextAppointment: "2024-02-20",
    status: "active",
    medicalStatus: "stable",
    bloodType: "A+",
    primaryDoctor: "Dr. Sarah Smith"
  },
  {
    id: "2",
    patientId: "PAT-002",
    firstName: "Jane",
    lastName: "Smith",
    fullName: "Jane Smith",
    age: 32,
    gender: "Female",
    email: "jane.smith@example.com",
    phone: "+1 (555) 987-6543",
    lastVisit: "2024-01-20",
    nextAppointment: "2024-02-25",
    status: "active",
    medicalStatus: "recovering",
    bloodType: "O-",
    primaryDoctor: "Dr. Michael Brown"
  },
  {
    id: "3",
    patientId: "PAT-003",
    firstName: "Robert",
    lastName: "Johnson",
    fullName: "Robert Johnson",
    age: 58,
    gender: "Male",
    email: "robert.j@example.com",
    phone: "+1 (555) 456-7890",
    lastVisit: "2024-01-10",
    nextAppointment: "2024-03-05",
    status: "active",
    medicalStatus: "stable",
    bloodType: "B+",
    primaryDoctor: "Dr. Emily Wilson"
  },
  {
    id: "4",
    patientId: "PAT-004",
    firstName: "Sarah",
    lastName: "Williams",
    fullName: "Sarah Williams",
    age: 29,
    gender: "Female",
    email: "sarah.w@example.com",
    phone: "+1 (555) 321-6547",
    lastVisit: "2023-12-05",
    nextAppointment: "",
    status: "inactive",
    medicalStatus: "stable",
    bloodType: "AB+",
    primaryDoctor: "Dr. David Chen"
  },
  {
    id: "5",
    patientId: "PAT-005",
    firstName: "Michael",
    lastName: "Brown",
    fullName: "Michael Brown",
    age: 67,
    gender: "Male",
    email: "michael.b@example.com",
    phone: "+1 (555) 789-0123",
    lastVisit: "2024-01-25",
    nextAppointment: "2024-02-15",
    status: "active",
    medicalStatus: "critical",
    bloodType: "O+",
    primaryDoctor: "Dr. Sarah Smith"
  },
  {
    id: "6",
    patientId: "PAT-006",
    firstName: "Emily",
    lastName: "Davis",
    fullName: "Emily Davis",
    age: 41,
    gender: "Female",
    email: "emily.d@example.com",
    phone: "+1 (555) 234-5678",
    lastVisit: "2024-01-18",
    nextAppointment: "2024-02-28",
    status: "active",
    medicalStatus: "recovering",
    bloodType: "A-",
    primaryDoctor: "Dr. Michael Brown"
  },
  {
    id: "7",
    patientId: "PAT-007",
    firstName: "David",
    lastName: "Miller",
    fullName: "David Miller",
    age: 53,
    gender: "Male",
    email: "david.m@example.com",
    phone: "+1 (555) 876-5432",
    lastVisit: "2023-11-30",
    nextAppointment: "",
    status: "inactive",
    medicalStatus: "stable",
    bloodType: "B-",
    primaryDoctor: "Dr. Emily Wilson"
  },
  {
    id: "8",
    patientId: "PAT-008",
    firstName: "Lisa",
    lastName: "Taylor",
    fullName: "Lisa Taylor",
    age: 38,
    gender: "Female",
    email: "lisa.t@example.com",
    phone: "+1 (555) 345-6789",
    lastVisit: "2024-01-22",
    nextAppointment: "2024-03-10",
    status: "active",
    medicalStatus: "stable",
    bloodType: "O+",
    primaryDoctor: "Dr. David Chen"
  },
  {
    id: "9",
    patientId: "PAT-009",
    firstName: "James",
    lastName: "Anderson",
    fullName: "James Anderson",
    age: 49,
    gender: "Male",
    email: "james.a@example.com",
    phone: "+1 (555) 654-3210",
    lastVisit: "2024-01-05",
    nextAppointment: "2024-02-22",
    status: "pending",
    medicalStatus: "stable",
    bloodType: "A+",
    primaryDoctor: "Dr. Sarah Smith"
  },
  {
    id: "10",
    patientId: "PAT-010",
    firstName: "Amanda",
    lastName: "Thomas",
    fullName: "Amanda Thomas",
    age: 26,
    gender: "Female",
    email: "amanda.t@example.com",
    phone: "+1 (555) 987-1234",
    lastVisit: "2024-01-28",
    nextAppointment: "2024-03-15",
    status: "active",
    medicalStatus: "recovering",
    bloodType: "AB-",
    primaryDoctor: "Dr. Michael Brown"
  }
]

// Desktop table fields configuration
const patientFields: TableField<Patient>[] = [
  {
    key: "patientId",
    header: "Patient ID",
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
    header: "Patient Name",
    cell: (value, row) => (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-md bg-primary/10">
          <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm md:text-base truncate">{value as string}</div>
          <div className="text-xs md:text-sm text-muted-foreground truncate">
            {row.age} yrs • {row.gender}
          </div>
        </div>
      </div>
    ),
    width: "180px",
    enableSorting: true,
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
          <Phone className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{row.phone}</span>
        </div>
      </div>
    ),
    width: "200px",
  },
  {
    key: "medicalInfo",
    header: "Medical Info",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <Activity className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span>Blood: {row.bloodType}</span>
        </div>
        <div className="text-xs md:text-sm text-muted-foreground truncate hidden md:block">
          Dr. {row.primaryDoctor.split("Dr. ")[1]}
        </div>
      </div>
    ),
    width: "150px",
  },
  {
    key: "appointments",
    header: "Appointments",
    cell: (_, row) => (
      <div className="space-y-1 hidden md:block">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Last: {row.lastVisit ? new Date(row.lastVisit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : "Never"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Next: {row.nextAppointment 
            ? new Date(row.nextAppointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : "Not scheduled"}</span>
        </div>
      </div>
    ),
    width: "160px",
    enableSorting: true,
  },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as Patient["status"]
      const statusConfig = {
        active: { 
          label: "Active", 
          variant: "outline" as const, 
          color: "bg-green-500",
          icon: <CheckCircle className="h-3 w-3" />
        },
        inactive: { 
          label: "Inactive", 
          variant: "outline" as const, 
          color: "bg-gray-500",
          icon: <Clock className="h-3 w-3" />
        },
        pending: { 
          label: "Pending", 
          variant: "outline" as const, 
          color: "bg-yellow-500",
          icon: <AlertCircle className="h-3 w-3" />
        }
      }
      const config = statusConfig[status]
      return (
        <Badge variant={config.variant} className="gap-1 px-2 md:px-3 text-xs md:text-sm rounded-sm">
          <span className="hidden md:inline">{config.icon}</span>
          {config.label}
        </Badge>
      )
    },
    width: "100px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "medicalStatus",
    header: "Health",
    cell: (value) => {
      const status = value as Patient["medicalStatus"]
      const statusConfig = {
        stable: { 
          label: "Stable", 
          variant: "outline" as const, 
          color: "text-green-600" 
        },
        critical: { 
          label: "Critical", 
          variant: "outline" as const, 
          color: "text-red-600" 
        },
        recovering: { 
          label: "Recovering", 
          variant: "outline" as const, 
          color: "text-blue-600" 
        }
      }
      const config = statusConfig[status]
      return (
        <Badge variant={config.variant} className={cn(config.color, "rounded-sm px-2 md:px-3 text-xs md:text-sm hidden md:block")}>
          {config.label}
        </Badge>
      )
    },
    width: "100px",
    align: "center",
    enableSorting: true,
  },
]

// Mobile table fields (simplified view)
const mobilePatientFields: TableField<Patient>[] = [
  {
    key: "patientInfo",
    header: "Patient",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{row.patientId}</span>
          <Badge variant="outline" className="text-xs">
            {row.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm truncate">{row.fullName}</div>
            <div className="text-xs text-muted-foreground">
              {row.age} yrs • {row.gender} • {row.bloodType}
            </div>
          </div>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          <Mail className="inline h-3 w-3 mr-1" />
          {row.email}
        </div>
        <div className="flex items-center justify-between text-sm">
          <Badge variant="outline" className={cn(
            row.medicalStatus === "critical" ? "text-red-600" :
            row.medicalStatus === "recovering" ? "text-blue-600" :
            "text-green-600",
            "text-xs"
          )}>
            {row.medicalStatus}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Next: {row.nextAppointment 
              ? new Date(row.nextAppointment).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : "No appt"}
          </span>
        </div>
      </div>
    ),
    enableSorting: true,
  },
]

// Search input component
function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-10 w-full text-sm md:text-base", className)}
        placeholder="Search patients..."
        {...props}
      />
    </div>
  )
}

// Calculate stats
const calculateStats = (patients: Patient[]) => ({
  total: patients.length,
  active: patients.filter(p => p.status === "active").length,
  critical: patients.filter(p => p.medicalStatus === "critical").length,
  upcomingAppointments: patients.filter(p => p.nextAppointment !== "").length,
  pending: patients.filter(p => p.status === "pending").length,
  recovering: patients.filter(p => p.medicalStatus === "recovering").length,
})

export default function PatientsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [medicalStatusFilter, setMedicalStatusFilter] = useState<string>("all")
  const [genderFilter, setGenderFilter] = useState<string>("all")
  const [selectedPatients, setSelectedPatients] = useState<Patient[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const isMobile = useIsMobile()

  // Filter patients based on search and filters
  const filteredPatients = mockPatients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      patient.fullName.toLowerCase().includes(searchLower) ||
      patient.patientId.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchQuery)

    const matchesStatus = 
      statusFilter === "all" || patient.status === statusFilter

    const matchesMedicalStatus = 
      medicalStatusFilter === "all" || patient.medicalStatus === medicalStatusFilter

    const matchesGender = 
      genderFilter === "all" || patient.gender.toLowerCase() === genderFilter

    return matchesSearch && matchesStatus && matchesMedicalStatus && matchesGender
  })

  // Calculate stats for filtered patients
  const stats = calculateStats(filteredPatients)

  // Card data for SectionCards
  const patientStatsCards: CardData[] = [
    {
      title: "Total Patients",
      value: stats.total.toString(),
      icon: <User className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All registered patients",
      change: {
        value: "12%",
        trend: "up",
        description: "from last month"
      }
    },
    {
      title: "Active Patients",
      value: stats.active.toString(),
      icon: <Activity className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Currently active patients",
      change: {
        value: "8%",
        trend: "up",
        description: "from last week"
      }
    },
    {
      title: "Critical Cases",
      value: stats.critical.toString(),
      icon: <Activity className="size-4" />,
      iconBgColor: "bg-red-400 dark:bg-red-900/20",
      footerDescription: "Requires immediate attention",
      change: {
        value: "3%",
        trend: "down",
        description: "from yesterday"
      }
    },
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments.toString(),
      icon: <Calendar className="size-4" />,
      iconBgColor: "bg-purple-400 dark:bg-purple-900/20",
      footerDescription: "Scheduled appointments",
      change: {
        value: "5",
        trend: "up",
        description: "this week"
      }
    }
  ]

  // Table actions
  const patientActions: TableAction<Patient>[] = [
    {
      type: "view",
      label: "View Patient",
      icon: <Eye className="size-4" />,
      onClick: (patient) => console.log("View patient:", patient),
    },
    {
      type: "edit",
      label: "Edit Patient",
      icon: <Edit className="size-4" />,
      onClick: (patient) => console.log("Edit patient:", patient),
    },
    {
      type: "delete",
      label: "Delete Patient",
      icon: <Trash2 className="size-4" />,
      onClick: (patient) => console.log("Delete patient:", patient),
      disabled: (patient) => patient.medicalStatus === "critical",
    },
  ]

  const handleRowClick = useCallback((patient: Patient) => {
    console.log("Row clicked:", patient)
  }, [])

  const handleSelectionChange = useCallback((selected: Patient[]) => {
    setSelectedPatients(selected)
  }, [])

  const handleExport = useCallback(() => {
    if (selectedPatients.length === 0) {
      alert("Please select patients to export")
      return
    }
    console.log("Exporting patients:", selectedPatients)
  }, [selectedPatients])

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setMedicalStatusFilter("all")
    setGenderFilter("all")
  }, [])

  const hasActiveFilters = searchQuery || statusFilter !== "all" || medicalStatusFilter !== "all" || genderFilter !== "all"

  return (
    <>
      <SiteHeader
        rightActions={
          <Button
            variant={"secondary"} 
            className="h-9 w-full md:h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold text-white text-sm md:text-base"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="sm:inline">Add Patient</span>
          </Button>
        }
      />
      
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Stats Overview - Responsive grid */}
        <div className="mb-4 md:mb-6">
          <SectionCards
            cards={patientStatsCards}
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
                />
                
                {/* Mobile filter toggle */}
                {isMobile && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 flex-shrink-0"
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
                  
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={medicalStatusFilter} onValueChange={setMedicalStatusFilter}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Health Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Health Status</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="recovering">Recovering</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
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
            </div>

            {/* Desktop filters row */}
            {!isMobile && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px] text-sm">
                      <Filter className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={medicalStatusFilter} onValueChange={setMedicalStatusFilter}>
                    <SelectTrigger className="w-[160px] text-sm">
                      <Activity className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Health Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Health Status</SelectItem>
                      <SelectItem value="stable">Stable</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="recovering">Recovering</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={genderFilter} onValueChange={setGenderFilter}>
                    <SelectTrigger className="w-[140px] text-sm">
                      <User className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-9 text-sm"
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
                  <span className="text-xs md:text-sm text-muted-foreground">Filtered:</span>
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
                  {medicalStatusFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {medicalStatusFilter}
                    </Badge>
                  )}
                  {genderFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {genderFilter}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs h-6">
                    {filteredPatients.length} of {mockPatients.length}
                  </Badge>
                </div>
              )}

              {/* Selected actions */}
              {selectedPatients.length > 0 && (
                <div className="flex items-center gap-1 md:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="h-8 md:h-9 text-xs md:text-sm"
                  >
                    <Download className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">Exp</span>
                    <span className="ml-1">({selectedPatients.length})</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="border-none shadow-none">
          <CardContent className={cn("p-0", isMobile ? "px-2" : "px-6")}>
            <div className="overflow-x-auto">
              <DataTable
                title="Patients"
                description="Manage and view all patient records"
                data={filteredPatients}
                fields={isMobile ? mobilePatientFields : patientFields}
                actions={patientActions}
                loading={false}
                enableSelection={isMobile ? false : true}
                enablePagination={true}
                pageSize={isMobile ? 6 : 8}
                onRowClick={handleRowClick}
                onSelectionChange={handleSelectionChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <AddPatientSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </>
  )
}
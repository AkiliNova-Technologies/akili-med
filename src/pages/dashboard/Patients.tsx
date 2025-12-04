// app/patients/page.tsx
"use client"

import { useState } from "react"
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
  // MoreVertical,
  User,
  Phone,
  Mail,
  Calendar,
  Activity,
  Eye,
  Edit,
  Trash2
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

// Table fields configuration
const patientFields: TableField<Patient>[] = [
  {
    key: "patientId",
    header: "Patient ID",
    cell: (value) => (
      <span className="font-medium">
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
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
          <User className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-sm text-muted-foreground">
            {row.age} yrs • {row.gender}
          </div>
        </div>
      </div>
    ),
    width: "200px",
    enableSorting: true,
  },
  {
    key: "contactInfo",
    header: "Contact Information",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{row.email}</span>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">{row.phone}</span>
        </div>
      </div>
    ),
    width: "200px",
  },
  {
    key: "medicalInfo",
    header: "Medical Information",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Activity className="h-3 w-3 text-muted-foreground" />
          <span className="text-sm">Blood Type: {row.bloodType}</span>
        </div>
        <div className="text-sm text-muted-foreground">
          Dr. {row.primaryDoctor.split("Dr. ")[1]}
        </div>
      </div>
    ),
    width: "180px",
  },
  {
    key: "appointments",
    header: "Appointments",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="text-sm">
          <span className="text-muted-foreground">Last:</span>{" "}
          {row.lastVisit ? new Date(row.lastVisit).toLocaleDateString() : "Never"}
        </div>
        <div className="text-sm">
          <span className="text-muted-foreground">Next:</span>{" "}
          {row.nextAppointment 
            ? new Date(row.nextAppointment).toLocaleDateString() 
            : "Not scheduled"}
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
        active: { label: "Active", variant: "outline" as const, color: "bg-green-500" },
        inactive: { label: "Inactive", variant: "outline" as const, color: "bg-gray-500" },
        pending: { label: "Pending", variant: "outline" as const, color: "bg-yellow-500" }
      }
      const config = statusConfig[status]
      return (
        <Badge variant={config.variant} className="gap-1 px-3 rounded-sm">
          <div className={`h-1.5 w-1.5 rounded-full ${config.color}`} />
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
    header: "Health Status",
    cell: (value) => {
      const status = value as Patient["medicalStatus"]
      const statusConfig = {
        stable: { label: "Stable", variant: "outline" as const, color: "text-green-600" },
        critical: { label: "Critical", variant: "outline" as const, color: "text-red-600" },
        recovering: { label: "Recovering", variant: "outline" as const, color: "text-blue-600" }
      }
      const config = statusConfig[status]
      return (
        <Badge variant={config.variant} className={cn(config.color, "rounded-sm px-3")}>
          {config.label}
        </Badge>
      )
    },
    width: "120px",
    align: "center",
    enableSorting: true,
  },
]

// Search input component
function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-10", className)}
        placeholder="Search patients by name, ID, email..."
        {...props}  // This spreads all props including onChange, value, etc.
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

  // Filter patients based on search and filters
  const filteredPatients = mockPatients.filter((patient) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      patient.fullName.toLowerCase().includes(searchLower) ||
      patient.patientId.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      patient.phone.includes(searchQuery)

    // Status filter
    const matchesStatus = 
      statusFilter === "all" || patient.status === statusFilter

    // Medical status filter
    const matchesMedicalStatus = 
      medicalStatusFilter === "all" || patient.medicalStatus === medicalStatusFilter

    // Gender filter
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
      onClick: (patient) => {
        console.log("View patient:", patient)
        // Navigate to patient details
      },
    },
    {
      type: "edit",
      label: "Edit Patient",
      icon: <Edit className="size-4" />,
      onClick: (patient) => {
        console.log("Edit patient:", patient)
        // Open edit modal
      },
    },
    {
      type: "delete",
      label: "Delete Patient",
      icon: <Trash2 className="size-4" />,
      onClick: (patient) => {
        console.log("Delete patient:", patient)
        // Show delete confirmation
      },
      disabled: (patient) => patient.medicalStatus === "critical", // Fixed: comparing medicalStatus, not status
    },
  ]

  // Handle row click
  const handleRowClick = (patient: Patient) => {
    console.log("Row clicked:", patient)
    // Navigate to patient details
  }

  // Handle selection change
  const handleSelectionChange = (selected: Patient[]) => {
    setSelectedPatients(selected)
    console.log("Selected patients:", selected.length)
  }

  // Export selected patients
  const handleExport = () => {
    if (selectedPatients.length === 0) {
      alert("Please select patients to export")
      return
    }
    console.log("Exporting patients:", selectedPatients)
    // Implement export logic
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setStatusFilter("all")
    setMedicalStatusFilter("all")
    setGenderFilter("all")
  }

  return (
    <>
      <SiteHeader
        rightActions={
          <Button
          variant={"secondary"} 
            className="h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold text-white"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Patient
          </Button>
        }
      />
      
      <div className="min-h-screen p-6">
        {/* Stats Overview using SectionCards */}
        <div className="mb-6">
          <SectionCards
            cards={patientStatsCards}
            layout="1x4"
            className="gap-4"
          />
        </div>

        {/* Search and Filters */}
        <Card className="mb-6 border-none shadow-none">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-1 flex-col gap-4 sm:flex-row">
                <SearchInput
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="sm:w-[450px]"
                />
                
                <div className="flex flex-wrap gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
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
                    <SelectTrigger className="w-[200px]">
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
                    <SelectTrigger className="w-[180px]">
                      <User className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Gender</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-10"
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {selectedPatients.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="h-10"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export ({selectedPatients.length})
                  </Button>
                )}
                {/* <Button
                  variant="outline"
                  size="sm"
                  className="h-10"
                  onClick={() => console.log("More options")}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button> */}
              </div>
            </div>
            
            {/* Filter summary */}
            {(searchQuery || statusFilter !== "all" || medicalStatusFilter !== "all" || genderFilter !== "all") && (
              <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Filtered:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1">
                    Search: "{searchQuery}"
                  </Badge>
                )}
                {statusFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Status: {statusFilter}
                  </Badge>
                )}
                {medicalStatusFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Health: {medicalStatusFilter}
                  </Badge>
                )}
                {genderFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Gender: {genderFilter}
                  </Badge>
                )}
                <Badge variant="outline">
                  {filteredPatients.length} of {mockPatients.length} patients
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patients Table */}
        <Card className="border-none shadow-none">
          <CardContent className="px-6">
            <DataTable
              title="Patients"
              description="Manage and view all patient records"
              data={filteredPatients}
              fields={patientFields}
              actions={patientActions}
              loading={false}
              enableSelection={true}
              enablePagination={true}
              pageSize={8}
              onRowClick={handleRowClick}
              onSelectionChange={handleSelectionChange}
            />
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
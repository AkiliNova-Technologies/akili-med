// app/contacts/page.tsx
"use client"

import { useState, useCallback, useMemo } from "react"
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
  Eye,
  Edit,
  Trash2,
  User,
  Users,
  Phone,
  Mail,
  MapPin,
  Building,
  Briefcase,
  Grid,
  List,
  Star,
  Calendar,
  MessageSquare,
  Heart,
  AlertCircle,
  CheckCircle,
  UserMinus
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
import { AddContactSheet } from "@/components/add-contact-sheet"

// Define contact data type
interface Contact {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  phone: string
  mobile?: string
  type: "individual" | "company" | "doctor" | "supplier" | "patient" | "employee"
  category: string
  company?: string
  jobTitle?: string
  department?: string
  status: "active" | "inactive" | "pending"
  isEmergencyContact: boolean
  isPrimaryContact: boolean
  lastContact: string
  nextFollowUp?: string
  address?: string
  city?: string
  state?: string
  notes?: string
  [key: string]: any
}

// Mock contact data
const mockContacts: Contact[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    mobile: "+1 (555) 987-6543",
    type: "individual",
    category: "business",
    company: "Acme Corporation",
    jobTitle: "Sales Manager",
    department: "Sales",
    status: "active",
    isEmergencyContact: false,
    isPrimaryContact: true,
    lastContact: "2024-02-15",
    nextFollowUp: "2024-03-15",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    notes: "Key client, prefers email communication"
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Johnson",
    fullName: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    type: "doctor",
    category: "medical",
    company: "General Hospital",
    jobTitle: "Cardiologist",
    department: "Cardiology",
    status: "active",
    isEmergencyContact: true,
    isPrimaryContact: true,
    lastContact: "2024-02-20",
    address: "456 Oak Avenue",
    city: "Boston",
    state: "MA",
    notes: "Referral partner, responds quickly to calls"
  },
  {
    id: "3",
    firstName: "Robert",
    lastName: "Chen",
    fullName: "Robert Chen",
    email: "robert.c@example.com",
    phone: "+1 (555) 345-6789",
    mobile: "+1 (555) 876-5432",
    type: "supplier",
    category: "suppliers",
    company: "MedSupply Inc.",
    jobTitle: "Account Manager",
    department: "Sales",
    status: "active",
    isEmergencyContact: false,
    isPrimaryContact: true,
    lastContact: "2024-02-18",
    nextFollowUp: "2024-03-01",
    address: "789 Pine Road",
    city: "Chicago",
    state: "IL",
    notes: "Medical supplies vendor, 24-hour delivery"
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    fullName: "Emily Williams",
    email: "emily.w@example.com",
    phone: "+1 (555) 456-7890",
    type: "patient",
    category: "medical",
    status: "active",
    isEmergencyContact: true,
    isPrimaryContact: false,
    lastContact: "2024-02-10",
    nextFollowUp: "2024-04-10",
    address: "321 Elm Street",
    city: "San Francisco",
    state: "CA",
    notes: "Annual checkup scheduled for April"
  },
  {
    id: "5",
    firstName: "Michael",
    lastName: "Brown",
    fullName: "Michael Brown",
    email: "michael.b@example.com",
    phone: "+1 (555) 567-8901",
    mobile: "+1 (555) 765-4321",
    type: "employee",
    category: "staff",
    company: "HealthCare Clinic",
    jobTitle: "Nurse Practitioner",
    department: "Clinical",
    status: "active",
    isEmergencyContact: false,
    isPrimaryContact: true,
    lastContact: "2024-02-22",
    address: "654 Birch Lane",
    city: "Seattle",
    state: "WA",
    notes: "Staff contact, works night shifts"
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Taylor",
    fullName: "Lisa Taylor",
    email: "lisa.t@example.com",
    phone: "+1 (555) 678-9012",
    type: "individual",
    category: "personal",
    status: "inactive",
    isEmergencyContact: false,
    isPrimaryContact: false,
    lastContact: "2023-12-05",
    address: "987 Cedar Court",
    city: "Miami",
    state: "FL",
    notes: "Moved to different city, keep in records"
  },
  {
    id: "7",
    company: "XYZ Pharmaceuticals",
    firstName: "XYZ",
    lastName: "Pharmaceuticals",
    fullName: "XYZ Pharmaceuticals",
    email: "orders@xyzpharma.com",
    phone: "+1 (555) 789-0123",
    type: "company",
    category: "suppliers",
    jobTitle: "Corporate Account",
    status: "active",
    isEmergencyContact: false,
    isPrimaryContact: false,
    lastContact: "2024-02-25",
    nextFollowUp: "2024-03-25",
    address: "147 Pharma Drive",
    city: "Newark",
    state: "NJ",
    notes: "Bulk medication supplier, net 30 terms"
  },
  {
    id: "8",
    firstName: "David",
    lastName: "Miller",
    fullName: "David Miller",
    email: "david.m@example.com",
    phone: "+1 (555) 890-1234",
    mobile: "+1 (555) 321-0987",
    type: "doctor",
    category: "medical",
    company: "City Medical Center",
    jobTitle: "Pediatrician",
    department: "Pediatrics",
    status: "pending",
    isEmergencyContact: false,
    isPrimaryContact: false,
    lastContact: "2024-02-28",
    nextFollowUp: "2024-03-07",
    address: "258 Maple Avenue",
    city: "Denver",
    state: "CO",
    notes: "New referral, awaiting confirmation"
  },
  {
    id: "9",
    firstName: "Amanda",
    lastName: "Davis",
    fullName: "Amanda Davis",
    email: "amanda.d@example.com",
    phone: "+1 (555) 901-2345",
    type: "patient",
    category: "medical",
    status: "active",
    isEmergencyContact: false,
    isPrimaryContact: true,
    lastContact: "2024-02-12",
    nextFollowUp: "2024-05-12",
    address: "369 Spruce Street",
    city: "Atlanta",
    state: "GA",
    notes: "Regular patient, prefers morning appointments"
  },
  {
    id: "10",
    firstName: "James",
    lastName: "Wilson",
    fullName: "James Wilson",
    email: "james.w@example.com",
    phone: "+1 (555) 012-3456",
    mobile: "+1 (555) 210-9876",
    type: "supplier",
    category: "business",
    company: "Office Supplies Co.",
    jobTitle: "Sales Director",
    department: "Sales",
    status: "active",
    isEmergencyContact: false,
    isPrimaryContact: false,
    lastContact: "2024-02-08",
    nextFollowUp: "2024-03-08",
    address: "741 Oak Lane",
    city: "Phoenix",
    state: "AZ",
    notes: "Office supplies, 10% discount for bulk orders"
  }
]

// Table fields configuration
const contactFields: TableField<Contact>[] = [
  {
    key: "fullName",
    header: "Contact",
    cell: (value, row) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
          {row.type === "company" ? (
            <Building className="h-5 w-5 text-primary" />
          ) : row.type === "doctor" ? (
            <Heart className="h-5 w-5 text-primary" />
          ) : (
            <User className="h-5 w-5 text-primary" />
          )}
        </div>
        <div>
          <div className="font-medium">{value as string}</div>
          <div className="text-sm text-muted-foreground">
            {row.type === "company" ? "Company" : 
             row.type === "doctor" ? "Medical Professional" :
             row.type === "supplier" ? "Supplier" :
             row.type === "patient" ? "Patient" :
             row.type === "employee" ? "Employee" : "Individual"}
            {row.jobTitle && ` • ${row.jobTitle}`}
          </div>
        </div>
      </div>
    ),
    width: "220px",
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
        {row.mobile && (
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <Phone className="h-3 w-3" />
            <span>Mobile: {row.mobile}</span>
          </div>
        )}
      </div>
    ),
    width: "200px",
  },
  {
    key: "companyInfo",
    header: "Company/Organization",
    cell: (_, row) => (
      <div className="space-y-1">
        {row.company ? (
          <>
            <div className="font-medium">{row.company}</div>
            {row.department && (
              <div className="text-sm text-muted-foreground">
                {row.department}
              </div>
            )}
            {row.address && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span>{row.city}, {row.state}</span>
              </div>
            )}
          </>
        ) : (
          <div className="text-sm text-muted-foreground italic">
            No company info
          </div>
        )}
      </div>
    ),
    width: "180px",
    enableSorting: true,
  },
  {
    key: "contactHistory",
    header: "Contact History",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>Last: {new Date(row.lastContact).toLocaleDateString()}</span>
        </div>
        {row.nextFollowUp && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <MessageSquare className="h-3 w-3" />
            <span>Follow-up: {new Date(row.nextFollowUp).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    ),
    width: "160px",
    enableSorting: true,
  },
  {
    key: "category",
    header: "Category",
    cell: (value) => {
      const category = value as string
      const categoryConfig = {
        medical: { color: "text-red-600", bg: "bg-red-50", icon: <Heart className="h-3 w-3" /> },
        business: { color: "text-blue-600", bg: "bg-blue-50", icon: <Briefcase className="h-3 w-3" /> },
        personal: { color: "text-green-600", bg: "bg-green-50", icon: <User className="h-3 w-3" /> },
        suppliers: { color: "text-purple-600", bg: "bg-purple-50", icon: <Building className="h-3 w-3" /> },
        staff: { color: "text-orange-600", bg: "bg-orange-50", icon: <Users className="h-3 w-3" /> },
      }
      const config = categoryConfig[category as keyof typeof categoryConfig] || { 
        color: "text-gray-600", 
        bg: "bg-gray-50", 
        icon: <User className="h-3 w-3" />
      }
      
      return (
        <Badge variant="outline" className={cn("gap-2 px-3 rounded-sm")}>
          {config.icon}
          <span className="capitalize">{category}</span>
        </Badge>
      )
    },
    width: "120px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as Contact["status"]
      const statusConfig = {
        active: { 
          label: "Active", 
          variant: "outline" as const, 
          color: "text-green-600 ",
          icon: <CheckCircle className="h-3 w-3" />
        },
        inactive: { 
          label: "Inactive", 
          variant: "outline" as const, 
          color: "text-gray-600 ",
          icon: <UserMinus className="h-3 w-3" />
        },
        pending: { 
          label: "Pending", 
          variant: "outline" as const, 
          color: "text-yellow-600",
          icon: <AlertCircle className="h-3 w-3" />
        }
      }
      const config = statusConfig[status]
      return (
        <Badge variant={config.variant} className={cn("gap-2 px-3 rounded-sm", config.color)}>
          {config.icon}
          {config.label}
        </Badge>
      )
    },
    width: "100px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "emergencyContact",
    header: "Emergency",
    cell: (_, row) => (
      <div className="flex flex-col items-center gap-1">
        {row.isEmergencyContact ? (
          <>
            <Badge variant="destructive" className="gap-1 px-2 text-xs rounded-sm">
              <AlertCircle className="h-3 w-3" />
              Emergency
            </Badge>
            {row.isPrimaryContact && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-2 w-2 mr-1 fill-yellow-500 text-yellow-500" />
                Primary
              </Badge>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">-</span>
        )}
      </div>
    ),
    width: "120px",
    align: "center",
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
        placeholder="Search contacts by name, email, phone, company..."
        {...props}
      />
    </div>
  )
}

// Calculate stats
const calculateStats = (contacts: Contact[]) => ({
  total: contacts.length,
  active: contacts.filter(c => c.status === "active").length,
  doctors: contacts.filter(c => c.type === "doctor").length,
  patients: contacts.filter(c => c.type === "patient").length,
  emergencyContacts: contacts.filter(c => c.isEmergencyContact).length,
  suppliers: contacts.filter(c => c.type === "supplier").length,
  companies: contacts.filter(c => c.type === "company").length,
})

export default function ContactsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([])

  // Filter contacts based on search and filters
  const filteredContacts = useMemo(() => mockContacts.filter((contact) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      contact.fullName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.jobTitle && contact.jobTitle.toLowerCase().includes(searchLower))

    // Status filter
    const matchesStatus = 
      statusFilter === "all" || contact.status === statusFilter

    // Type filter
    const matchesType = 
      typeFilter === "all" || contact.type === typeFilter

    // Category filter
    const matchesCategory = 
      categoryFilter === "all" || contact.category === categoryFilter

    return matchesSearch && matchesStatus && matchesType && matchesCategory
  }), [searchQuery, statusFilter, typeFilter, categoryFilter])

  // Calculate stats for filtered contacts
  const stats = useMemo(() => calculateStats(filteredContacts), [filteredContacts])

  // Card data for SectionCards
  const contactStatsCards: CardData[] = [
    {
      title: "Total Contacts",
      value: stats.total.toString(),
      icon: <User className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All contacts in address book",
      change: {
        value: "12%",
        trend: "up",
        description: "from last month"
      }
    },
    {
      title: "Active Contacts",
      value: stats.active.toString(),
      icon: <CheckCircle className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Currently active contacts",
      change: {
        value: "8",
        trend: "up",
        description: "new contacts"
      }
    },
    {
      title: "Medical Contacts",
      value: (stats.doctors + stats.patients).toString(),
      icon: <Heart className="size-4" />,
      iconBgColor: "bg-red-400 dark:bg-red-900/20",
      footerDescription: "Doctors & patients",
      change: {
        value: "5%",
        trend: "up",
        description: "from last quarter"
      }
    },
    {
      title: "Emergency Contacts",
      value: stats.emergencyContacts.toString(),
      icon: <AlertCircle className="size-4" />,
      iconBgColor: "bg-orange-400 dark:bg-orange-900/20",
      footerDescription: "Emergency contact list",
      change: {
        value: "2",
        trend: "up",
        description: "new emergency contacts"
      }
    }
  ]

  // Table actions
  const contactActions: TableAction<Contact>[] = [
    {
      type: "view",
      label: "View Contact",
      icon: <Eye className="size-4" />,
      onClick: (contact) => {
        console.log("View contact:", contact)
        // Navigate to contact details
      },
    },
    {
      type: "edit",
      label: "Edit Contact",
      icon: <Edit className="size-4" />,
      onClick: (contact) => {
        console.log("Edit contact:", contact)
        // Open edit modal
      },
    },
    {
      type: "delete",
      label: "Delete Contact",
      icon: <Trash2 className="size-4" />,
      onClick: (contact) => {
        console.log("Delete contact:", contact)
        // Show delete confirmation
      },
      disabled: (contact) => contact.isEmergencyContact && contact.status === "active", // Cannot delete active emergency contacts
    },
  ]

  // Handle row click
  const handleRowClick = useCallback((contact: Contact) => {
    console.log("Row clicked:", contact)
    // Navigate to contact details
  }, [])

  // Handle selection change
  const handleSelectionChange = useCallback((selected: Contact[]) => {
    setSelectedContacts(selected)
    console.log("Selected contacts:", selected.length)
  }, [])

  // Export selected contacts
  const handleExport = useCallback(() => {
    if (selectedContacts.length === 0) {
      alert("Please select contacts to export")
      return
    }
    console.log("Exporting contacts:", selectedContacts)
    // Implement export logic
  }, [selectedContacts])

  // Send email to selected contacts
  const handleSendEmail = useCallback(() => {
    if (selectedContacts.length === 0) {
      alert("Please select contacts to email")
      return
    }
    console.log("Sending email to:", selectedContacts)
    // Implement email logic
  }, [selectedContacts])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setCategoryFilter("all")
  }, [])

  // Get unique types
  const contactTypes = [
    { value: "individual", label: "Individual" },
    { value: "company", label: "Company" },
    { value: "doctor", label: "Doctor" },
    { value: "supplier", label: "Supplier" },
    { value: "patient", label: "Patient" },
    { value: "employee", label: "Employee" },
  ]

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mockContacts.map(c => c.category)))
    return uniqueCategories.map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  }, [])

  // Contact Card Component for Grid View
  const ContactCard = ({ contact }: { contact: Contact }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow shadow-none border-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex h-12 w-12 items-center justify-center rounded-full",
              contact.type === "company" ? "bg-blue-100" :
              contact.type === "doctor" ? "bg-red-100" :
              contact.type === "supplier" ? "bg-purple-100" :
              "bg-primary/10"
            )}>
              {contact.type === "company" ? (
                <Building className="h-6 w-6 text-blue-600" />
              ) : contact.type === "doctor" ? (
                <Heart className="h-6 w-6 text-red-600" />
              ) : contact.type === "supplier" ? (
                <Building className="h-6 w-6 text-purple-600" />
              ) : (
                <User className="h-6 w-6 text-primary" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{contact.fullName}</h3>
              <p className="text-sm text-muted-foreground capitalize">
                {contact.type}
                {contact.jobTitle && ` • ${contact.jobTitle}`}
              </p>
            </div>
          </div>
          {contact.isEmergencyContact && (
            <Badge variant="destructive" className="text-xs">
              <AlertCircle className="h-3 w-3 mr-1" />
              Emergency
            </Badge>
          )}
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            <Mail className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-3 w-3 text-muted-foreground" />
            <span className="text-sm">{contact.phone}</span>
          </div>
          {contact.company && (
            <div className="flex items-center gap-2">
              <Building className="h-3 w-3 text-muted-foreground" />
              <span className="text-sm">{contact.company}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <Badge variant="outline" className="capitalize">
            {contact.category}
          </Badge>
          <Badge variant="outline" className={cn(
            contact.status === "active" ? "text-green-600 border-green-200" :
            contact.status === "inactive" ? "text-gray-600 border-gray-200" :
            "text-yellow-600 border-yellow-200"
          )}>
            {contact.status}
          </Badge>
        </div>

        <div className="space-y-1 text-sm mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3" />
            <span>Last contact: {new Date(contact.lastContact).toLocaleDateString()}</span>
          </div>
          {contact.nextFollowUp && (
            <div className="flex items-center gap-1 text-green-600">
              <MessageSquare className="h-3 w-3" />
              <span>Follow-up: {new Date(contact.nextFollowUp).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  )

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
            Add Contact
          </Button>
        }
      />
      
      <div className="min-h-screen p-6">
        {/* Stats Overview using SectionCards */}
        <div className="mb-6">
          <SectionCards
            cards={contactStatsCards}
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
                    <SelectTrigger className="w-[180px]">
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
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <User className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {contactTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Briefcase className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
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
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-10 w-[50px] rounded-none border-r",
                    viewMode === "grid" 
                    ? "bg-[#e11d48] text-white hover:bg-[#e11d48]/80" 
                    : "bg-transparent text-muted-foreground hover:bg-gray-100"
                  )}
                  >
                  <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-10 w-[50px] rounded-none",
                    viewMode === "list" 
                    ? "bg-[#e11d48] text-white hover:bg-[#e11d48]/80" 
                    : "bg-transparent text-muted-foreground hover:bg-gray-100"
                  )}
                  >
                  <List className="h-4 w-4" />
                  </Button>
                </div>
                
                {selectedContacts.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      className="h-10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export ({selectedContacts.length})
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSendEmail}
                      className="h-10 bg-blue-600 hover:bg-blue-700"
                    >
                      <Mail className="mr-2 h-4 w-4" />
                      Email ({selectedContacts.length})
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Filter summary */}
            {(searchQuery || statusFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all") && (
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
                {typeFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Type: {typeFilter}
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                  </Badge>
                )}
                <Badge variant="outline">
                  {filteredContacts.length} of {mockContacts.length} contacts
                </Badge>
                {stats.emergencyContacts > 0 && (
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {stats.emergencyContacts} emergency
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contacts Display */}
        {viewMode === "list" ? (
          <Card className="border-none shadow-none">
            <CardContent className="px-6">
              <DataTable
                title="Contacts"
                description="Manage and organize all your contacts"
                data={filteredContacts}
                fields={contactFields}
                actions={contactActions}
                loading={false}
                enableSelection={true}
                enablePagination={true}
                pageSize={8}
                onRowClick={handleRowClick}
                onSelectionChange={handleSelectionChange}
              />
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
            {filteredContacts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No contacts found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AddContactSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </>
  )
}
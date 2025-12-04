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
  UserMinus,
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
import { AddContactSheet } from "@/components/add-contact-sheet"
import { useIsMobile } from "@/hooks/use-mobile"

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

// Desktop table fields configuration
const contactFields: TableField<Contact>[] = [
  {
    key: "fullName",
    header: "Contact",
    cell: (value, row) => (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-primary/10">
          {row.type === "company" ? (
            <Building className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          ) : row.type === "doctor" ? (
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          ) : (
            <User className="h-4 w-4 md:h-5 md:w-5 text-primary" />
          )}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-sm md:text-base truncate">{value as string}</div>
          <div className="text-xs md:text-sm text-muted-foreground truncate">
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
    width: "200px",
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
    key: "companyInfo",
    header: "Company",
    cell: (_, row) => (
      <div className="space-y-1 hidden md:block">
        {row.company ? (
          <>
            <div className="font-medium text-sm">{row.company}</div>
            {row.department && (
              <div className="text-sm text-muted-foreground">
                {row.department}
              </div>
            )}
            {row.city && row.state && (
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
    header: "History",
    cell: (_, row) => (
      <div className="space-y-1 hidden md:block">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Last: {new Date(row.lastContact).toLocaleDateString()}</span>
        </div>
        {row.nextFollowUp && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <MessageSquare className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Next: {new Date(row.nextFollowUp).toLocaleDateString()}</span>
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
      return (
        <Badge variant="outline" className="capitalize text-xs md:text-sm hidden md:block">
          {category}
        </Badge>
      )
    },
    width: "100px",
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
          color: "bg-green-500",
          icon: <CheckCircle className="h-3 w-3" />
        },
        inactive: { 
          label: "Inactive", 
          variant: "outline" as const, 
          color: "bg-gray-500",
          icon: <UserMinus className="h-3 w-3" />
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
    key: "emergencyContact",
    header: "Emergency",
    cell: (_, row) => (
      <div className="hidden md:flex flex-col items-center gap-1">
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
    width: "100px",
    align: "center",
  },
]

// Mobile table fields
const mobileContactFields: TableField<Contact>[] = [
  {
    key: "contactInfo",
    header: "Contact",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex h-8 w-8 items-center justify-center rounded-full",
            row.type === "company" ? "bg-blue-100" :
            row.type === "doctor" ? "bg-red-100" :
            row.type === "supplier" ? "bg-purple-100" :
            "bg-primary/10"
          )}>
            {row.type === "company" ? (
              <Building className="h-4 w-4 text-blue-600" />
            ) : row.type === "doctor" ? (
              <Heart className="h-4 w-4 text-red-600" />
            ) : row.type === "supplier" ? (
              <Building className="h-4 w-4 text-purple-600" />
            ) : (
              <User className="h-4 w-4 text-primary" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-sm truncate">{row.fullName}</div>
            <div className="text-xs text-muted-foreground truncate">
              {row.type} • {row.category}
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {row.status}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground truncate">
          <Mail className="inline h-3 w-3 mr-1" />
          {row.email}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          <Phone className="inline h-3 w-3 mr-1" />
          {row.phone}
        </div>
        {row.company && (
          <div className="text-xs text-muted-foreground truncate">
            <Building className="inline h-3 w-3 mr-1" />
            {row.company}
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {row.isEmergencyContact && (
              <Badge variant="destructive" className="text-xs">
                Emergency
              </Badge>
            )}
            {row.isPrimaryContact && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-2 w-2 mr-1 fill-yellow-500 text-yellow-500" />
                Primary
              </Badge>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Last: {new Date(row.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </div>
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
        placeholder="Search contacts..."
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
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const isMobile = useIsMobile()

  // Filter contacts based on search and filters
  const filteredContacts = useMemo(() => mockContacts.filter((contact) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      contact.fullName.toLowerCase().includes(searchLower) ||
      contact.email.toLowerCase().includes(searchLower) ||
      contact.phone.toLowerCase().includes(searchLower) ||
      (contact.company && contact.company.toLowerCase().includes(searchLower)) ||
      (contact.jobTitle && contact.jobTitle.toLowerCase().includes(searchLower))

    const matchesStatus = 
      statusFilter === "all" || contact.status === statusFilter

    const matchesType = 
      typeFilter === "all" || contact.type === typeFilter

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
      onClick: (contact) => console.log("View contact:", contact),
    },
    {
      type: "edit",
      label: "Edit Contact",
      icon: <Edit className="size-4" />,
      onClick: (contact) => console.log("Edit contact:", contact),
    },
    {
      type: "delete",
      label: "Delete Contact",
      icon: <Trash2 className="size-4" />,
      onClick: (contact) => console.log("Delete contact:", contact),
      disabled: (contact) => contact.isEmergencyContact && contact.status === "active",
    },
  ]

  const handleRowClick = useCallback((contact: Contact) => {
    console.log("Row clicked:", contact)
  }, [])

  const handleSelectionChange = useCallback((selected: Contact[]) => {
    setSelectedContacts(selected)
  }, [])

  const handleExport = useCallback(() => {
    if (selectedContacts.length === 0) {
      alert("Please select contacts to export")
      return
    }
    console.log("Exporting contacts:", selectedContacts)
  }, [selectedContacts])

  const handleSendEmail = useCallback(() => {
    if (selectedContacts.length === 0) {
      alert("Please select contacts to email")
      return
    }
    console.log("Sending email to:", selectedContacts)
  }, [selectedContacts])

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setCategoryFilter("all")
  }, [])

  const hasActiveFilters = searchQuery || statusFilter !== "all" || typeFilter !== "all" || categoryFilter !== "all"

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
      <CardContent className="p-3 md:p-4">
        <div className="flex items-start justify-between mb-2 md:mb-3">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={cn(
              "flex h-8 w-8 md:h-12 md:w-12 items-center justify-center rounded-full",
              contact.type === "company" ? "bg-blue-100" :
              contact.type === "doctor" ? "bg-red-100" :
              contact.type === "supplier" ? "bg-purple-100" :
              "bg-primary/10"
            )}>
              {contact.type === "company" ? (
                <Building className="h-4 w-4 md:h-6 md:w-6 text-blue-600" />
              ) : contact.type === "doctor" ? (
                <Heart className="h-4 w-4 md:h-6 md:w-6 text-red-600" />
              ) : contact.type === "supplier" ? (
                <Building className="h-4 w-4 md:h-6 md:w-6 text-purple-600" />
              ) : (
                <User className="h-4 w-4 md:h-6 md:w-6 text-primary" />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm md:text-lg truncate">{contact.fullName}</h3>
              <p className="text-xs md:text-sm text-muted-foreground capitalize truncate">
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

        <div className="space-y-1 md:space-y-2 mb-2 md:mb-3">
          <div className="flex items-center gap-1 md:gap-2">
            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs md:text-sm truncate">{contact.email}</span>
          </div>
          <div className="flex items-center gap-1 md:gap-2">
            <Phone className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="text-xs md:text-sm">{contact.phone}</span>
          </div>
          {contact.company && (
            <div className="flex items-center gap-1 md:gap-2">
              <Building className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <span className="text-xs md:text-sm truncate">{contact.company}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs md:text-sm mb-2 md:mb-3">
          <Badge variant="outline" className="capitalize text-xs md:text-sm">
            {contact.category}
          </Badge>
          <Badge variant="outline" className={cn(
            "text-xs md:text-sm",
            contact.status === "active" ? "text-green-600 border-green-200" :
            contact.status === "inactive" ? "text-gray-600 border-gray-200" :
            "text-yellow-600 border-yellow-200"
          )}>
            {contact.status}
          </Badge>
        </div>

        <div className="space-y-1 text-xs md:text-sm mb-2 md:mb-3">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span>Last: {new Date(contact.lastContact).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          </div>
          {contact.nextFollowUp && (
            <div className="flex items-center gap-1 text-green-600">
              <MessageSquare className="h-3 w-3 flex-shrink-0" />
              <span>Next: {new Date(contact.nextFollowUp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          )}
        </div>

        <div className="mt-3 md:mt-4 flex gap-1 md:gap-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-7 md:h-8">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" className="flex-1 text-xs md:text-sm h-7 md:h-8">
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
            className="h-9 w-full md:h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold text-white text-sm md:text-base"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="mr-1 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4" />
            <span className="sm:inline">Add Contact</span>
          </Button>
        }
      />
      
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Stats Overview - Responsive grid */}
        <div className="mb-4 md:mb-6">
          <SectionCards
            cards={contactStatsCards}
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
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full text-sm">
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
                    <SelectTrigger className="w-full text-sm">
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
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[140px] text-sm">
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
                    <SelectTrigger className="w-[140px] text-sm">
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
                
                {/* Desktop view mode toggle */}
                <div className="flex border rounded-md overflow-hidden ml-auto">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-9 w-9 rounded-none border-r",
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
                      "h-9 w-9 rounded-none",
                      viewMode === "list" 
                      ? "bg-[#e11d48] text-white hover:bg-[#e11d48]/80" 
                      : "bg-transparent text-muted-foreground hover:bg-gray-100"
                    )}
                  >
                    <List className="h-4 w-4" />
                  </Button>
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
                  {typeFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {typeFilter}
                    </Badge>
                  )}
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {categoryFilter}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs h-6">
                    {filteredContacts.length} of {mockContacts.length}
                  </Badge>
                  {stats.emergencyContacts > 0 && (
                    <Badge variant="outline" className="text-xs h-6 text-red-600">
                      {stats.emergencyContacts} emergency
                    </Badge>
                  )}
                </div>
              )}

              {/* Mobile view mode toggle */}
              {isMobile && (
                <div className="flex border rounded-md overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={cn(
                      "h-8 w-8 rounded-none border-r",
                      viewMode === "grid" 
                      ? "bg-[#e11d48] text-white hover:bg-[#e11d48]/80" 
                      : "bg-transparent text-muted-foreground hover:bg-gray-100"
                    )}
                  >
                    <Grid className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={cn(
                      "h-8 w-8 rounded-none",
                      viewMode === "list" 
                      ? "bg-[#e11d48] text-white hover:bg-[#e11d48]/80" 
                      : "bg-transparent text-muted-foreground hover:bg-gray-100"
                    )}
                  >
                    <List className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Selected actions */}
              {selectedContacts.length > 0 && (
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
                    <span className="ml-1">({selectedContacts.length})</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSendEmail}
                    className="h-8 md:h-9 bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
                  >
                    <Mail className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Email</span>
                    <span className="sm:hidden">Email</span>
                    <span className="ml-1">({selectedContacts.length})</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Contacts Display */}
        {viewMode === "list" ? (
          <Card className="border-none shadow-none">
            <CardContent className={cn("p-0", isMobile ? "px-2" : "px-6")}>
              <div className="overflow-x-auto">
                <DataTable
                  title="Contacts"
                  description="Manage and organize all your contacts"
                  data={filteredContacts}
                  fields={isMobile ? mobileContactFields : contactFields}
                  actions={contactActions}
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
        ) : (
          <div className={cn(
            "grid gap-3 md:gap-4",
            isMobile ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          )}>
            {filteredContacts.map(contact => (
              <ContactCard key={contact.id} contact={contact} />
            ))}
            {filteredContacts.length === 0 && (
              <div className="col-span-full text-center py-8 md:py-12">
                <User className="h-8 w-8 md:h-12 md:w-12 mx-auto text-muted-foreground mb-2 md:mb-4" />
                <h3 className="text-base md:text-lg font-semibold">No contacts found</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
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
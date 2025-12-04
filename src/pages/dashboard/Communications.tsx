// app/communications/page.tsx
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
  MessageSquare,
  Mail,
  Phone,
  User,
  Send,
  Clock,
  Calendar,
  CheckCircle,
  AlertCircle,
  Grid,
  List,
  Paperclip,
  Video,
  FileText
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
import { AddCommunicationSheet } from "@/components/add-communication-sheet"

// Define communication data type
interface Communication {
  id: string
  reference: string
  type: "email" | "phone" | "sms" | "in-person" | "video" | "letter" | "internal-note"
  subject: string
  from: string
  to: string
  content: string
  date: string
  time: string
  duration?: number
  status: "sent" | "delivered" | "read" | "failed" | "scheduled" | "completed" | "missed"
  priority: "low" | "normal" | "high" | "urgent"
  category: string
  followUpRequired: boolean
  followUpDate?: string
  attachments: number
  relatedTo?: string
  tags: string[]
  [key: string]: any
}

// Mock communication data
const mockCommunications: Communication[] = [
  {
    id: "1",
    reference: "COM-2024-001",
    type: "email",
    subject: "Appointment Confirmation - Annual Checkup",
    from: "Dr. Sarah Smith",
    to: "John Doe (Patient)",
    content: "Your annual checkup is confirmed for March 15, 2024 at 10:00 AM...",
    date: "2024-02-15",
    time: "14:30",
    duration: 5,
    status: "read",
    priority: "normal",
    category: "appointment",
    followUpRequired: false,
    attachments: 1,
    tags: ["appointment", "confirmation", "patient"]
  },
  {
    id: "2",
    reference: "COM-2024-002",
    type: "phone",
    subject: "Follow-up call regarding test results",
    from: "Nurse Emily Jones",
    to: "Jane Smith (Patient)",
    content: "Discussed recent blood test results. All levels are within normal range...",
    date: "2024-02-18",
    time: "11:15",
    duration: 12,
    status: "completed",
    priority: "high",
    category: "medical",
    followUpRequired: true,
    followUpDate: "2024-03-01",
    attachments: 0,
    tags: ["test-results", "follow-up", "medical"]
  },
  {
    id: "3",
    reference: "COM-2024-003",
    type: "sms",
    subject: "Reminder: Medication Refill Due",
    from: "Automated System",
    to: "Robert Johnson (Patient)",
    content: "Your medication refill is due in 3 days. Please contact pharmacy...",
    date: "2024-02-20",
    time: "09:00",
    status: "sent",
    priority: "normal",
    category: "medication",
    followUpRequired: false,
    attachments: 0,
    tags: ["reminder", "medication", "automated"]
  },
  {
    id: "4",
    reference: "COM-2024-004",
    type: "video",
    subject: "Telemedicine Consultation - Cardiology",
    from: "Dr. Michael Chen",
    to: "Sarah Williams (Patient)",
    content: "Video consultation regarding cardiac health. Recommended lifestyle changes...",
    date: "2024-02-22",
    time: "15:45",
    duration: 30,
    status: "completed",
    priority: "high",
    category: "medical",
    followUpRequired: true,
    followUpDate: "2024-03-22",
    attachments: 2,
    tags: ["telemedicine", "cardiology", "consultation"]
  },
  {
    id: "5",
    reference: "COM-2024-005",
    type: "in-person",
    subject: "Staff Meeting - Weekly Updates",
    from: "Clinic Director",
    to: "All Staff",
    content: "Weekly staff meeting covering operational updates, patient feedback...",
    date: "2024-02-23",
    time: "10:00",
    duration: 60,
    status: "completed",
    priority: "normal",
    category: "administrative",
    followUpRequired: false,
    attachments: 3,
    tags: ["staff", "meeting", "administrative"]
  },
  {
    id: "6",
    reference: "COM-2024-006",
    type: "email",
    subject: "Billing Inquiry - Invoice #INV-456",
    from: "Billing Department",
    to: "Acme Corporation",
    content: "Following up on outstanding invoice #INV-456. Payment due by March 1...",
    date: "2024-02-25",
    time: "16:20",
    status: "delivered",
    priority: "high",
    category: "billing",
    followUpRequired: true,
    followUpDate: "2024-03-05",
    attachments: 1,
    tags: ["billing", "invoice", "corporate"]
  },
  {
    id: "7",
    reference: "COM-2024-007",
    type: "letter",
    subject: "Official Medical Records Request",
    from: "Medical Records Department",
    to: "XYZ Insurance Co.",
    content: "Official request for medical records release. Authorization form attached...",
    date: "2024-02-26",
    time: "13:10",
    status: "sent",
    priority: "normal",
    category: "records",
    followUpRequired: false,
    attachments: 2,
    tags: ["records", "legal", "insurance"]
  },
  {
    id: "8",
    reference: "COM-2024-008",
    type: "internal-note",
    subject: "Patient Note - Progress Update",
    from: "Dr. Sarah Smith",
    to: "Clinical Team",
    content: "Patient showing good progress with new medication regimen. Monitor closely...",
    date: "2024-02-27",
    time: "09:30",
    status: "read",
    priority: "normal",
    category: "medical",
    followUpRequired: false,
    attachments: 0,
    tags: ["patient-note", "progress", "internal"]
  },
  {
    id: "9",
    reference: "COM-2024-009",
    type: "sms",
    subject: "Emergency Clinic Hours Update",
    from: "Reception Desk",
    to: "All Patients",
    content: "Emergency clinic hours extended this weekend due to flu season...",
    date: "2024-02-28",
    time: "17:45",
    status: "failed",
    priority: "urgent",
    category: "emergency",
    followUpRequired: true,
    followUpDate: "2024-02-29",
    attachments: 0,
    tags: ["emergency", "hours", "announcement"]
  },
  {
    id: "10",
    reference: "COM-2024-010",
    type: "phone",
    subject: "Supplier Order Confirmation",
    from: "Inventory Manager",
    to: "MedSupply Inc.",
    content: "Confirmed order for medical supplies. Delivery expected by March 5...",
    date: "2024-02-29",
    time: "11:30",
    duration: 8,
    status: "completed",
    priority: "normal",
    category: "supplies",
    followUpRequired: false,
    attachments: 0,
    tags: ["supplier", "order", "inventory"]
  }
]

// Table fields configuration
const communicationFields: TableField<Communication>[] = [
  {
    key: "reference",
    header: "Reference",
    cell: (value) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-medium">{value as string}</span>
      </div>
    ),
    width: "130px",
    enableSorting: true,
  },
  {
    key: "communicationDetails",
    header: "Communication",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="font-medium">{row.subject}</div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>From: {row.from}</span>
          </div>
          <div className="flex items-center gap-1">
            <Send className="h-3 w-3" />
            <span>To: {row.to}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          {row.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    ),
    width: "300px",
    enableSorting: true,
  },
  {
    key: "type",
    header: "Type",
    cell: (value) => {
      const type = value as Communication["type"]
      const typeConfig = {
        email: { icon: <Mail className="h-4 w-4" />, color: "text-blue-600", bg: "bg-blue-50", label: "Email" },
        phone: { icon: <Phone className="h-4 w-4" />, color: "text-green-600", bg: "bg-green-50", label: "Phone" },
        sms: { icon: <MessageSquare className="h-4 w-4" />, color: "text-purple-600", bg: "bg-purple-50", label: "SMS" },
        "in-person": { icon: <User className="h-4 w-4" />, color: "text-orange-600", bg: "bg-orange-50", label: "In-Person" },
        video: { icon: <Video className="h-4 w-4" />, color: "text-red-600", bg: "bg-red-50", label: "Video" },
        letter: { icon: <FileText className="h-4 w-4" />, color: "text-yellow-600", bg: "bg-yellow-50", label: "Letter" },
        "internal-note": { icon: <MessageSquare className="h-4 w-4" />, color: "text-gray-600", bg: "bg-gray-50", label: "Internal Note" },
      }
      const config = typeConfig[type]
      
      return (
        <Badge variant="outline" className={cn("gap-2 px-3 rounded-sm",)}>
          {config.icon}
          {config.label}
        </Badge>
      )
    },
    width: "140px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "dateTime",
    header: "Date & Time",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
          <span>{new Date(row.date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{row.time}</span>
          {row.duration && (
            <span className="text-muted-foreground">({row.duration} min)</span>
          )}
        </div>
      </div>
    ),
    width: "150px",
    enableSorting: true,
  },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as Communication["status"]
      const statusConfig = {
        sent: { 
          label: "Sent", 
          variant: "outline" as const, 
          color: "text-blue-600",
          icon: <Send className="h-3 w-3" />
        },
        delivered: { 
          label: "Delivered", 
          variant: "outline" as const, 
          color: "text-green-600 ",
          icon: <CheckCircle className="h-3 w-3" />
        },
        read: { 
          label: "Read", 
          variant: "outline" as const, 
          color: "text-purple-600",
          icon: <CheckCircle className="h-3 w-3" />
        },
        failed: { 
          label: "Failed", 
          variant: "outline" as const, 
          color: "text-red-600",
          icon: <AlertCircle className="h-3 w-3" />
        },
        scheduled: { 
          label: "Scheduled", 
          variant: "outline" as const, 
          color: "text-yellow-600",
          icon: <Clock className="h-3 w-3" />
        },
        completed: { 
          label: "Completed", 
          variant: "outline" as const, 
          color: "text-green-600",
          icon: <CheckCircle className="h-3 w-3" />
        },
        missed: { 
          label: "Missed", 
          variant: "outline" as const, 
          color: "text-gray-600 ",
          icon: <AlertCircle className="h-3 w-3" />
        }
      }
      const config = statusConfig[status]
      return (
        <Badge variant={config.variant} className={cn("gap-2 px-3 rounded-sm",)}>
          {config.icon}
          {config.label}
        </Badge>
      )
    },
    width: "120px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "priority",
    header: "Priority",
    cell: (value) => {
      const priority = value as Communication["priority"]
      const priorityConfig = {
        low: { 
          label: "Low", 
          variant: "outline" as const, 
          color: "text-gray-600"
        },
        normal: { 
          label: "Normal", 
          variant: "outline" as const, 
          color: "text-blue-600"
        },
        high: { 
          label: "High", 
          variant: "outline" as const, 
          color: "text-orange-600 "
        },
        urgent: { 
          label: "Urgent", 
          variant: "outline" as const, 
          color: "text-red-600"
        }
      }
      const config = priorityConfig[priority]
      return (
        <Badge variant={config.variant} className={cn("rounded-sm px-3", config.color)}>
          {config.label}
        </Badge>
      )
    },
    width: "100px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "attachments",
    header: "Attachments",
    cell: (value) => {
      const count = value as number
      return (
        <div className="flex items-center justify-center">
          {count > 0 ? (
            <Badge variant="outline" className="gap-1">
              <Paperclip className="h-3 w-3" />
              {count}
            </Badge>
          ) : (
            <span className="text-sm text-muted-foreground">-</span>
          )}
        </div>
      )
    },
    width: "100px",
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
        placeholder="Search communications by subject, reference, content..."
        {...props}
      />
    </div>
  )
}

// Calculate stats
const calculateStats = (communications: Communication[]) => ({
  total: communications.length,
  sent: communications.filter(c => c.status === "sent" || c.status === "delivered" || c.status === "read").length,
  completed: communications.filter(c => c.status === "completed").length,
  failed: communications.filter(c => c.status === "failed").length,
  followUpRequired: communications.filter(c => c.followUpRequired).length,
  emails: communications.filter(c => c.type === "email").length,
  calls: communications.filter(c => c.type === "phone").length,
  urgent: communications.filter(c => c.priority === "urgent").length,
})

export default function CommunicationsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [viewMode, setViewMode] = useState<"timeline" | "list">("list")
  const [selectedCommunications, setSelectedCommunications] = useState<Communication[]>([])

  // Filter communications based on search and filters
  const filteredCommunications = useMemo(() => mockCommunications.filter((communication) => {
    // Search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      communication.reference.toLowerCase().includes(searchLower) ||
      communication.subject.toLowerCase().includes(searchLower) ||
      communication.content.toLowerCase().includes(searchLower) ||
      communication.from.toLowerCase().includes(searchLower) ||
      communication.to.toLowerCase().includes(searchLower) ||
      communication.tags.some(tag => tag.toLowerCase().includes(searchLower))

    // Status filter
    const matchesStatus = 
      statusFilter === "all" || communication.status === statusFilter

    // Type filter
    const matchesType = 
      typeFilter === "all" || communication.type === typeFilter

    // Priority filter
    const matchesPriority = 
      priorityFilter === "all" || communication.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesType && matchesPriority
  }), [searchQuery, statusFilter, typeFilter, priorityFilter])

  // Calculate stats for filtered communications
  const stats = useMemo(() => calculateStats(filteredCommunications), [filteredCommunications])

  // Card data for SectionCards
  const communicationStatsCards: CardData[] = [
    {
      title: "Total Communications",
      value: stats.total.toString(),
      icon: <MessageSquare className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All communications recorded",
      change: {
        value: "18%",
        trend: "up",
        description: "from last month"
      }
    },
    {
      title: "Successful",
      value: stats.sent.toString(),
      icon: <CheckCircle className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Sent/Delivered/Read",
      change: {
        value: "12%",
        trend: "up",
        description: "improvement"
      }
    },
    {
      title: "Follow-up Required",
      value: stats.followUpRequired.toString(),
      icon: <Clock className="size-4" />,
      iconBgColor: "bg-yellow-400 dark:bg-yellow-900/20",
      footerDescription: "Requires follow-up action",
      change: {
        value: "5",
        trend: "up",
        description: "pending follow-ups"
      }
    },
    {
      title: "Email Communications",
      value: stats.emails.toString(),
      icon: <Mail className="size-4" />,
      iconBgColor: "bg-purple-400 dark:bg-purple-900/20",
      footerDescription: "Email-based communications",
      change: {
        value: "22%",
        trend: "up",
        description: "from last quarter"
      }
    }
  ]

  // Table actions
  const communicationActions: TableAction<Communication>[] = [
    {
      type: "view",
      label: "View Communication",
      icon: <Eye className="size-4" />,
      onClick: (communication) => {
        console.log("View communication:", communication)
        // Navigate to communication details
      },
    },
    {
      type: "edit",
      label: "Edit Communication",
      icon: <Edit className="size-4" />,
      onClick: (communication) => {
        console.log("Edit communication:", communication)
        // Open edit modal
      },
      disabled: (communication) => communication.status === "sent" || communication.status === "delivered", // Cannot edit sent communications
    },
    {
      type: "delete",
      label: "Delete Communication",
      icon: <Trash2 className="size-4" />,
      onClick: (communication) => {
        console.log("Delete communication:", communication)
        // Show delete confirmation
      },
      disabled: (communication) => communication.status === "sent" || communication.status === "delivered", // Cannot delete sent communications
    },
  ]

  // Handle row click
  const handleRowClick = useCallback((communication: Communication) => {
    console.log("Row clicked:", communication)
    // Navigate to communication details
  }, [])

  // Handle selection change
  const handleSelectionChange = useCallback((selected: Communication[]) => {
    setSelectedCommunications(selected)
    console.log("Selected communications:", selected.length)
  }, [])

  // Export selected communications
  const handleExport = useCallback(() => {
    if (selectedCommunications.length === 0) {
      alert("Please select communications to export")
      return
    }
    console.log("Exporting communications:", selectedCommunications)
    // Implement export logic
  }, [selectedCommunications])

  // Resend failed communications
  const handleResend = useCallback(() => {
    const failedComms = selectedCommunications.filter(c => c.status === "failed")
    if (failedComms.length === 0) {
      alert("No failed communications selected")
      return
    }
    console.log("Resending communications:", failedComms)
    // Implement resend logic
  }, [selectedCommunications])

  // Mark as read
  const handleMarkAsRead = useCallback(() => {
    const unreadComms = selectedCommunications.filter(c => c.status === "sent" || c.status === "delivered")
    if (unreadComms.length === 0) {
      alert("No unread communications selected")
      return
    }
    console.log("Marking as read:", unreadComms)
    // Implement mark as read logic
  }, [selectedCommunications])

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setTypeFilter("all")
    setPriorityFilter("all")
  }, [])

  // Get unique types
  const communicationTypes = [
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "sms", label: "SMS" },
    { value: "in-person", label: "In-Person" },
    { value: "video", label: "Video" },
    { value: "letter", label: "Letter" },
    { value: "internal-note", label: "Internal Note" },
  ]


  // Communication Timeline Component for Timeline View
  const CommunicationTimelineItem = ({ communication, index }: { communication: Communication, index: number }) => {
    const typeColors = {
      email: "border-blue-500",
      phone: "border-green-500",
      sms: "border-purple-500",
      "in-person": "border-orange-500",
      video: "border-red-500",
      letter: "border-yellow-500",
      "internal-note": "border-gray-500",
    }

    const statusColors = {
      sent: "bg-blue-500",
      delivered: "bg-green-500",
      read: "bg-purple-500",
      failed: "bg-red-500",
      scheduled: "bg-yellow-500",
      completed: "bg-green-500",
      missed: "bg-gray-500",
    }

    return (
      <div className="relative flex gap-4">
        {/* Timeline line */}
        {index < filteredCommunications.length - 1 && (
          <div className="absolute left-6 top-8 h-full w-0.5 bg-gray-200" />
        )}
        
        {/* Timeline dot */}
        <div className={cn(
          "relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 bg-white",
          typeColors[communication.type]
        )}>
          {communication.type === "email" ? (
            <Mail className="h-5 w-5 text-blue-600" />
          ) : communication.type === "phone" ? (
            <Phone className="h-5 w-5 text-green-600" />
          ) : communication.type === "sms" ? (
            <MessageSquare className="h-5 w-5 text-purple-600" />
          ) : communication.type === "in-person" ? (
            <User className="h-5 w-5 text-orange-600" />
          ) : communication.type === "video" ? (
            <Video className="h-5 w-5 text-red-600" />
          ) : communication.type === "letter" ? (
            <FileText className="h-5 w-5 text-yellow-600" />
          ) : (
            <MessageSquare className="h-5 w-5 text-gray-600" />
          )}
          <div className={cn(
            "absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white",
            statusColors[communication.status]
          )} />
        </div>

        {/* Content */}
        <Card className="flex-1 hover:shadow-md transition-shadow shadow-none border-none">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{communication.subject}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span>{communication.reference}</span>
                  <span>•</span>
                  <span>{communication.time}</span>
                  {communication.duration && (
                    <>
                      <span>•</span>
                      <span>{communication.duration} min</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {communication.priority}
                </Badge>
                {communication.followUpRequired && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Follow-up
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Send className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">From:</span>
                  <span>{communication.from}</span>
                </div>
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3 text-muted-foreground" />
                  <span className="font-medium">To:</span>
                  <span>{communication.to}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {communication.content}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex flex-wrap gap-1">
                {communication.tags.slice(0, 3).map((tag, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {communication.tags.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{communication.tags.length - 3}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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
            Add Communication
          </Button>
        }
      />
      
      <div className="min-h-screen p-6">
        {/* Stats Overview using SectionCards */}
        <div className="mb-6">
          <SectionCards
            cards={communicationStatsCards}
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
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-[180px]">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {communicationTypes.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[180px]">
                      <AlertCircle className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
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
                  variant={viewMode === "timeline" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("timeline")}
                  className={cn(
                    "h-10 w-[50px] rounded-none border-r",
                    viewMode === "timeline" 
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
                
                {selectedCommunications.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      className="h-10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export ({selectedCommunications.length})
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleResend}
                      className="h-10 bg-yellow-600 hover:bg-yellow-700"
                    >
                      <Send className="mr-2 h-4 w-4" />
                      Resend Failed
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleMarkAsRead}
                      className="h-10 bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Mark as Read
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Filter summary */}
            {(searchQuery || statusFilter !== "all" || typeFilter !== "all" || priorityFilter !== "all") && (
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
                {priorityFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Priority: {priorityFilter}
                  </Badge>
                )}
                <Badge variant="outline">
                  {filteredCommunications.length} of {mockCommunications.length} communications
                </Badge>
                {stats.failed > 0 && (
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {stats.failed} failed
                  </Badge>
                )}
                {stats.followUpRequired > 0 && (
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    {stats.followUpRequired} follow-up
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Communications Display */}
        {viewMode === "list" ? (
          <Card className="border-none shadow-none">
            <CardContent className="px-6">
              <DataTable
                title="Communications"
                description="Track and manage all communications"
                data={filteredCommunications}
                fields={communicationFields}
                actions={communicationActions}
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
          <div className="space-y-6">
            {filteredCommunications.map((communication, index) => (
              <CommunicationTimelineItem 
                key={communication.id} 
                communication={communication} 
                index={index}
              />
            ))}
            {filteredCommunications.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No communications found</h3>
                <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <AddCommunicationSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </>
  )
}
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
  Receipt,
  DollarSign,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Building,
  FileText,
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
import { AddExpenseSheet } from "@/components/add-expense-sheet"
import { useIsMobile } from "@/hooks/use-mobile"

// Define expense data type
interface Expense {
  id: string
  expenseNumber: string
  description: string
  category: string
  subcategory: string
  vendor: string
  amount: number
  tax: number
  totalAmount: number
  expenseDate: string
  dueDate: string
  paymentDate?: string
  paymentMethod: string
  status: "paid" | "pending" | "approved" | "rejected" | "draft"
  priority: "low" | "normal" | "high" | "urgent"
  requiresApproval: boolean
  isRecurring: boolean
  receiptNumber?: string
  department: string
  [key: string]: any
}

// Mock expense data
const mockExpenses: Expense[] = [
  {
    id: "1",
    expenseNumber: "EXP-2024-001",
    description: "Medical supplies restock - Bandages & Dressings",
    category: "medical-supplies",
    subcategory: "bandages",
    vendor: "MedSupply Inc.",
    amount: 1250.50,
    tax: 112.55,
    totalAmount: 1363.05,
    expenseDate: "2024-02-15",
    dueDate: "2024-03-15",
    paymentDate: "2024-02-28",
    paymentMethod: "Bank Transfer",
    status: "paid",
    priority: "normal",
    requiresApproval: false,
    isRecurring: true,
    receiptNumber: "RCPT-789012",
    department: "clinical"
  },
  {
    id: "2",
    expenseNumber: "EXP-2024-002",
    description: "Office software subscription renewal",
    category: "software",
    subcategory: "subscriptions",
    vendor: "Microsoft",
    amount: 499.99,
    tax: 45.00,
    totalAmount: 544.99,
    expenseDate: "2024-02-20",
    dueDate: "2024-03-20",
    paymentDate: "2024-02-25",
    paymentMethod: "Credit Card",
    status: "paid",
    priority: "normal",
    requiresApproval: false,
    isRecurring: true,
    receiptNumber: "RCPT-345678",
    department: "it"
  },
  {
    id: "3",
    expenseNumber: "EXP-2024-003",
    description: "Emergency equipment repair - X-ray machine",
    category: "equipment",
    subcategory: "maintenance",
    vendor: "MedEquip Ltd.",
    amount: 3250.00,
    tax: 292.50,
    totalAmount: 3542.50,
    expenseDate: "2024-02-10",
    dueDate: "2024-02-25",
    paymentDate: "2024-02-22",
    paymentMethod: "Bank Transfer",
    status: "paid",
    priority: "high",
    requiresApproval: true,
    isRecurring: false,
    receiptNumber: "RCPT-901234",
    department: "radiology"
  },
  {
    id: "4",
    expenseNumber: "EXP-2024-004",
    description: "Monthly utility bills - Electricity & Water",
    category: "utilities",
    subcategory: "electricity",
    vendor: "Local Utility Company",
    amount: 850.75,
    tax: 76.57,
    totalAmount: 927.32,
    expenseDate: "2024-02-05",
    dueDate: "2024-02-28",
    paymentMethod: "Direct Debit",
    status: "pending",
    priority: "normal",
    requiresApproval: false,
    isRecurring: true,
    receiptNumber: "RCPT-567890",
    department: "facilities"
  },
  {
    id: "5",
    expenseNumber: "EXP-2024-005",
    description: "New diagnostic equipment - Ultrasound machine",
    category: "equipment",
    subcategory: "diagnostic",
    vendor: "Medical Devices Corp.",
    amount: 12500.00,
    tax: 1125.00,
    totalAmount: 13625.00,
    expenseDate: "2024-02-18",
    dueDate: "2024-03-18",
    paymentMethod: "Bank Transfer",
    status: "approved",
    priority: "high",
    requiresApproval: true,
    isRecurring: false,
    receiptNumber: "RCPT-123456",
    department: "clinical"
  },
  {
    id: "6",
    expenseNumber: "EXP-2024-006",
    description: "Office furniture - Reception area chairs",
    category: "office-supplies",
    subcategory: "furniture",
    vendor: "Office Depot",
    amount: 1200.00,
    tax: 108.00,
    totalAmount: 1308.00,
    expenseDate: "2024-02-12",
    dueDate: "2024-03-12",
    paymentDate: "2024-02-28",
    paymentMethod: "Credit Card",
    status: "paid",
    priority: "normal",
    requiresApproval: false,
    isRecurring: false,
    receiptNumber: "RCPT-234567",
    department: "administration"
  },
  {
    id: "7",
    expenseNumber: "EXP-2024-007",
    description: "Marketing campaign - Social media advertising",
    category: "marketing",
    subcategory: "advertising",
    vendor: "Facebook Ads",
    amount: 750.00,
    tax: 67.50,
    totalAmount: 817.50,
    expenseDate: "2024-02-25",
    dueDate: "2024-03-10",
    paymentMethod: "Credit Card",
    status: "pending",
    priority: "normal",
    requiresApproval: true,
    isRecurring: false,
    department: "marketing"
  },
  {
    id: "8",
    expenseNumber: "EXP-2024-008",
    description: "Quarterly insurance premium",
    category: "insurance",
    subcategory: "premium",
    vendor: "HealthCare Insurers",
    amount: 4200.00,
    tax: 378.00,
    totalAmount: 4578.00,
    expenseDate: "2024-02-28",
    dueDate: "2024-03-15",
    paymentMethod: "Bank Transfer",
    status: "draft",
    priority: "normal",
    requiresApproval: true,
    isRecurring: true,
    department: "administration"
  },
  {
    id: "9",
    expenseNumber: "EXP-2024-009",
    description: "Employee training - CPR certification",
    category: "professional-fees",
    subcategory: "training",
    vendor: "Red Cross",
    amount: 850.00,
    tax: 76.50,
    totalAmount: 926.50,
    expenseDate: "2024-02-08",
    dueDate: "2024-02-22",
    paymentDate: "2024-02-15",
    paymentMethod: "Check",
    status: "paid",
    priority: "normal",
    requiresApproval: true,
    isRecurring: false,
    receiptNumber: "RCPT-890123",
    department: "hr"
  },
  {
    id: "10",
    expenseNumber: "EXP-2024-010",
    description: "Pharmaceutical inventory restock",
    category: "medications",
    subcategory: "inventory",
    vendor: "PharmaDist Co.",
    amount: 5800.00,
    tax: 522.00,
    totalAmount: 6322.00,
    expenseDate: "2024-02-22",
    dueDate: "2024-03-08",
    paymentMethod: "Bank Transfer",
    status: "rejected",
    priority: "high",
    requiresApproval: true,
    isRecurring: false,
    department: "pharmacy"
  }
]

// Desktop table fields configuration
const expenseFields: TableField<Expense>[] = [
  {
    key: "expenseNumber",
    header: "Expense #",
    cell: (value) => (
      <span className="font-mono font-medium text-sm md:text-base">
        {value as string}
      </span>
    ),
    width: "140px",
    enableSorting: true,
  },
  {
    key: "description",
    header: "Description",
    cell: (value, row) => (
      <div className="space-y-1 min-w-0">
        <div className="font-medium text-sm md:text-base truncate">{value as string}</div>
        <div className="flex items-center gap-2 text-xs md:text-sm text-muted-foreground truncate">
          <Building className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{row.vendor}</span>
        </div>
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className="text-xs capitalize">
            {row.category.replace('-', ' ')}
          </Badge>
          {row.isRecurring && (
            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-transparent hidden md:inline-flex">
              Recurring
            </Badge>
          )}
          {row.requiresApproval && (
            <Badge variant="outline" className="text-xs bg-yellow-50 dark:bg-transparent hidden md:inline-flex">
              Needs Approval
            </Badge>
          )}
        </div>
      </div>
    ),
    width: "250px",
    enableSorting: true,
  },
  {
    key: "amountDetails",
    header: "Amount",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="font-medium text-red-600 text-sm md:text-base">
          -${row.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="text-xs md:text-sm text-muted-foreground hidden md:block">
          Base: ${row.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        {row.tax > 0 && (
          <div className="text-xs md:text-sm text-orange-600 hidden md:block">
            Tax: ${row.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </div>
        )}
      </div>
    ),
    width: "150px",
    enableSorting: true,
  },
  {
    key: "dates",
    header: "Dates",
    cell: (_, row) => (
      <div className="space-y-1 hidden md:block">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Expense: {new Date(row.expenseDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Due: {new Date(row.dueDate).toLocaleDateString()}</span>
        </div>
        {row.paymentDate && (
          <div className="flex items-center gap-2 text-sm text-green-600">
            <CheckCircle className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">Paid: {new Date(row.paymentDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    ),
    width: "180px",
    enableSorting: true,
  },
  {
    key: "paymentMethod",
    header: "Payment",
    cell: (value) => (
      <Badge variant="outline" className="rounded-sm px-2 md:px-3 text-xs md:text-sm hidden md:block">
        {value as string}
      </Badge>
    ),
    width: "120px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as Expense["status"]
      const statusConfig = {
        paid: { 
          label: "Paid", 
          variant: "outline" as const, 
          color: "bg-green-500",
          icon: <CheckCircle className="h-3 w-3" />
        },
        pending: { 
          label: "Pending", 
          variant: "outline" as const, 
          color: "bg-yellow-500",
          icon: <Clock className="h-3 w-3" />
        },
        approved: { 
          label: "Approved", 
          variant: "outline" as const, 
          color: "bg-blue-500",
          icon: <CheckCircle className="h-3 w-3" />
        },
        rejected: { 
          label: "Rejected", 
          variant: "outline" as const, 
          color: "bg-red-500",
          icon: <AlertCircle className="h-3 w-3" />
        },
        draft: { 
          label: "Draft", 
          variant: "outline" as const, 
          color: "bg-gray-500",
          icon: <FileText className="h-3 w-3" />
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
    key: "priority",
    header: "Priority",
    cell: (value) => {
      const priority = value as Expense["priority"]
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
          color: "text-orange-600"
        },
        urgent: { 
          label: "Urgent", 
          variant: "outline" as const, 
          color: "text-red-600"
        }
      }
      const config = priorityConfig[priority]
      return (
        <Badge variant={config.variant} className={cn("rounded-sm px-2 md:px-3 text-xs md:text-sm hidden md:block", config.color)}>
          {config.label}
        </Badge>
      )
    },
    width: "100px",
    align: "center",
    enableSorting: true,
  },
]

// Mobile table fields
const mobileExpenseFields: TableField<Expense>[] = [
  {
    key: "expenseInfo",
    header: "Expense",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono font-medium text-sm">{row.expenseNumber}</span>
          <Badge variant="outline" className="text-xs">
            {row.status}
          </Badge>
        </div>
        <div className="font-medium text-sm line-clamp-2 text-wrap truncate">{row.description}</div>
        <div className="text-xs text-muted-foreground truncate">
          <Building className="inline h-3 w-3 mr-1" />
          {row.vendor}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs capitalize">
            {row.category.replace('-', ' ')}
          </Badge>
          {row.isRecurring && (
            <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-transparent">
              Recurring
            </Badge>
          )}
        </div>
        <div className="flex items-center justify-between text-sm">
          <div>
            <div className="font-medium text-red-600">-${row.totalAmount.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">
              {row.paymentMethod}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">
              Due: {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
            <Badge variant="outline" className={cn(
              "text-xs mt-1",
              row.priority === "urgent" ? "text-red-600" :
              row.priority === "high" ? "text-orange-600" :
              row.priority === "normal" ? "text-blue-600" :
              "text-gray-600"
            )}>
              {row.priority}
            </Badge>
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
        placeholder="Search expenses..."
        {...props}
      />
    </div>
  )
}

// Calculate stats
const calculateStats = (expenses: Expense[]) => ({
  total: expenses.length,
  paid: expenses.filter(e => e.status === "paid").length,
  pending: expenses.filter(e => e.status === "pending" || e.status === "approved").length,
  draft: expenses.filter(e => e.status === "draft").length,
  totalAmount: expenses.reduce((sum, expense) => sum + expense.totalAmount, 0),
  pendingAmount: expenses
    .filter(e => e.status === "pending" || e.status === "approved")
    .reduce((sum, expense) => sum + expense.totalAmount, 0),
  recurring: expenses.filter(e => e.isRecurring).length,
  requiresApproval: expenses.filter(e => e.requiresApproval).length,
})

export default function ExpensesPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priorityFilter, setPriorityFilter] = useState<string>("all")
  const [selectedExpenses, setSelectedExpenses] = useState<Expense[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const isMobile = useIsMobile()

  // Filter expenses based on search and filters
  const filteredExpenses = useMemo(() => mockExpenses.filter((expense) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      expense.expenseNumber.toLowerCase().includes(searchLower) ||
      expense.description.toLowerCase().includes(searchLower) ||
      expense.vendor.toLowerCase().includes(searchLower) ||
      (expense.receiptNumber && expense.receiptNumber.toLowerCase().includes(searchLower))

    const matchesStatus = 
      statusFilter === "all" || expense.status === statusFilter

    const matchesCategory = 
      categoryFilter === "all" || expense.category === categoryFilter

    const matchesPriority = 
      priorityFilter === "all" || expense.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  }), [searchQuery, statusFilter, categoryFilter, priorityFilter])

  // Calculate stats for filtered expenses
  const stats = useMemo(() => calculateStats(filteredExpenses), [filteredExpenses])

  // Card data for SectionCards
  const expenseStatsCards: CardData[] = [
    {
      title: "Total Expenses",
      value: stats.total.toString(),
      icon: <Receipt className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All expenses recorded",
      change: {
        value: "15%",
        trend: "up",
        description: "from last month"
      }
    },
    {
      title: "Total Amount",
      value: `$${(stats.totalAmount / 1000).toFixed(1)}k`,
      icon: <DollarSign className="size-4" />,
      iconBgColor: "bg-red-400 dark:bg-red-900/20",
      footerDescription: "Total expenses amount",
      change: {
        value: "22%",
        trend: "up",
        description: "from last quarter"
      }
    },
    {
      title: "Pending Amount",
      value: `$${(stats.pendingAmount / 1000).toFixed(1)}k`,
      icon: <Clock className="size-4" />,
      iconBgColor: "bg-yellow-400 dark:bg-yellow-900/20",
      footerDescription: "Awaiting payment",
      change: {
        value: "8%",
        trend: "down",
        description: "from last week"
      }
    },
    {
      title: "Recurring Expenses",
      value: stats.recurring.toString(),
      icon: <TrendingUp className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Regular repeating expenses",
      change: {
        value: "3",
        trend: "up",
        description: "new recurring"
      }
    }
  ]

  // Table actions
  const expenseActions: TableAction<Expense>[] = [
    {
      type: "view",
      label: "View Expense",
      icon: <Eye className="size-4" />,
      onClick: (expense) => console.log("View expense:", expense),
    },
    {
      type: "edit",
      label: "Edit Expense",
      icon: <Edit className="size-4" />,
      onClick: (expense) => console.log("Edit expense:", expense),
      disabled: (expense) => expense.status === "paid",
    },
    {
      type: "delete",
      label: "Delete Expense",
      icon: <Trash2 className="size-4" />,
      onClick: (expense) => console.log("Delete expense:", expense),
      disabled: (expense) => expense.status === "paid",
    },
  ]

  const handleRowClick = useCallback((expense: Expense) => {
    console.log("Row clicked:", expense)
  }, [])

  const handleSelectionChange = useCallback((selected: Expense[]) => {
    setSelectedExpenses(selected)
  }, [])

  const handleExport = useCallback(() => {
    if (selectedExpenses.length === 0) {
      alert("Please select expenses to export")
      return
    }
    console.log("Exporting expenses:", selectedExpenses)
  }, [selectedExpenses])

  const handleMarkAsPaid = useCallback(() => {
    if (selectedExpenses.length === 0) {
      alert("Please select expenses to mark as paid")
      return
    }
    console.log("Marking as paid:", selectedExpenses)
  }, [selectedExpenses])

  const handleRequestApproval = useCallback(() => {
    const needsApproval = selectedExpenses.filter(e => e.requiresApproval && e.status === "draft")
    if (needsApproval.length === 0) {
      alert("No expenses require approval or are not in draft status")
      return
    }
    console.log("Requesting approval for:", needsApproval)
  }, [selectedExpenses])

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setPriorityFilter("all")
  }, [])

  const hasActiveFilters = searchQuery || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mockExpenses.map(e => e.category)))
    return uniqueCategories.map(cat => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')
    }))
  }, [])

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
            <span className="sm:inline">Add Expense</span>
          </Button>
        }
      />
      
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Stats Overview - Responsive grid */}
        <div className="mb-4 md:mb-6">
          <SectionCards
            cards={expenseStatsCards}
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
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
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
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-full text-sm">
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
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px] text-sm">
                      <Receipt className="mr-2 h-4 w-4" />
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
                  
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger className="w-[140px] text-sm">
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
                  {categoryFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {categoryFilter}
                    </Badge>
                  )}
                  {priorityFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {priorityFilter}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs h-6">
                    {filteredExpenses.length} of {mockExpenses.length}
                  </Badge>
                  <Badge variant="outline" className="text-xs h-6 text-red-600">
                    -${stats.totalAmount.toLocaleString()}
                  </Badge>
                </div>
              )}

              {/* Selected actions */}
              {selectedExpenses.length > 0 && (
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
                    <span className="ml-1">({selectedExpenses.length})</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleMarkAsPaid}
                    className="h-8 md:h-9 bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                  >
                    <span className="hidden sm:inline">Mark Paid</span>
                    <span className="sm:hidden">Paid</span>
                    <span className="ml-1">({selectedExpenses.length})</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleRequestApproval}
                    className="h-8 md:h-9 bg-blue-600 hover:bg-blue-700 text-xs md:text-sm"
                  >
                    <span className="hidden sm:inline">Request Approval</span>
                    <span className="sm:hidden">Approve</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expenses Table */}
        <Card className="border-none shadow-none">
          <CardContent className={cn("p-0", isMobile ? "px-2" : "px-6")}>
            <div className="overflow-x-auto">
              <DataTable
                title="Expenses"
                description="Manage and track all business expenses"
                data={filteredExpenses}
                fields={isMobile ? mobileExpenseFields : expenseFields}
                actions={expenseActions}
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
      
      <AddExpenseSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </>
  )
}
"use client"

import { useState, useCallback } from "react"
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
  FileText,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Mail,
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
import { AddInvoiceSheet } from "@/components/add-invoice-sheet"
import { useIsMobile } from "@/hooks/use-mobile"

// Define invoice data type
interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  amount: number
  tax: number
  discount: number
  totalAmount: number
  issuedDate: string
  dueDate: string
  paidDate?: string
  status: "paid" | "pending" | "overdue" | "draft" | "cancelled"
  paymentMethod: string
  notes?: string
  [key: string]: any
}

// Mock invoice data (same as before)
const mockInvoices: Invoice[] = [
  {
    id: "1",
    invoiceNumber: "INV-2024-001",
    clientName: "John Doe",
    clientEmail: "john.doe@example.com",
    clientPhone: "+1 (555) 123-4567",
    amount: 1500,
    tax: 150,
    discount: 0,
    totalAmount: 1650,
    issuedDate: "2024-01-15",
    dueDate: "2024-02-15",
    paidDate: "2024-02-10",
    status: "paid",
    paymentMethod: "Credit Card",
    notes: "Annual subscription"
  },
  {
    id: "2",
    invoiceNumber: "INV-2024-002",
    clientName: "Jane Smith",
    clientEmail: "jane.smith@example.com",
    clientPhone: "+1 (555) 987-6543",
    amount: 850,
    tax: 85,
    discount: 50,
    totalAmount: 885,
    issuedDate: "2024-01-20",
    dueDate: "2024-02-20",
    status: "pending",
    paymentMethod: "Bank Transfer",
    notes: "Monthly service fee"
  },
  {
    id: "3",
    invoiceNumber: "INV-2024-003",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    clientPhone: "+1 (555) 456-7890",
    amount: 3500,
    tax: 350,
    discount: 200,
    totalAmount: 3650,
    issuedDate: "2024-01-10",
    dueDate: "2024-02-10",
    status: "overdue",
    paymentMethod: "Check",
    notes: "Quarterly services"
  },
  {
    id: "4",
    invoiceNumber: "INV-2024-004",
    clientName: "Robert Johnson",
    clientEmail: "robert.j@example.com",
    clientPhone: "+1 (555) 321-6547",
    amount: 1200,
    tax: 120,
    discount: 0,
    totalAmount: 1320,
    issuedDate: "2024-01-25",
    dueDate: "2024-02-25",
    paidDate: "2024-02-22",
    status: "paid",
    paymentMethod: "PayPal",
    notes: "Consultation services"
  },
  {
    id: "5",
    invoiceNumber: "INV-2024-005",
    clientName: "XYZ Health Services",
    clientEmail: "accounts@xyzhealth.com",
    clientPhone: "+1 (555) 789-0123",
    amount: 5000,
    tax: 500,
    discount: 500,
    totalAmount: 5000,
    issuedDate: "2024-01-18",
    dueDate: "2024-02-18",
    status: "pending",
    paymentMethod: "Bank Transfer",
    notes: "Annual contract"
  },
  {
    id: "6",
    invoiceNumber: "INV-2024-006",
    clientName: "Sarah Williams",
    clientEmail: "sarah.w@example.com",
    clientPhone: "+1 (555) 234-5678",
    amount: 750,
    tax: 75,
    discount: 0,
    totalAmount: 825,
    issuedDate: "2024-01-22",
    dueDate: "2024-02-22",
    status: "draft",
    paymentMethod: "Credit Card",
    notes: "One-time service"
  },
  {
    id: "7",
    invoiceNumber: "INV-2024-007",
    clientName: "Michael Brown",
    clientEmail: "michael.b@example.com",
    clientPhone: "+1 (555) 876-5432",
    amount: 2200,
    tax: 220,
    discount: 100,
    totalAmount: 2320,
    issuedDate: "2024-01-05",
    dueDate: "2024-02-05",
    status: "paid",
    paymentMethod: "Credit Card",
    notes: "Project completion"
  },
  {
    id: "8",
    invoiceNumber: "INV-2024-008",
    clientName: "Emily Davis",
    clientEmail: "emily.d@example.com",
    clientPhone: "+1 (555) 345-6789",
    amount: 1800,
    tax: 180,
    discount: 0,
    totalAmount: 1980,
    issuedDate: "2024-01-28",
    dueDate: "2024-02-28",
    status: "overdue",
    paymentMethod: "Bank Transfer",
    notes: "Monthly retainer"
  },
  {
    id: "9",
    invoiceNumber: "INV-2024-009",
    clientName: "David Miller",
    clientEmail: "david.m@example.com",
    clientPhone: "+1 (555) 654-3210",
    amount: 950,
    tax: 95,
    discount: 50,
    totalAmount: 995,
    issuedDate: "2024-01-12",
    dueDate: "2024-02-12",
    status: "cancelled",
    paymentMethod: "Credit Card",
    notes: "Cancelled order"
  },
  {
    id: "10",
    invoiceNumber: "INV-2024-010",
    clientName: "Lisa Taylor",
    clientEmail: "lisa.t@example.com",
    clientPhone: "+1 (555) 987-1234",
    amount: 3200,
    tax: 320,
    discount: 150,
    totalAmount: 3370,
    issuedDate: "2024-01-30",
    dueDate: "2024-03-01",
    status: "pending",
    paymentMethod: "PayPal",
    notes: "Quarterly subscription"
  }
]

// Table fields configuration - Simplified for mobile
const invoiceFields: TableField<Invoice>[] = [
  {
    key: "invoiceNumber",
    header: "Invoice #",
    cell: (value) => (
      <div className="flex items-center gap-2">
        <span className="font-medium text-sm md:text-base">{value as string}</span>
      </div>
    ),
    width: "140px",
    enableSorting: true,
  },
  {
    key: "clientInfo",
    header: "Client",
    cell: (_, row) => (
      <div className="space-y-1 min-w-0">
        <div className="font-medium text-sm md:text-base truncate">{row.clientName}</div>
        <div className="hidden md:flex items-center gap-2 text-xs md:text-sm text-muted-foreground truncate">
          <Mail className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{row.clientEmail}</span>
        </div>
        <div className="md:hidden text-xs text-muted-foreground truncate">
          {row.clientEmail}
        </div>
      </div>
    ),
    width: "220px",
    enableSorting: true,
  },
  {
    key: "amountInfo",
    header: "Amount",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="font-medium text-sm md:text-base">${row.totalAmount.toLocaleString()}</div>
        <div className="text-xs md:text-sm text-muted-foreground hidden md:block">
          Base: ${row.amount.toLocaleString()}
        </div>
      </div>
    ),
    width: "120px",
    enableSorting: true,
  },
  {
    key: "dates",
    header: "Dates",
    cell: (_, row) => (
      <div className="space-y-1 hidden md:block">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Issued: {new Date(row.issuedDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Due: {new Date(row.dueDate).toLocaleDateString()}</span>
        </div>
      </div>
    ),
    width: "180px",
    enableSorting: true,
  },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as Invoice["status"]
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
        overdue: { 
          label: "Overdue", 
          variant: "outline" as const, 
          color: "bg-red-500",
          icon: <AlertCircle className="h-3 w-3" />
        },
        draft: { 
          label: "Draft", 
          variant: "outline" as const, 
          color: "bg-gray-500",
          icon: <FileText className="h-3 w-3" />
        },
        cancelled: { 
          label: "Cancelled", 
          variant: "outline" as const, 
          color: "bg-gray-400",
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
]

// Mobile table fields (simplified view)
const mobileInvoiceFields: TableField<Invoice>[] = [
  {
    key: "invoiceInfo",
    header: "Invoice",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{row.invoiceNumber}</span>
          <Badge variant="outline" className="text-xs">
            {row.status}
          </Badge>
        </div>
        <div className="font-medium text-sm truncate">{row.clientName}</div>
        <div className="text-xs text-muted-foreground truncate">
          {row.clientEmail}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">${row.totalAmount.toLocaleString()}</span>
          <span className="text-xs text-muted-foreground">
            Due: {new Date(row.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
        placeholder="Search invoices..."
        {...props}
      />
    </div>
  )
}

// Calculate stats
const calculateStats = (invoices: Invoice[]) => ({
  total: invoices.length,
  paid: invoices.filter(i => i.status === "paid").length,
  pending: invoices.filter(i => i.status === "pending").length,
  overdue: invoices.filter(i => i.status === "overdue").length,
  totalAmount: invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0),
  pendingAmount: invoices
    .filter(i => i.status === "pending" || i.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.totalAmount, 0),
})

export default function InvoicesPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const isMobile = useIsMobile()

  // Filter invoices based on search and filters
  const filteredInvoices = mockInvoices.filter((invoice) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      invoice.invoiceNumber.toLowerCase().includes(searchLower) ||
      invoice.clientName.toLowerCase().includes(searchLower) ||
      invoice.clientEmail.toLowerCase().includes(searchLower)

    const matchesStatus = 
      statusFilter === "all" || invoice.status === statusFilter

    const matchesPaymentMethod = 
      paymentMethodFilter === "all" || invoice.paymentMethod.toLowerCase() === paymentMethodFilter

    const matchesDate = dateFilter === "all" || true

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate
  })

  // Calculate stats for filtered invoices
  const stats = calculateStats(filteredInvoices)

  // Card data for SectionCards
  const invoiceStatsCards: CardData[] = [
    {
      title: "Total Invoices",
      value: stats.total.toString(),
      icon: <FileText className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All invoices",
      change: {
        value: "15%",
        trend: "up",
        description: "from last month"
      }
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalAmount / 1000).toFixed(1)}k`,
      icon: <DollarSign className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "All time revenue",
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
        trend: "up",
        description: "from last week"
      }
    },
    {
      title: "Overdue",
      value: stats.overdue.toString(),
      icon: <AlertCircle className="size-4" />,
      iconBgColor: "bg-red-400 dark:bg-red-900/20",
      footerDescription: "Requires attention",
      change: {
        value: "3",
        trend: "up",
        description: "from yesterday"
      }
    }
  ]

  // Table actions
  const invoiceActions: TableAction<Invoice>[] = [
    {
      type: "view",
      label: "View Invoice",
      icon: <Eye className="size-4" />,
      onClick: (invoice) => console.log("View invoice:", invoice),
    },
    {
      type: "edit",
      label: "Edit Invoice",
      icon: <Edit className="size-4" />,
      onClick: (invoice) => console.log("Edit invoice:", invoice),
    },
    {
      type: "delete",
      label: "Delete Invoice",
      icon: <Trash2 className="size-4" />,
      onClick: (invoice) => console.log("Delete invoice:", invoice),
      disabled: (invoice) => invoice.status === "paid",
    },
  ]

  const handleRowClick = useCallback((invoice: Invoice) => {
    console.log("Row clicked:", invoice)
  }, [])

  const handleSelectionChange = useCallback((selected: Invoice[]) => {
    setSelectedInvoices(selected)
  }, [])

  const handleExport = useCallback(() => {
    if (selectedInvoices.length === 0) {
      alert("Please select invoices to export")
      return
    }
    console.log("Exporting invoices:", selectedInvoices)
  }, [selectedInvoices])

  const handleSend = useCallback(() => {
    if (selectedInvoices.length === 0) {
      alert("Please select invoices to send")
      return
    }
    console.log("Sending invoices:", selectedInvoices)
  }, [selectedInvoices])

  const clearFilters = useCallback(() => {
    setSearchQuery("")
    setStatusFilter("all")
    setPaymentMethodFilter("all")
    setDateFilter("all")
  }, [])

  const hasActiveFilters = searchQuery || statusFilter !== "all" || paymentMethodFilter !== "all" || dateFilter !== "all"

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
            <span className="sm:inline">Add Invoice</span>
          </Button>
        }
      />
      
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Stats Overview - Responsive grid */}
        <div className="mb-4 md:mb-6">
          <SectionCards
            cards={invoiceStatsCards}
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
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="credit card">Credit Card</SelectItem>
                      <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
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
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                    <SelectTrigger className="w-[160px] text-sm">
                      <DollarSign className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Methods</SelectItem>
                      <SelectItem value="credit card">Credit Card</SelectItem>
                      <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-[160px] text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
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
                  {paymentMethodFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {paymentMethodFilter}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs h-6">
                    {filteredInvoices.length} of {mockInvoices.length}
                  </Badge>
                </div>
              )}

              {/* Selected actions */}
              {selectedInvoices.length > 0 && (
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
                    <span className="ml-1">({selectedInvoices.length})</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSend}
                    className="h-8 md:h-9 bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                  >
                    <span className="hidden sm:inline">Send</span>
                    <span className="sm:hidden">Send</span>
                    <span className="ml-1">({selectedInvoices.length})</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Invoices Table */}
        <Card className="border-none shadow-none">
          <CardContent className={cn("p-0", isMobile ? "px-2" : "px-6")}>
            <div className="overflow-x-auto">
              <DataTable
                title="Invoices"
                description="Manage and view all invoice records"
                data={filteredInvoices}
                fields={isMobile ? mobileInvoiceFields : invoiceFields}
                actions={invoiceActions}
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
      
      <AddInvoiceSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </>
  )
}
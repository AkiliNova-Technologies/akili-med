// app/payments/page.tsx
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
  CreditCard,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Receipt,
  Mail,
  TrendingDown,
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
import { AddPaymentSheet } from "@/components/add-payment-sheet"
import { useIsMobile } from "@/hooks/use-mobile"

// Define payment data type
interface Payment {
  id: string
  paymentNumber: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientPhone: string
  amount: number
  fees: number
  totalAmount: number
  paymentDate: string
  processedDate: string
  paymentMethod: string
  status: "completed" | "pending" | "failed" | "refunded" | "processing"
  paymentGateway: string
  transactionId: string
  notes?: string
  [key: string]: any
}

// Mock payment data
const mockPayments: Payment[] = [
  {
    id: "1",
    paymentNumber: "PAY-2024-001",
    invoiceNumber: "INV-2024-001",
    clientName: "John Doe",
    clientEmail: "john.doe@example.com",
    clientPhone: "+1 (555) 123-4567",
    amount: 1650,
    fees: 25,
    totalAmount: 1675,
    paymentDate: "2024-02-10",
    processedDate: "2024-02-10",
    paymentMethod: "Credit Card",
    status: "completed",
    paymentGateway: "Stripe",
    transactionId: "txn_123456789",
    notes: "Annual subscription payment"
  },
  {
    id: "2",
    paymentNumber: "PAY-2024-002",
    invoiceNumber: "INV-2024-002",
    clientName: "Jane Smith",
    clientEmail: "jane.smith@example.com",
    clientPhone: "+1 (555) 987-6543",
    amount: 885,
    fees: 15,
    totalAmount: 900,
    paymentDate: "2024-02-18",
    processedDate: "2024-02-19",
    paymentMethod: "Bank Transfer",
    status: "pending",
    paymentGateway: "Manual",
    transactionId: "BT-789012",
    notes: "Monthly service fee"
  },
  {
    id: "3",
    paymentNumber: "PAY-2024-003",
    invoiceNumber: "INV-2024-003",
    clientName: "Acme Corporation",
    clientEmail: "billing@acme.com",
    clientPhone: "+1 (555) 456-7890",
    amount: 3650,
    fees: 0,
    totalAmount: 3650,
    paymentDate: "2024-02-05",
    processedDate: "2024-02-05",
    paymentMethod: "Check",
    status: "completed",
    paymentGateway: "Manual",
    transactionId: "CHK-456789",
    notes: "Quarterly services"
  },
  {
    id: "4",
    paymentNumber: "PAY-2024-004",
    invoiceNumber: "INV-2024-004",
    clientName: "Robert Johnson",
    clientEmail: "robert.j@example.com",
    clientPhone: "+1 (555) 321-6547",
    amount: 1320,
    fees: 20,
    totalAmount: 1340,
    paymentDate: "2024-02-22",
    processedDate: "2024-02-22",
    paymentMethod: "PayPal",
    status: "completed",
    paymentGateway: "PayPal",
    transactionId: "PP-987654321",
    notes: "Consultation services"
  },
  {
    id: "5",
    paymentNumber: "PAY-2024-005",
    invoiceNumber: "INV-2024-005",
    clientName: "XYZ Health Services",
    clientEmail: "accounts@xyzhealth.com",
    clientPhone: "+1 (555) 789-0123",
    amount: 5000,
    fees: 75,
    totalAmount: 5075,
    paymentDate: "2024-02-15",
    processedDate: "2024-02-16",
    paymentMethod: "Bank Transfer",
    status: "processing",
    paymentGateway: "Stripe",
    transactionId: "txn_987654321",
    notes: "Annual contract payment"
  },
  {
    id: "6",
    paymentNumber: "PAY-2024-006",
    invoiceNumber: "INV-2024-007",
    clientName: "Michael Brown",
    clientEmail: "michael.b@example.com",
    clientPhone: "+1 (555) 876-5432",
    amount: 2320,
    fees: 30,
    totalAmount: 2350,
    paymentDate: "2024-02-12",
    processedDate: "2024-02-12",
    paymentMethod: "Credit Card",
    status: "completed",
    paymentGateway: "Stripe",
    transactionId: "txn_456123789",
    notes: "Project completion payment"
  },
  {
    id: "7",
    paymentNumber: "PAY-2024-007",
    invoiceNumber: "INV-2024-010",
    clientName: "Lisa Taylor",
    clientEmail: "lisa.t@example.com",
    clientPhone: "+1 (555) 987-1234",
    amount: 1000,
    fees: 15,
    totalAmount: 1015,
    paymentDate: "2024-02-25",
    processedDate: "2024-02-26",
    paymentMethod: "Credit Card",
    status: "failed",
    paymentGateway: "Stripe",
    transactionId: "txn_failed_123",
    notes: "Card declined"
  },
  {
    id: "8",
    paymentNumber: "PAY-2024-008",
    invoiceNumber: "INV-2024-008",
    clientName: "Emily Davis",
    clientEmail: "emily.d@example.com",
    clientPhone: "+1 (555) 345-6789",
    amount: 500,
    fees: 0,
    totalAmount: 500,
    paymentDate: "2024-02-28",
    processedDate: "2024-02-28",
    paymentMethod: "Cash",
    status: "completed",
    paymentGateway: "Manual",
    transactionId: "CASH-001",
    notes: "Partial payment"
  },
  {
    id: "9",
    paymentNumber: "PAY-2024-009",
    invoiceNumber: "INV-2024-009",
    clientName: "David Miller",
    clientEmail: "david.m@example.com",
    clientPhone: "+1 (555) 654-3210",
    amount: 995,
    fees: 0,
    totalAmount: 995,
    paymentDate: "2024-01-15",
    processedDate: "2024-01-15",
    paymentMethod: "Credit Card",
    status: "refunded",
    paymentGateway: "Stripe",
    transactionId: "txn_refund_456",
    notes: "Refund for cancelled order"
  },
  {
    id: "10",
    paymentNumber: "PAY-2024-010",
    invoiceNumber: "INV-2024-002",
    clientName: "Jane Smith",
    clientEmail: "jane.smith@example.com",
    clientPhone: "+1 (555) 987-6543",
    amount: 500,
    fees: 8,
    totalAmount: 508,
    paymentDate: "2024-03-01",
    processedDate: "2024-03-01",
    paymentMethod: "PayPal",
    status: "completed",
    paymentGateway: "PayPal",
    transactionId: "PP-123456789",
    notes: "Additional payment"
  }
]

// Desktop table fields configuration
const paymentFields: TableField<Payment>[] = [
  {
    key: "paymentNumber",
    header: "Payment #",
    cell: (value) => (
      <span className="font-medium text-sm md:text-base">
        {value as string}
      </span>
    ),
    width: "140px",
    enableSorting: true,
  },
  {
    key: "invoiceInfo",
    header: "Invoice",
    cell: (_, row) => (
      <div className="space-y-1 min-w-0">
        <div className="font-medium text-sm md:text-base">{row.invoiceNumber}</div>
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
    width: "200px",
    enableSorting: true,
  },
  {
    key: "amountInfo",
    header: "Amount",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="font-medium text-sm md:text-base">${row.totalAmount.toLocaleString()}</div>
        <div className="text-xs md:text-sm text-muted-foreground hidden md:block">
          Amount: ${row.amount.toLocaleString()}
          {row.fees > 0 && ` + $${row.fees} fees`}
        </div>
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
          <span className="truncate">Paid: {new Date(row.paymentDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <span className="truncate">Processed: {new Date(row.processedDate).toLocaleDateString()}</span>
        </div>
      </div>
    ),
    width: "180px",
    enableSorting: true,
  },
  {
    key: "paymentMethod",
    header: "Method",
    cell: (value) => {
      const method = value as string
      return (
        <Badge variant="outline" className="rounded-sm px-2 md:px-3 text-xs md:text-sm hidden md:block">
          {method}
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
      const status = value as Payment["status"]
      const statusConfig = {
        completed: { 
          label: "Completed", 
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
        processing: { 
          label: "Processing", 
          variant: "outline" as const, 
          color: "bg-blue-500",
          icon: <Clock className="h-3 w-3" />
        },
        failed: { 
          label: "Failed", 
          variant: "outline" as const, 
          color: "bg-red-500",
          icon: <AlertCircle className="h-3 w-3" />
        },
        refunded: { 
          label: "Refunded", 
          variant: "outline" as const, 
          color: "bg-purple-500",
          icon: <TrendingDown className="h-3 w-3" />
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
    width: "130px",
    align: "center",
    enableSorting: true,
  },
]

// Mobile table fields (simplified view)
const mobilePaymentFields: TableField<Payment>[] = [
  {
    key: "paymentInfo",
    header: "Payment",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm">{row.paymentNumber}</span>
          <Badge variant="outline" className="text-xs">
            {row.status}
          </Badge>
        </div>
        <div className="font-medium text-sm">{row.invoiceNumber}</div>
        <div className="text-sm truncate">{row.clientName}</div>
        <div className="text-xs text-muted-foreground truncate">
          <Mail className="inline h-3 w-3 mr-1" />
          {row.clientEmail}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">${row.totalAmount.toLocaleString()}</span>
          <Badge variant="outline" className="text-xs">
            {row.paymentMethod}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Paid: {new Date(row.paymentDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
        placeholder="Search payments..."
        {...props}
      />
    </div>
  )
}

// Calculate stats
const calculateStats = (payments: Payment[]) => ({
  total: payments.length,
  completed: payments.filter(p => p.status === "completed").length,
  pending: payments.filter(p => p.status === "pending" || p.status === "processing").length,
  failed: payments.filter(p => p.status === "failed").length,
  totalAmount: payments.reduce((sum, payment) => sum + payment.totalAmount, 0),
  completedAmount: payments
    .filter(p => p.status === "completed")
    .reduce((sum, payment) => sum + payment.totalAmount, 0),
  avgPayment: payments.length > 0 ? payments.reduce((sum, payment) => sum + payment.totalAmount, 0) / payments.length : 0,
})

export default function PaymentsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [selectedPayments, setSelectedPayments] = useState<Payment[]>([])
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  
  const isMobile = useIsMobile()

  // Filter payments based on search and filters
  const filteredPayments = mockPayments.filter((payment) => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = 
      !searchQuery ||
      payment.paymentNumber.toLowerCase().includes(searchLower) ||
      payment.invoiceNumber.toLowerCase().includes(searchLower) ||
      payment.clientName.toLowerCase().includes(searchLower) ||
      payment.clientEmail.toLowerCase().includes(searchLower) ||
      payment.transactionId.toLowerCase().includes(searchLower)

    const matchesStatus = 
      statusFilter === "all" || payment.status === statusFilter

    const matchesPaymentMethod = 
      paymentMethodFilter === "all" || payment.paymentMethod.toLowerCase() === paymentMethodFilter

    const matchesDate = dateFilter === "all" || true

    return matchesSearch && matchesStatus && matchesPaymentMethod && matchesDate
  })

  // Calculate stats for filtered payments
  const stats = calculateStats(filteredPayments)

  // Card data for SectionCards
  const paymentStatsCards: CardData[] = [
    {
      title: "Total Payments",
      value: stats.total.toString(),
      icon: <Receipt className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All payments recorded",
      change: {
        value: "18%",
        trend: "up",
        description: "from last month"
      }
    },
    {
      title: "Total Revenue",
      value: `$${(stats.totalAmount / 1000).toFixed(1)}k`,
      icon: <DollarSign className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Total amount processed",
      change: {
        value: "24%",
        trend: "up",
        description: "from last quarter"
      }
    },
    {
      title: "Completed",
      value: stats.completed.toString(),
      icon: <CheckCircle className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Successfully processed",
      change: {
        value: "12%",
        trend: "up",
        description: "from last week"
      }
    },
    {
      title: "Avg Payment",
      value: `$${stats.avgPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      icon: <CreditCard className="size-4" />,
      iconBgColor: "bg-purple-400 dark:bg-purple-900/20",
      footerDescription: "Average payment amount",
      change: {
        value: "8%",
        trend: "up",
        description: "from last month"
      }
    }
  ]

  // Table actions
  const paymentActions: TableAction<Payment>[] = [
    {
      type: "view",
      label: "View Payment",
      icon: <Eye className="size-4" />,
      onClick: (payment) => console.log("View payment:", payment),
    },
    {
      type: "edit",
      label: "Edit Payment",
      icon: <Edit className="size-4" />,
      onClick: (payment) => console.log("Edit payment:", payment),
      disabled: (payment) => payment.status === "completed",
    },
    {
      type: "delete",
      label: "Delete Payment",
      icon: <Trash2 className="size-4" />,
      onClick: (payment) => console.log("Delete payment:", payment),
      disabled: (payment) => payment.status === "completed",
    },
  ]

  const handleRowClick = useCallback((payment: Payment) => {
    console.log("Row clicked:", payment)
  }, [])

  const handleSelectionChange = useCallback((selected: Payment[]) => {
    setSelectedPayments(selected)
  }, [])

  const handleExport = useCallback(() => {
    if (selectedPayments.length === 0) {
      alert("Please select payments to export")
      return
    }
    console.log("Exporting payments:", selectedPayments)
  }, [selectedPayments])

  const handleSendReceipts = useCallback(() => {
    if (selectedPayments.length === 0) {
      alert("Please select payments to send receipts")
      return
    }
    console.log("Sending receipts for:", selectedPayments)
  }, [selectedPayments])

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
            <span className="sm:inline">Add Payment</span>
          </Button>
        }
      />
      
      <div className="min-h-screen p-3 sm:p-4 md:p-6">
        {/* Stats Overview - Responsive grid */}
        <div className="mb-4 md:mb-6">
          <SectionCards
            cards={paymentStatsCards}
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
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
                  
                  <Select value={dateFilter} onValueChange={setDateFilter}>
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
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
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                    <SelectTrigger className="w-[160px] text-sm">
                      <CreditCard className="mr-2 h-4 w-4" />
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
                      <SelectItem value="quarter">This Quarter</SelectItem>
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
                  {dateFilter !== "all" && (
                    <Badge variant="secondary" className="text-xs h-6">
                      {dateFilter}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs h-6">
                    {filteredPayments.length} of {mockPayments.length}
                  </Badge>
                  <Badge variant="outline" className="text-xs h-6 text-green-600">
                    ${stats.totalAmount.toLocaleString()}
                  </Badge>
                </div>
              )}

              {/* Selected actions */}
              {selectedPayments.length > 0 && (
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
                    <span className="ml-1">({selectedPayments.length})</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleSendReceipts}
                    className="h-8 md:h-9 bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                  >
                    <span className="hidden sm:inline">Send Receipts</span>
                    <span className="sm:hidden">Receipts</span>
                    <span className="ml-1">({selectedPayments.length})</span>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card className="border-none shadow-none">
          <CardContent className={cn("p-0", isMobile ? "px-2" : "px-6")}>
            <div className="overflow-x-auto">
              <DataTable
                title="Payments"
                description="Manage and view all payment records"
                data={filteredPayments}
                fields={isMobile ? mobilePaymentFields : paymentFields}
                actions={paymentActions}
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
      
      <AddPaymentSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen} 
      />
    </>
  )
}
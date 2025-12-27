"use client";

import { useState, useCallback, useEffect } from "react";
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
  X,
  Send,
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
import { AddInvoiceSheet } from "@/components/add-invoice-sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { useReduxInvoices } from "@/hooks/useReduxInvoice";
import { InvoiceStatus, type Invoice } from "@/types/invoice";
import { format } from "date-fns";

// Search input component
function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative w-full">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-10 w-full text-sm md:text-base", className)}
        placeholder="Search by invoice #, client, or email..."
        {...props}
      />
    </div>
  );
}

export default function InvoicesPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [selectedInvoices, setSelectedInvoices] = useState<Invoice[]>([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  // const [ setIsEditing] = useState(false);
  // const [ setSelectedInvoice] = useState<Invoice | null>(null);

  const isMobile = useIsMobile();

  // Use the Redux hook
  const {
    invoices,
    stats,
    loading,
    pagination,
    getInvoices,
    getStats,
    removeInvoice,
    send,
  } = useReduxInvoices();

  // Fetch invoices and stats on mount
  useEffect(() => {
    fetchInvoices();
    getStats();
  }, []);

  const fetchInvoices = useCallback(() => {
    const filters: any = {
      page: 1,
      limit: isMobile ? 6 : 8,
    };

    if (searchQuery) filters.search = searchQuery;
    if (statusFilter !== "all") filters.status = [statusFilter.toUpperCase()];
    if (dateFilter !== "all") {
      const today = new Date();
      if (dateFilter === "today") {
        filters.startDate = today.toISOString().split("T")[0];
        filters.endDate = today.toISOString().split("T")[0];
      } else if (dateFilter === "week") {
        const weekAgo = new Date();
        weekAgo.setDate(today.getDate() - 7);
        filters.startDate = weekAgo.toISOString().split("T")[0];
        filters.endDate = today.toISOString().split("T")[0];
      } else if (dateFilter === "month") {
        const monthAgo = new Date();
        monthAgo.setMonth(today.getMonth() - 1);
        filters.startDate = monthAgo.toISOString().split("T")[0];
        filters.endDate = today.toISOString().split("T")[0];
      }
    }

    getInvoices(filters);
  }, [searchQuery, statusFilter, dateFilter, isMobile, getInvoices]);

  // Refresh when filters change
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchInvoices();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [fetchInvoices]);

  // Calculate stats for cards
  const calculateCardStats = () => {
    if (stats) {
      return [
        {
          title: "Total Invoices",
          value: stats.summary.totalInvoices.toString(),
          icon: <FileText className="size-4" />,
          iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
          footerDescription: "All invoices",
          change: {
            value: "15%",
            trend: "up",
            description: "from last month",
          },
        },
        {
          title: "Total Revenue",
          value: `$${(stats.summary.totalAmount / 1000).toFixed(1)}k`,
          icon: <DollarSign className="size-4" />,
          iconBgColor: "bg-green-400 dark:bg-green-900/20",
          footerDescription: "All time revenue",
          change: {
            value: "22%",
            trend: "up",
            description: "from last quarter",
          },
        },
        {
          title: "Outstanding",
          value: `$${(stats.summary.outstandingAmount / 1000).toFixed(1)}k`,
          icon: <Clock className="size-4" />,
          iconBgColor: "bg-yellow-400 dark:bg-yellow-900/20",
          footerDescription: "Awaiting payment",
          change: {
            value: "8%",
            trend: "up",
            description: "from last week",
          },
        },
        {
          title: "Overdue",
          value: `$${(stats.summary.overdueAmount / 1000).toFixed(1)}k`,
          icon: <AlertCircle className="size-4" />,
          iconBgColor: "bg-red-400 dark:bg-red-900/20",
          footerDescription: "Requires attention",
          change: {
            value: "3%",
            trend: "up",
            description: "from yesterday",
          },
        },
      ];
    }

    // Fallback to mock data while loading
    return [
      {
        title: "Total Invoices",
        value: loading ? "..." : invoices.length.toString(),
        icon: <FileText className="size-4" />,
        iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
        footerDescription: "All invoices",
      },
      {
        title: "Total Revenue",
        value: loading ? "..." : "$0.0k",
        icon: <DollarSign className="size-4" />,
        iconBgColor: "bg-green-400 dark:bg-green-900/20",
        footerDescription: "All time revenue",
      },
      {
        title: "Outstanding",
        value: loading ? "..." : "$0.0k",
        icon: <Clock className="size-4" />,
        iconBgColor: "bg-yellow-400 dark:bg-yellow-900/20",
        footerDescription: "Awaiting payment",
      },
      {
        title: "Overdue",
        value: loading ? "..." : "$0.0k",
        icon: <AlertCircle className="size-4" />,
        iconBgColor: "bg-red-400 dark:bg-red-900/20",
        footerDescription: "Requires attention",
      },
    ];
  };

  const invoiceStatsCards = calculateCardStats();

  // Get status color and icon
  const getStatusConfig = (status: InvoiceStatus) => {
    const config = {
      [InvoiceStatus.DRAFT]: {
        label: "Draft",
        color: "bg-gray-500",
        icon: <FileText className="h-3 w-3" />,
      },
      [InvoiceStatus.SENT]: {
        label: "Sent",
        color: "bg-blue-500",
        icon: <Send className="h-3 w-3" />,
      },
      [InvoiceStatus.PARTIAL]: {
        label: "Partial",
        color: "bg-yellow-500",
        icon: <Clock className="h-3 w-3" />,
      },
      [InvoiceStatus.PAID]: {
        label: "Paid",
        color: "bg-green-500",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      [InvoiceStatus.OVERDUE]: {
        label: "Overdue",
        color: "bg-red-500",
        icon: <AlertCircle className="h-3 w-3" />,
      },
      [InvoiceStatus.CANCELLED]: {
        label: "Cancelled",
        color: "bg-gray-400",
        icon: <AlertCircle className="h-3 w-3" />,
      },
    };
    return config[status];
  };

  // Table fields configuration
  const invoiceFields: TableField<Invoice>[] = [
    {
      key: "invoiceNumber",
      header: "Invoice #",
      cell: (value) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <span className="font-medium text-sm md:text-base truncate">
            {value as string}
          </span>
        </div>
      ),
      width: "140px",
      enableSorting: true,
    },
    {
      key: "clientInfo",
      header: "Patient/Client",
      cell: (_, row) => (
        <div className="space-y-1 min-w-0">
          <div className="font-medium text-sm md:text-base truncate">
            {row.client?.companyName ||
              `${row.client?.firstName || ""} ${
                row.client?.lastName || ""
              }`.trim() ||
              "Unknown Client"}
          </div>
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
          <div className="font-medium text-sm md:text-base">
            $
            {row.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground hidden md:block">
            Balance: $
            {(row.balance || 0).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
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
            <span className="truncate">
              Issued: {format(new Date(row.invoiceDate), "MMM dd, yyyy")}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <span className="truncate">
              Due: {format(new Date(row.dueDate), "MMM dd, yyyy")}
            </span>
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
        const status = value as InvoiceStatus;
        const config = getStatusConfig(status);
        const isOverdue =
          status === InvoiceStatus.OVERDUE ||
          (status === InvoiceStatus.SENT &&
            new Date() > new Date((value as any)?.dueDate || new Date()));

        return (
          <Badge
            variant="outline"
            className={cn(
              "gap-1 px-2 md:px-3 text-xs md:text-sm rounded-sm",
              isOverdue && "border-red-200 text-red-700 bg-red-50"
            )}
          >
            <span className="hidden md:inline">{config.icon}</span>
            {config.label}
            {isOverdue && <AlertCircle className="h-3 w-3 ml-1" />}
          </Badge>
        );
      },
      width: "100px",
      align: "center",
      enableSorting: true,
    },
  ];

  // Mobile table fields (simplified view)
  const mobileInvoiceFields: TableField<Invoice>[] = [
    {
      key: "invoiceInfo",
      header: "Invoice",
      cell: (_, row) => {
        const config = getStatusConfig(row.status as InvoiceStatus);
        const isOverdue = row.isOverdue;

        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium text-sm">{row.invoiceNumber}</span>
              </div>
              <Badge
                variant="outline"
                className={cn(
                  "text-xs",
                  isOverdue && "border-red-200 text-red-700 bg-red-50"
                )}
              >
                {config.label}
              </Badge>
            </div>
            <div className="font-medium text-sm truncate">
              {row.client?.companyName ||
                `${row.client?.firstName || ""} ${
                  row.client?.lastName || ""
                }`.trim() ||
                "Unknown Client"}
            </div>
            <div className="text-xs text-muted-foreground truncate">
              {row.clientEmail}
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                $
                {row.total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  Due: {format(new Date(row.dueDate), "MMM dd")}
                </span>
                {isOverdue && <AlertCircle className="h-3 w-3 text-red-500" />}
              </div>
            </div>
          </div>
        );
      },
      enableSorting: true,
    },
  ];

  // Table actions
  const invoiceActions: TableAction<Invoice>[] = [
    {
      type: "view",
      label: "View Invoice",
      icon: <Eye className="size-4" />,
      onClick: (invoice) => handleViewInvoice(invoice),
    },
    {
      type: "edit",
      label: "Edit Invoice",
      icon: <Edit className="size-4" />,
      onClick: (invoice) => handleEditInvoice(invoice),
      disabled: (invoice) => invoice.status !== InvoiceStatus.DRAFT,
    },
    {
      type: "delete",
      label: "Delete Invoice",
      icon: <Trash2 className="size-4" />,
      onClick: (invoice) => handleDeleteInvoice(invoice.id),
      disabled: (invoice) => invoice.status !== InvoiceStatus.DRAFT,
    },
  ];

  const handleCreateInvoice = () => {
    // setSelectedInvoice(null);
    // setIsEditing(false);
    setSheetOpen(true);
  };

  const handleViewInvoice = (_invoice: Invoice) => {
    // setSelectedInvoice(invoice);
    // setIsEditing(false);
    setSheetOpen(true);
  };

  const handleEditInvoice = (_invoice: Invoice) => {
    // setSelectedInvoice(invoice);
    // setIsEditing(true);
    setSheetOpen(true);
  };

  const handleDeleteInvoice = async (id: string) => {
    if (confirm("Are you sure you want to delete this invoice?")) {
      await removeInvoice(id);
      fetchInvoices();
    }
  };

  // const handleDuplicateInvoice = async (id: string) => {
  //   await duplicate(id);
  //   fetchInvoices();
  // };

  // const handleSendInvoice = async (id: string) => {
  //   await send(id, true);
  //   fetchInvoices();
  // };

  const handleRowClick = useCallback((invoice: Invoice) => {
    handleViewInvoice(invoice);
  }, []);

  const handleSelectionChange = useCallback((selected: Invoice[]) => {
    setSelectedInvoices(selected);
  }, []);

  const handleExport = useCallback(() => {
    if (selectedInvoices.length === 0) {
      alert("Please select invoices to export");
      return;
    }
    console.log("Exporting invoices:", selectedInvoices);
    // TODO: Implement export functionality
  }, [selectedInvoices]);

  const handleBulkSend = useCallback(async () => {
    if (selectedInvoices.length === 0) {
      alert("Please select invoices to send");
      return;
    }

    for (const invoice of selectedInvoices) {
      if (invoice.status === InvoiceStatus.DRAFT) {
        await send(invoice.id, true);
      }
    }

    fetchInvoices();
    setSelectedInvoices([]);
  }, [selectedInvoices, send, fetchInvoices]);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setDateFilter("all");
    setShowMobileFilters(false);
  }, []);

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || dateFilter !== "all";

  return (
    <>
      <SiteHeader
        rightActions={
          <Button
            variant={"secondary"}
            className="h-9 w-full md:h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold text-white text-sm md:text-base"
            onClick={handleCreateInvoice}
            disabled={loading}
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
            cards={invoiceStatsCards as CardData[]}
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
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
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
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
                  <Badge variant="outline" className="text-xs h-6">
                    {invoices.length} of {pagination?.total || 0}
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
                    disabled={loading}
                  >
                    <Download className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">Exp</span>
                    <span className="ml-1">({selectedInvoices.length})</span>
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBulkSend}
                    className="h-8 md:h-9 bg-green-600 hover:bg-green-700 text-xs md:text-sm"
                    disabled={loading}
                  >
                    <Send className="mr-1 md:mr-2 h-3 w-3 md:h-4 md:w-4" />
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
                data={invoices}
                fields={isMobile ? mobileInvoiceFields : invoiceFields}
                actions={invoiceActions}
                loading={loading}
                enableSelection={!isMobile}
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
  );
}

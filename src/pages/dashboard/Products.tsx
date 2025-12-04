"use client";

import { useState, useCallback, useMemo } from "react";
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
  Package,
  DollarSign,
  TrendingUp,
  Grid,
  List,
  AlertCircle,
  CheckCircle,
  Tag,
  Archive,
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
import { AddProductSheet } from "@/components/add-product-sheet";

// Define product data type
interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  subcategory: string;
  brand: string;
  costPrice: number;
  sellingPrice: number;
  profitMargin: number;
  quantity: number;
  lowStockThreshold: number;
  status: "active" | "inactive" | "discontinued";
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
  requiresPrescription: boolean;
  totalValue: number;
  lastRestocked: string;
  supplier: string;
  location: string;
  tags: string[];
  [key: string]: any;
}

// Mock product data
const mockProducts: Product[] = [
  {
    id: "1",
    sku: "ASP-001",
    name: "Aspirin 100mg Tablets",
    description: "Pain reliever and anti-inflammatory medication",
    category: "medication",
    subcategory: "pain-relief",
    brand: "Bayer",
    costPrice: 2.5,
    sellingPrice: 8.99,
    profitMargin: 72.2,
    quantity: 150,
    lowStockThreshold: 20,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 1348.5,
    lastRestocked: "2024-02-15",
    supplier: "MedSupply Inc.",
    location: "Shelf A3",
    tags: ["otc", "pain-relief", "emergency"],
  },
  {
    id: "2",
    sku: "BND-045",
    name: "Sterile Bandages 4in",
    description: "Non-stick sterile bandages for wound care",
    category: "medical-supplies",
    subcategory: "bandages",
    brand: "3M",
    costPrice: 1.2,
    sellingPrice: 3.99,
    profitMargin: 69.9,
    quantity: 42,
    lowStockThreshold: 30,
    status: "active",
    stockStatus: "low_stock",
    requiresPrescription: false,
    totalValue: 167.58,
    lastRestocked: "2024-02-10",
    supplier: "HealthCare Suppliers",
    location: "Cabinet B2",
    tags: ["first-aid", "consumables"],
  },
  {
    id: "3",
    sku: "THM-500",
    name: "Digital Thermometer",
    description: "Fast and accurate digital thermometer",
    category: "equipment",
    subcategory: "diagnostic",
    brand: "Omron",
    costPrice: 12.0,
    sellingPrice: 29.99,
    profitMargin: 60.0,
    quantity: 25,
    lowStockThreshold: 10,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 749.75,
    lastRestocked: "2024-02-20",
    supplier: "MedEquip Ltd.",
    location: "Display Case",
    tags: ["diagnostic", "home-care"],
  },
  {
    id: "4",
    sku: "INS-002",
    name: "Insulin Syringes 1ml",
    description: "Sterile insulin syringes with ultra-fine needles",
    category: "medical-supplies",
    subcategory: "syringes",
    brand: "BD",
    costPrice: 0.85,
    sellingPrice: 2.49,
    profitMargin: 65.9,
    quantity: 8,
    lowStockThreshold: 25,
    status: "active",
    stockStatus: "out_of_stock",
    requiresPrescription: true,
    totalValue: 19.92,
    lastRestocked: "2024-01-30",
    supplier: "PharmaDist Co.",
    location: "Refrigerated Storage",
    tags: ["diabetes", "prescription"],
  },
  {
    id: "5",
    sku: "VIT-C100",
    name: "Vitamin C 1000mg Tablets",
    description: "High potency Vitamin C supplements",
    category: "vitamins",
    subcategory: "immunity",
    brand: "Nature Made",
    costPrice: 8.0,
    sellingPrice: 19.99,
    profitMargin: 60.0,
    quantity: 75,
    lowStockThreshold: 15,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 1499.25,
    lastRestocked: "2024-02-18",
    supplier: "Direct Manufacturer",
    location: "Shelf C1",
    tags: ["supplements", "wellness"],
  },
  {
    id: "6",
    sku: "ANT-025",
    name: "Amoxicillin 500mg Capsules",
    description: "Broad-spectrum antibiotic",
    category: "medication",
    subcategory: "antibiotics",
    brand: "Pfizer",
    costPrice: 4.5,
    sellingPrice: 15.99,
    profitMargin: 71.9,
    quantity: 32,
    lowStockThreshold: 10,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: true,
    totalValue: 511.68,
    lastRestocked: "2024-02-12",
    supplier: "MedSupply Inc.",
    location: "Locked Cabinet",
    tags: ["antibiotic", "prescription"],
  },
  {
    id: "7",
    sku: "MASK-50",
    name: "Surgical Masks (Box of 50)",
    description: "Disposable 3-ply surgical masks",
    category: "medical-supplies",
    subcategory: "ppe",
    brand: "Halyard",
    costPrice: 6.0,
    sellingPrice: 14.99,
    profitMargin: 60.0,
    quantity: 120,
    lowStockThreshold: 25,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 1798.8,
    lastRestocked: "2024-02-25",
    supplier: "HealthCare Suppliers",
    location: "Storage Room",
    tags: ["ppe", "consumables"],
  },
  {
    id: "8",
    sku: "BP-120",
    name: "Digital Blood Pressure Monitor",
    description: "Automatic upper arm blood pressure monitor",
    category: "equipment",
    subcategory: "diagnostic",
    brand: "Beurer",
    costPrice: 35.0,
    sellingPrice: 79.99,
    profitMargin: 56.3,
    quantity: 15,
    lowStockThreshold: 5,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 1199.85,
    lastRestocked: "2024-02-05",
    supplier: "MedEquip Ltd.",
    location: "Display Case",
    tags: ["monitoring", "home-care"],
  },
  {
    id: "9",
    sku: "GLOV-100",
    name: "Nitrile Exam Gloves (Box of 100)",
    description: "Powder-free nitrile examination gloves",
    category: "medical-supplies",
    subcategory: "ppe",
    brand: "Medline",
    costPrice: 8.5,
    sellingPrice: 19.99,
    profitMargin: 57.5,
    quantity: 60,
    lowStockThreshold: 20,
    status: "inactive",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 1199.4,
    lastRestocked: "2024-01-15",
    supplier: "HealthCare Suppliers",
    location: "Storage Room",
    tags: ["ppe", "consumables"],
  },
  {
    id: "10",
    sku: "PAN-500",
    name: "Panadol Extra Strength",
    description: "Extra strength pain relief tablets",
    category: "medication",
    subcategory: "pain-relief",
    brand: "GSK",
    costPrice: 3.0,
    sellingPrice: 9.99,
    profitMargin: 70.0,
    quantity: 95,
    lowStockThreshold: 15,
    status: "active",
    stockStatus: "in_stock",
    requiresPrescription: false,
    totalValue: 949.05,
    lastRestocked: "2024-02-22",
    supplier: "PharmaDist Co.",
    location: "Shelf A4",
    tags: ["otc", "pain-relief"],
  },
];

// Table fields configuration
const productFields: TableField<Product>[] = [
  {
    key: "sku",
    header: "SKU",
    cell: (value) => (
      <div className="flex items-center gap-2">
        <span className="font-mono font-medium">{value as string}</span>
      </div>
    ),
    width: "100px",
    enableSorting: true,
  },
  {
    key: "name",
    header: "Product Name",
    cell: (value, row) => (
      <div className="space-y-1">
        <div className="font-medium">{value as string}</div>
        <div className="text-sm text-muted-foreground line-clamp-1">
          {row.description}
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">
            {row.brand}
          </Badge>
          {row.requiresPrescription && (
            <Badge variant="destructive" className="text-xs">
              RX Required
            </Badge>
          )}
        </div>
      </div>
    ),
    width: "250px",
    enableSorting: true,
  },
  {
    key: "category",
    header: "Category",
    cell: (value, row) => (
      <div className="space-y-1">
        <Badge variant="outline" className="capitalize">
          {value as string}
        </Badge>
        <div className="text-sm text-muted-foreground capitalize">
          {row.subcategory}
        </div>
      </div>
    ),
    width: "140px",
    enableSorting: true,
  },
  {
    key: "pricing",
    header: "Pricing",
    cell: (_, row) => (
      <div className="space-y-1">
        <div className="font-medium">${row.sellingPrice.toFixed(2)}</div>
        <div className="text-sm text-muted-foreground">
          Cost: ${row.costPrice.toFixed(2)}
        </div>
        <div
          className={cn(
            "text-sm font-medium",
            row.profitMargin > 60
              ? "text-green-600"
              : row.profitMargin > 40
              ? "text-yellow-600"
              : "text-red-600"
          )}
        >
          {row.profitMargin.toFixed(1)}% margin
        </div>
      </div>
    ),
    width: "140px",
    enableSorting: true,
  },
  {
    key: "inventory",
    header: "Inventory",
    cell: (_, row) => (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm">Stock:</span>
          <span
            className={cn(
              "font-medium",
              row.stockStatus === "in_stock"
                ? "text-green-600"
                : row.stockStatus === "low_stock"
                ? "text-yellow-600"
                : "text-red-600"
            )}
          >
            {row.quantity} units
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className={cn(
              "h-1.5 rounded-full",
              row.stockStatus === "in_stock"
                ? "bg-green-500"
                : row.stockStatus === "low_stock"
                ? "bg-yellow-500"
                : "bg-red-500"
            )}
            style={{
              width: `${Math.min(
                100,
                (row.quantity / (row.lowStockThreshold * 3)) * 100
              )}%`,
            }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          Value: ${row.totalValue.toFixed(2)}
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
      const status = value as Product["status"];
      const statusConfig = {
        active: {
          label: "Active",
          variant: "outline" as const,
          color: "text-green-600",
          icon: <CheckCircle className="h-3 w-3" />,
        },
        inactive: {
          label: "Inactive",
          variant: "outline" as const,
          color: "text-gray-600 bg-gray-50 border-gray-200",
          icon: <Archive className="h-3 w-3" />,
        },
        discontinued: {
          label: "Discontinued",
          variant: "outline" as const,
          color: "text-red-600 bg-red-50 border-red-200",
          icon: <AlertCircle className="h-3 w-3" />,
        },
      };
      const config = statusConfig[status];
      return (
        <Badge
          variant={config.variant}
          className={cn("gap-2 px-3 rounded-sm", config.color)}
        >
          {config.icon}
          {config.label}
        </Badge>
      );
    },
    width: "120px",
    align: "center",
    enableSorting: true,
  },
  {
    key: "stockStatus",
    header: "Stock Status",
    cell: (value) => {
      const status = value as Product["stockStatus"];
      const statusConfig = {
        in_stock: {
          label: "In Stock",
          variant: "default" as const,
          color: "bg-green-500 hover:bg-green-600",
        },
        low_stock: {
          label: "Low Stock",
          variant: "default" as const,
          color: "bg-yellow-500 hover:bg-yellow-600",
        },
        out_of_stock: {
          label: "Out of Stock",
          variant: "destructive" as const,
          color: "bg-red-500 hover:bg-red-600",
        },
      };
      const config = statusConfig[status];
      return (
        <Badge className={cn(config.color, "text-white rounded-sm px-3")}>
          {config.label}
        </Badge>
      );
    },
    width: "120px",
    align: "center",
    enableSorting: true,
  },
];

// Search input component
function SearchInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        className={cn("pl-10", className)}
        placeholder="Search products by name, SKU, description..."
        {...props}
      />
    </div>
  );
}

// Calculate stats
const calculateStats = (products: Product[]) => ({
  total: products.length,
  active: products.filter((p) => p.status === "active").length,
  lowStock: products.filter((p) => p.stockStatus === "low_stock").length,
  outOfStock: products.filter((p) => p.stockStatus === "out_of_stock").length,
  totalValue: products.reduce((sum, product) => sum + product.totalValue, 0),
  avgProfitMargin:
    products.length > 0
      ? products.reduce((sum, product) => sum + product.profitMargin, 0) /
        products.length
      : 0,
  prescriptionRequired: products.filter((p) => p.requiresPrescription).length,
});

export default function ProductsPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

  // Filter products based on search and filters
  const filteredProducts = useMemo(
    () =>
      mockProducts.filter((product) => {
        // Search filter
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          !searchQuery ||
          product.name.toLowerCase().includes(searchLower) ||
          product.sku.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.brand.toLowerCase().includes(searchLower) ||
          product.tags.some((tag) => tag.toLowerCase().includes(searchLower));

        // Status filter
        const matchesStatus =
          statusFilter === "all" || product.status === statusFilter;

        // Stock filter
        const matchesStock =
          stockFilter === "all" || product.stockStatus === stockFilter;

        // Category filter
        const matchesCategory =
          categoryFilter === "all" || product.category === categoryFilter;

        return (
          matchesSearch && matchesStatus && matchesStock && matchesCategory
        );
      }),
    [searchQuery, statusFilter, stockFilter, categoryFilter]
  );

  // Calculate stats for filtered products
  const stats = useMemo(
    () => calculateStats(filteredProducts),
    [filteredProducts]
  );

  // Card data for SectionCards
  const productStatsCards: CardData[] = [
    {
      title: "Total Products",
      value: stats.total.toString(),
      icon: <Package className="size-4" />,
      iconBgColor: "bg-blue-400 dark:bg-blue-900/20",
      footerDescription: "All products in inventory",
      change: {
        value: "8%",
        trend: "up",
        description: "from last month",
      },
    },
    {
      title: "Active Products",
      value: stats.active.toString(),
      icon: <CheckCircle className="size-4" />,
      iconBgColor: "bg-green-400 dark:bg-green-900/20",
      footerDescription: "Available for sale",
      change: {
        value: "5",
        trend: "up",
        description: "new products",
      },
    },
    {
      title: "Inventory Value",
      value: `$${stats.totalValue.toLocaleString()}`,
      icon: <DollarSign className="size-4" />,
      iconBgColor: "bg-purple-400 dark:bg-purple-900/20",
      footerDescription: "Total stock value",
      change: {
        value: "12%",
        trend: "up",
        description: "from last quarter",
      },
    },
    {
      title: "Avg Profit Margin",
      value: `${stats.avgProfitMargin.toFixed(1)}%`,
      icon: <TrendingUp className="size-4" />,
      iconBgColor: "bg-orange-400 dark:bg-orange-900/20",
      footerDescription: "Average margin",
      change: {
        value: "2.5%",
        trend: "up",
        description: "improvement",
      },
    },
  ];

  // Table actions
  const productActions: TableAction<Product>[] = [
    {
      type: "view",
      label: "View Product",
      icon: <Eye className="size-4" />,
      onClick: (product) => {
        console.log("View product:", product);
        // Navigate to product details
      },
    },
    {
      type: "edit",
      label: "Edit Product",
      icon: <Edit className="size-4" />,
      onClick: (product) => {
        console.log("Edit product:", product);
        // Open edit modal
      },
    },
    {
      type: "delete",
      label: "Delete Product",
      icon: <Trash2 className="size-4" />,
      onClick: (product) => {
        console.log("Delete product:", product);
        // Show delete confirmation
      },
      disabled: (product) =>
        product.status === "active" && product.quantity > 0, // Cannot delete active products with stock
    },
  ];

  // Handle row click
  const handleRowClick = useCallback((product: Product) => {
    console.log("Row clicked:", product);
    // Navigate to product details
  }, []);

  // Handle selection change
  const handleSelectionChange = useCallback((selected: Product[]) => {
    setSelectedProducts(selected);
    console.log("Selected products:", selected.length);
  }, []);

  // Export selected products
  const handleExport = useCallback(() => {
    if (selectedProducts.length === 0) {
      alert("Please select products to export");
      return;
    }
    console.log("Exporting products:", selectedProducts);
    // Implement export logic
  }, [selectedProducts]);

  // Restock selected products
  const handleRestock = useCallback(() => {
    if (selectedProducts.length === 0) {
      alert("Please select products to restock");
      return;
    }
    console.log("Restocking products:", selectedProducts);
    // Implement restock logic
  }, [selectedProducts]);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setStockFilter("all");
    setCategoryFilter("all");
  }, []);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(mockProducts.map((p) => p.category))
    );
    return uniqueCategories.map((cat) => ({
      value: cat,
      label: cat.charAt(0).toUpperCase() + cat.slice(1).replace("-", " "),
    }));
  }, []);

  // Product Card Component for Grid View
  const ProductCard = ({ product }: { product: Product }) => (
    <Card className="overflow-hidden hover:shadow-md transition-shadow shadow-none border-none">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <Badge variant="outline" className="mb-1">
              {product.sku}
            </Badge>
            <h3 className="font-semibold text-lg line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
              {product.description}
            </p>
          </div>
          <Badge
            className={cn(
              product.stockStatus === "in_stock"
                ? "bg-green-500"
                : product.stockStatus === "low_stock"
                ? "bg-yellow-500"
                : "bg-red-500",
              "text-white"
            )}
          >
            {product.stockStatus === "in_stock"
              ? "In Stock"
              : product.stockStatus === "low_stock"
              ? "Low Stock"
              : "Out of Stock"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Price</p>
            <p className="font-semibold text-green-600">
              ${product.sellingPrice.toFixed(2)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Stock</p>
            <p
              className={cn(
                "font-semibold",
                product.stockStatus === "in_stock"
                  ? "text-green-600"
                  : product.stockStatus === "low_stock"
                  ? "text-yellow-600"
                  : "text-red-600"
              )}
            >
              {product.quantity} units
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm mb-3">
          <div className="flex items-center gap-1">
            <Tag className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">{product.category}</span>
          </div>
          <Badge variant="outline">{product.brand}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Profit Margin</span>
            <span
              className={cn(
                "text-sm font-medium",
                product.profitMargin > 60
                  ? "text-green-600"
                  : product.profitMargin > 40
                  ? "text-yellow-600"
                  : "text-red-600"
              )}
            >
              {product.profitMargin.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className={cn(
                "h-1.5 rounded-full",
                product.profitMargin > 60
                  ? "bg-green-500"
                  : product.profitMargin > 40
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
              style={{ width: `${Math.min(100, product.profitMargin)}%` }}
            />
          </div>
        </div>

        {product.requiresPrescription && (
          <div className="mt-3 pt-3 border-t">
            <Badge variant="destructive" className="text-xs">
              Prescription Required
            </Badge>
          </div>
        )}

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
  );

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
            Add Product
          </Button>
        }
      />

      <div className="min-h-screen p-6">
        {/* Stats Overview using SectionCards */}
        <div className="mb-6">
          <SectionCards
            cards={productStatsCards}
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
                      <SelectItem value="discontinued">Discontinued</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger className="w-[180px]">
                      <Package className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Stock Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Stock</SelectItem>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="low_stock">Low Stock</SelectItem>
                      <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={categoryFilter}
                    onValueChange={setCategoryFilter}
                  >
                    <SelectTrigger className="w-[180px]">
                      <Tag className="mr-2 h-4 w-4" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
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

                {selectedProducts.length > 0 && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExport}
                      className="h-10"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Export ({selectedProducts.length})
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleRestock}
                      className="h-10 bg-blue-600 hover:bg-blue-700"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Restock ({selectedProducts.length})
                    </Button>
                  </>
                )}
                
              </div>
            </div>

            {/* Filter summary */}
            {(searchQuery ||
              statusFilter !== "all" ||
              stockFilter !== "all" ||
              categoryFilter !== "all") && (
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
                {stockFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Stock: {stockFilter}
                  </Badge>
                )}
                {categoryFilter !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    Category: {categoryFilter}
                  </Badge>
                )}
                <Badge variant="outline">
                  {filteredProducts.length} of {mockProducts.length} products
                </Badge>
                {stats.lowStock > 0 && (
                  <Badge
                    variant="outline"
                    className="text-yellow-600 border-yellow-200"
                  >
                    {stats.lowStock} low stock
                  </Badge>
                )}
                {stats.outOfStock > 0 && (
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200"
                  >
                    {stats.outOfStock} out of stock
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products Display */}
        {viewMode === "list" ? (
          <Card className="border-none shadow-none">
            <CardContent className="px-6">
              <DataTable
                title="Products"
                description="Manage and view all product inventory"
                data={filteredProducts}
                fields={productFields}
                actions={productActions}
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
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-12">
                <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <AddProductSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </>
  );
}

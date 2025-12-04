// components/add-product-sheet.tsx
import * as React from "react";
import { X, Upload, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface AddProductSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddProductSheet({ open, onOpenChange }: AddProductSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [sku, setSku] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [cost, setCost] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [lowStockThreshold, setLowStockThreshold] = React.useState("10");
  const [isActive, setIsActive] = React.useState(true);
  const [requiresPrescription, setRequiresPrescription] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Handle form submission here
    console.log("Form submitted");
    setIsSubmitting(false);
    onOpenChange(false);
  };

  // Calculate profit margin
  const profitMargin = React.useMemo(() => {
    const priceNum = parseFloat(price) || 0;
    const costNum = parseFloat(cost) || 0;
    if (priceNum === 0 || costNum === 0) return 0;
    return ((priceNum - costNum) / priceNum) * 100;
  }, [price, cost]);

  // Calculate total value
  const totalValue = React.useMemo(() => {
    const priceNum = parseFloat(price) || 0;
    const quantityNum = parseInt(quantity) || 0;
    return priceNum * quantityNum;
  }, [price, quantity]);

  // Auto-generate SKU from name
  const generateSku = (name: string) => {
    if (!name) return "";
    const prefix = name.substring(0, 3).toUpperCase();
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, "0");
    return `${prefix}-${random}`;
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold">
                  Add New Product
                </SheetTitle>
                <SheetDescription>
                  Fill in the product details below
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto">
            <form
              id="product-form"
              onSubmit={handleSubmit}
              className="px-6 py-4"
            >
              <div className="space-y-6 pb-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name *</Label>
                    <Input
                      id="productName"
                      placeholder="e.g., Aspirin 100mg"
                      required
                      disabled={isSubmitting}
                      onChange={(e) => {
                        if (!sku) {
                          setSku(generateSku(e.target.value));
                        }
                      }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU (Stock Keeping Unit) *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="sku"
                          value={sku}
                          onChange={(e) => setSku(e.target.value)}
                          placeholder="e.g., ASP-0001"
                          required
                          disabled={isSubmitting}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSku(generateSku(""))}
                          disabled={isSubmitting}
                        >
                          Generate
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="barcode">Barcode/UPC</Label>
                      <Input
                        id="barcode"
                        placeholder="123456789012"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Product description and details"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Category & Classification */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Category & Classification
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select disabled={isSubmitting} required>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medication">
                            Medications
                          </SelectItem>
                          <SelectItem value="medical-supplies">
                            Medical Supplies
                          </SelectItem>
                          <SelectItem value="equipment">
                            Medical Equipment
                          </SelectItem>
                          <SelectItem value="consumables">
                            Consumables
                          </SelectItem>
                          <SelectItem value="personal-care">
                            Personal Care
                          </SelectItem>
                          <SelectItem value="first-aid">First Aid</SelectItem>
                          <SelectItem value="vitamins">
                            Vitamins & Supplements
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subcategory">Subcategory</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select subcategory" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pain-relief">
                            Pain Relief
                          </SelectItem>
                          <SelectItem value="antibiotics">
                            Antibiotics
                          </SelectItem>
                          <SelectItem value="chronic-care">
                            Chronic Care
                          </SelectItem>
                          <SelectItem value="bandages">
                            Bandages & Dressings
                          </SelectItem>
                          <SelectItem value="syringes">
                            Syringes & Needles
                          </SelectItem>
                          <SelectItem value="diagnostic">
                            Diagnostic Equipment
                          </SelectItem>
                          <SelectItem value="surgical">
                            Surgical Supplies
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="type">Product Type</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="physical">
                          Physical Product
                        </SelectItem>
                        <SelectItem value="digital">Digital Product</SelectItem>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="subscription">
                          Subscription
                        </SelectItem>
                        <SelectItem value="bundle">Product Bundle</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand/Manufacturer</Label>
                    <Input
                      id="brand"
                      placeholder="e.g., Pfizer, Johnson & Johnson"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Pricing</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="costPrice">Cost Price ($) *</Label>
                      <Input
                        id="costPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sellingPrice">Selling Price ($) *</Label>
                      <Input
                        id="sellingPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="profitMargin">Profit Margin</Label>
                      <Input
                        id="profitMargin"
                        value={`${profitMargin.toFixed(1)}%`}
                        readOnly
                        disabled={isSubmitting}
                        className={cn(
                          "bg-muted",
                          profitMargin > 50 && "text-green-600",
                          profitMargin > 20 &&
                            profitMargin <= 50 &&
                            "text-yellow-600",
                          profitMargin <= 20 && "text-red-600"
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <Select disabled={isSubmitting} defaultValue="0">
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">0% (Tax Exempt)</SelectItem>
                          <SelectItem value="5">5%</SelectItem>
                          <SelectItem value="8">8%</SelectItem>
                          <SelectItem value="10">10%</SelectItem>
                          <SelectItem value="12">12%</SelectItem>
                          <SelectItem value="15">15%</SelectItem>
                          <SelectItem value="18">18%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency *</Label>
                      <Select
                        disabled={isSubmitting}
                        defaultValue="usd"
                        required
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="usd">USD ($)</SelectItem>
                          <SelectItem value="eur">EUR (€)</SelectItem>
                          <SelectItem value="gbp">GBP (£)</SelectItem>
                          <SelectItem value="cad">CAD ($)</SelectItem>
                          <SelectItem value="aud">AUD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Inventory */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Inventory</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Current Stock *</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        placeholder="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold">
                        Low Stock Threshold
                      </Label>
                      <Input
                        id="lowStockThreshold"
                        type="number"
                        min="1"
                        placeholder="10"
                        value={lowStockThreshold}
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalValue">Total Value</Label>
                      <Input
                        id="totalValue"
                        value={`$${totalValue.toFixed(2)}`}
                        readOnly
                        disabled={isSubmitting}
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Shelf A3, Refrigerator"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supplier-1">
                            MedSupply Inc.
                          </SelectItem>
                          <SelectItem value="supplier-2">
                            PharmaDist Co.
                          </SelectItem>
                          <SelectItem value="supplier-3">
                            MedEquip Ltd.
                          </SelectItem>
                          <SelectItem value="supplier-4">
                            HealthCare Suppliers
                          </SelectItem>
                          <SelectItem value="supplier-5">
                            Direct Manufacturer
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="reorderQuantity">Reorder Quantity</Label>
                      <Input
                        id="reorderQuantity"
                        type="number"
                        min="1"
                        placeholder="50"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="leadTime">Lead Time (Days)</Label>
                      <Input
                        id="leadTime"
                        type="number"
                        min="0"
                        placeholder="7"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Medical Information</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requiresPrescription">
                          Requires Prescription
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          This product can only be sold with a valid
                          prescription
                        </p>
                      </div>
                      <Switch
                        id="requiresPrescription"
                        checked={requiresPrescription}
                        onCheckedChange={setRequiresPrescription}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage Information</Label>
                      <Input
                        id="dosage"
                        placeholder="e.g., 100mg, 2 times daily"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sideEffects">Side Effects</Label>
                      <Textarea
                        id="sideEffects"
                        placeholder="List known side effects"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contraindications">
                        Contraindications
                      </Label>
                      <Textarea
                        id="contraindications"
                        placeholder="List contraindications and warnings"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="storageInstructions">
                        Storage Instructions
                      </Label>
                      <Textarea
                        id="storageInstructions"
                        placeholder="e.g., Store at room temperature, Keep refrigerated"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expirationInfo">
                        Expiration Information
                      </Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          id="shelfLife"
                          placeholder="Shelf Life (e.g., 24 months)"
                          disabled={isSubmitting}
                        />
                        <Input
                          id="expirationDate"
                          type="date"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Product Images</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Main Image</p>
                          <p className="text-xs text-muted-foreground">
                            Recommended: 800x800px
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Additional Image 1
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Optional
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Additional Image 2
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Optional
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status & Visibility */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Status & Visibility</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isActive">Product Status</Label>
                        <p className="text-sm text-muted-foreground">
                          Active products are available for sale
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={cn(
                            "text-sm",
                            isActive
                              ? "text-green-600"
                              : "text-muted-foreground"
                          )}
                        >
                          {isActive ? "Active" : "Inactive"}
                        </span>
                        <Switch
                          id="isActive"
                          checked={isActive}
                          onCheckedChange={setIsActive}
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visibility">Visibility</Label>
                        <Select disabled={isSubmitting} defaultValue="public">
                          <SelectTrigger className="min-w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="public">
                              Public (Everyone)
                            </SelectItem>
                            <SelectItem value="staff">Staff Only</SelectItem>
                            <SelectItem value="doctors">
                              Doctors Only
                            </SelectItem>
                            <SelectItem value="hidden">Hidden</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">Tags</Label>
                        <Input
                          id="tags"
                          placeholder="e.g., pain-relief, otc, emergency"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Internal Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Internal notes for staff"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="customFields">Custom Fields</Label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          placeholder="Field Name"
                          disabled={isSubmitting}
                        />
                        <Input placeholder="Value" disabled={isSubmitting} />
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={isSubmitting}
                      >
                        Add Custom Field
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <SheetFooter className="px-6 py-4 border-t flex-shrink-0 bg-background">
            <div className="flex items-center justify-between w-full gap-8">
              <SheetClose asChild>
                <Button
                  variant="outline"
                  className="flex flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button
                type="submit"
                form="product-form"
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Product..." : "Add Product"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

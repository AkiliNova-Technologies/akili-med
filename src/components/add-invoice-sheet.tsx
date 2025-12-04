// components/add-invoice-sheet.tsx
import * as React from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface InvoiceItem {
  id: number
  description: string
  quantity: number
  unitPrice: number
  total: number
}

interface AddInvoiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddInvoiceSheet({ open, onOpenChange }: AddInvoiceSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [invoiceDate, setInvoiceDate] = React.useState<Date>()
  const [dueDate, setDueDate] = React.useState<Date>()
  const [items, setItems] = React.useState<InvoiceItem[]>([
    { id: 1, description: "", quantity: 1, unitPrice: 0, total: 0 }
  ])
  const [taxRate, setTaxRate] = React.useState(0)
  const [discount, setDiscount] = React.useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Handle form submission here
    console.log("Form submitted")
    setIsSubmitting(false)
    onOpenChange(false)
  }

  const addItem = () => {
    const newId = items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1
    setItems([...items, { id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    }))
  }

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = (subtotal * taxRate) / 100
  const discountAmount = (subtotal * discount) / 100
  const total = subtotal + taxAmount - discountAmount

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        side="right" 
        className="w-full sm:max-w-2xl p-0 overflow-y-auto"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold">Create New Invoice</SheetTitle>
                <SheetDescription>
                  Fill in the invoice details below
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
          
          <form 
            id="invoice-form" 
            onSubmit={handleSubmit} 
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6 pb-4">
              {/* Invoice Header */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invoice Information</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                    <Input 
                      id="invoiceNumber" 
                      placeholder="INV-2023-001" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reference">Reference Number</Label>
                    <Input 
                      id="reference" 
                      placeholder="REF-12345" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Invoice Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal shadow-none bg-input/40",
                            !invoiceDate && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {invoiceDate ? format(invoiceDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={invoiceDate}
                          onSelect={setInvoiceDate}
                          initialFocus
                          disabled={isSubmitting}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Due Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal shadow-none bg-input/40",
                            !dueDate && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dueDate}
                          onSelect={setDueDate}
                          initialFocus
                          disabled={isSubmitting}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Client Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="client">Select Client *</Label>
                  <Select disabled={isSubmitting} required>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Search for client..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                      <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                      <SelectItem value="michael-brown">Michael Brown</SelectItem>
                      <SelectItem value="acme-corp">Acme Corporation</SelectItem>
                      <SelectItem value="xyz-health">XYZ Health Services</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Client Email *</Label>
                    <Input 
                      id="clientEmail" 
                      type="email" 
                      placeholder="client@example.com" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input 
                      id="clientPhone" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Textarea 
                    id="billingAddress" 
                    placeholder="Enter billing address" 
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Invoice Items */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Invoice Items</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addItem}
                    disabled={isSubmitting}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={item.id} className="space-y-3 p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Item #{index + 1}</span>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            disabled={isSubmitting}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor={`description-${item.id}`}>Description *</Label>
                        <Input 
                          id={`description-${item.id}`}
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          placeholder="Service description"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`quantity-${item.id}`}>Quantity *</Label>
                          <Input 
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`unitPrice-${item.id}`}>Unit Price ($) *</Label>
                          <Input 
                            id={`unitPrice-${item.id}`}
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            required
                            disabled={isSubmitting}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`total-${item.id}`}>Total ($)</Label>
                          <Input 
                            id={`total-${item.id}`}
                            value={item.total.toFixed(2)}
                            readOnly
                            disabled={isSubmitting}
                            className="bg-muted"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Terms */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Terms</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Payment Terms</Label>
                    <Select disabled={isSubmitting} defaultValue="net-30">
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="due-on-receipt">Due on Receipt</SelectItem>
                        <SelectItem value="net-7">Net 7 Days</SelectItem>
                        <SelectItem value="net-15">Net 15 Days</SelectItem>
                        <SelectItem value="net-30">Net 30 Days</SelectItem>
                        <SelectItem value="net-60">Net 60 Days</SelectItem>
                        <SelectItem value="net-90">Net 90 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Currency *</Label>
                    <Select disabled={isSubmitting} defaultValue="usd" required>
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

              {/* Totals */}
              <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                <h3 className="text-lg font-semibold">Invoice Summary</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxRate">Tax Rate (%)</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="taxRate"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={taxRate}
                          onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        <span>%</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="discount">Discount (%)</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          id="discount"
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={discount}
                          onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                          disabled={isSubmitting}
                          className="flex-1"
                        />
                        <span>%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-1 pt-2 border-t">
                    <div className="flex justify-between">
                      <span>Tax Amount:</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Total Amount:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes & Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for Client</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any notes or terms for the client" 
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internalNotes">Internal Notes</Label>
                  <Textarea 
                    id="internalNotes" 
                    placeholder="Internal notes (not visible to client)" 
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Invoice Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Invoice Status</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Invoice Status</Label>
                  <Select disabled={isSubmitting} defaultValue="draft">
                    <SelectTrigger className="min-w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="viewed">Viewed</SelectItem>
                      <SelectItem value="partial">Partially Paid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Payment Method</Label>
                  <Select disabled={isSubmitting}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">Credit Card</SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="insurance">Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </form>
          
          <SheetFooter className="px-6 py-4 border-t sticky bottom-0 bg-background">
            <div className="flex items-center justify-between w-full gap-8">
              <SheetClose asChild>
                <Button variant="outline" className="flex flex-1" disabled={isSubmitting}>
                  Cancel
                </Button>
              </SheetClose>
              <Button 
                type="submit" 
                form="invoice-form" 
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating Invoice..." : "Create Invoice"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
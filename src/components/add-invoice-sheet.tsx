// components/add-invoice-sheet.tsx
"use client"

import * as React from "react"
import { X, Plus, Minus, CalendarIcon } from "lucide-react"
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
import { format } from "date-fns"
import { useReduxInvoices } from "@/hooks/useReduxInvoice"
import { useReduxContacts } from "@/hooks/useReduxContacts"
import { useReduxPatients } from "@/hooks/useReduxPatients"
import { InvoiceStatus, type Invoice } from "@/types/invoice"

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
  productId?: string
}

interface AddInvoiceSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: any
  isEditing?: boolean
  onSuccess?: () => void
}

export function AddInvoiceSheet({ 
  open, 
  onOpenChange, 
  invoice, 
  isEditing = false, 
  onSuccess 
}: AddInvoiceSheetProps) {
  const { addInvoice, editInvoice, loading } = useReduxInvoices()
  const { contacts } = useReduxContacts()
  const { patients } = useReduxPatients()
  
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [invoiceDate, setInvoiceDate] = React.useState<Date>()
  const [dueDate, setDueDate] = React.useState<Date>()
  const [items, setItems] = React.useState<InvoiceItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }
  ])
  const [formData, setFormData] = React.useState({
    clientId: "",
    patientId: "",
    clientEmail: "",
    clientPhone: "",
    billingAddress: "",
    reference: "",
    paymentTerms: "net-30",
    currency: "USD",
    notes: "",
    internalNotes: "",
    status: InvoiceStatus.DRAFT,
    paymentMethod: "",
    taxRate: 0,
    discount: 0,
  })

  // Initialize form with invoice data when editing
  React.useEffect(() => {
    if (invoice && isEditing) {
      // Set dates
      setInvoiceDate(new Date(invoice.invoiceDate))
      setDueDate(new Date(invoice.dueDate))
      
      // Set form data
      setFormData({
        clientId: invoice.clientId || "",
        patientId: invoice.patientId || "",
        clientEmail: invoice.clientEmail || "",
        clientPhone: invoice.clientPhone || "",
        billingAddress: invoice.billingAddress || "",
        reference: invoice.reference || "",
        paymentTerms: invoice.paymentTerms || "net-30",
        currency: invoice.currency || "USD",
        notes: invoice.notes || "",
        internalNotes: invoice.internalNotes || "",
        status: invoice.status || InvoiceStatus.DRAFT,
        paymentMethod: invoice.paymentMethod || "",
        taxRate: invoice.taxRate || 0,
        discount: invoice.discount || 0,
      })
      
      // Set items
      if (invoice.items && Array.isArray(invoice.items)) {
        setItems(invoice.items.map((item: any, index: number) => ({
          id: item.id || `item-${index + 1}`,
          description: item.description || "",
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
          total: item.total || 0,
          productId: item.productId
        })))
      }
    } else {
      // Reset form for new invoice
      const today = new Date()
      const due = new Date(today)
      due.setDate(today.getDate() + 30) // Default 30 days from now
      
      setInvoiceDate(today)
      setDueDate(due)
      setItems([{ id: "1", description: "", quantity: 1, unitPrice: 0, total: 0 }])
      setFormData({
        clientId: "",
        patientId: "",
        clientEmail: "",
        clientPhone: "",
        billingAddress: "",
        reference: "",
        paymentTerms: "net-30",
        currency: "USD",
        notes: "",
        internalNotes: "",
        status: InvoiceStatus.DRAFT,
        paymentMethod: "",
        taxRate: 0,
        discount: 0,
      })
    }
  }, [invoice, isEditing, open])

  // Auto-fill client details when client is selected
  React.useEffect(() => {
    if (formData.clientId) {
      const selectedClient = contacts.find(c => c.id === formData.clientId)
      if (selectedClient) {
        setFormData(prev => ({
          ...prev,
          clientEmail: selectedClient.email || "",
          clientPhone: selectedClient.phone || "",
          billingAddress: selectedClient.streetAddress || "",
        }))
      }
    }
  }, [formData.clientId, contacts])

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  setIsSubmitting(true)
  
  try {
    // Validate required fields
    if (!formData.clientId || !invoiceDate || !dueDate) {
      alert("Please fill in all required fields (Client, Invoice Date, Due Date)")
      setIsSubmitting(false)
      return
    }

    // Validate items
    const hasInvalidItems = items.some(item => !item.description || item.quantity <= 0 || item.unitPrice < 0)
    if (hasInvalidItems) {
      alert("Please fill in all item details correctly")
      setIsSubmitting(false)
      return
    }

    // Prepare invoice data - Use undefined instead of null
    const invoiceData: Partial<Invoice> = {
      clientId: formData.clientId,
      patientId: formData.patientId || undefined,
      invoiceDate: invoiceDate.toISOString(),
      dueDate: dueDate.toISOString(),
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone || undefined,
      billingAddress: formData.billingAddress || undefined,
      reference: formData.reference || undefined,
      paymentTerms: formData.paymentTerms,
      currency: formData.currency,
      items: items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.total,
        productId: item.productId || undefined
      })),
      notes: formData.notes || undefined,
      internalNotes: formData.internalNotes || undefined,
      status: formData.status,
      paymentMethod: formData.paymentMethod || undefined,
      taxRate: formData.taxRate,
      discount: formData.discount,
    }

    if (isEditing && invoice) {
      await editInvoice(invoice.id, invoiceData)
    } else {
      await addInvoice(invoiceData)
    }
    
    onSuccess?.()
    onOpenChange(false)
  } catch (error: any) {
    console.error("Failed to save invoice:", error)
    alert(error.message || "Failed to save invoice. Please try again.")
  } finally {
    setIsSubmitting(false)
  }
}

  const addItem = () => {
    const newId = `item-${Date.now()}`
    setItems([...items, { id: newId, description: "", quantity: 1, unitPrice: 0, total: 0 }])
  }

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
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
  const taxAmount = (subtotal * formData.taxRate) / 100
  const discountAmount = (subtotal * formData.discount) / 100
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
                <SheetTitle className="text-2xl font-bold">
                  {isEditing ? "Edit Invoice" : "Create New Invoice"}
                </SheetTitle>
                <SheetDescription>
                  {isEditing 
                    ? "Update invoice details and items"
                    : "Fill in the invoice details below"}
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
                    <Label htmlFor="reference">Reference Number (Optional)</Label>
                    <Input 
                      id="reference" 
                      placeholder="REF-12345" 
                      value={formData.reference}
                      onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                      disabled={isSubmitting || loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Invoice Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as InvoiceStatus }))}
                      disabled={isSubmitting || loading}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="SENT">Sent</SelectItem>
                        <SelectItem value="PAID">Paid</SelectItem>
                      </SelectContent>
                    </Select>
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
                          disabled={isSubmitting || loading}
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
                          disabled={isSubmitting || loading}
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
                          disabled={isSubmitting || loading}
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
                          disabled={isSubmitting || loading}
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
                  <Select 
                    value={formData.clientId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, clientId: value }))}
                    disabled={isSubmitting || loading}
                    required
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Search for client..." />
                    </SelectTrigger>
                    <SelectContent>
                      {contacts.map(contact => (
                        <SelectItem key={contact.id} value={contact.id}>
                          {contact.companyName || `${contact.firstName} ${contact.lastName}`}
                        </SelectItem>
                      ))}
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
                      value={formData.clientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      required 
                      disabled={isSubmitting || loading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Client Phone</Label>
                    <Input 
                      id="clientPhone" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      value={formData.clientPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientPhone: e.target.value }))}
                      disabled={isSubmitting || loading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Textarea 
                    id="billingAddress" 
                    placeholder="Enter billing address" 
                    rows={2}
                    value={formData.billingAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, billingAddress: e.target.value }))}
                    disabled={isSubmitting || loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="patient">Patient (Optional)</Label>
                  <Select 
                    value={formData.patientId} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}
                    disabled={isSubmitting || loading}
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select patient (optional)..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patients.map(patient => (
                        <SelectItem key={patient.id} value={patient.id}>
                          {`${patient.firstName} ${patient.lastName}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                    disabled={isSubmitting || loading}
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
                            disabled={isSubmitting || loading}
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
                          disabled={isSubmitting || loading}
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
                            disabled={isSubmitting || loading}
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
                            disabled={isSubmitting || loading}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor={`total-${item.id}`}>Total ($)</Label>
                          <Input 
                            id={`total-${item.id}`}
                            value={item.total.toFixed(2)}
                            readOnly
                            disabled={isSubmitting || loading}
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
                    <Select 
                      value={formData.paymentTerms} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, paymentTerms: value }))}
                      disabled={isSubmitting || loading}
                    >
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
                    <Select 
                      value={formData.currency} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, currency: value }))}
                      disabled={isSubmitting || loading}
                      required
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="GBP">GBP (£)</SelectItem>
                        <SelectItem value="CAD">CAD ($)</SelectItem>
                        <SelectItem value="AUD">AUD ($)</SelectItem>
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
                          value={formData.taxRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                          disabled={isSubmitting || loading}
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
                          value={formData.discount}
                          onChange={(e) => setFormData(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                          disabled={isSubmitting || loading}
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

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Preferred Payment Method</Label>
                  <Select 
                    value={formData.paymentMethod} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
                    disabled={isSubmitting || loading}
                  >
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

              {/* Notes & Additional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes & Additional Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes for Client</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any notes or terms for the client" 
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    disabled={isSubmitting || loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internalNotes">Internal Notes</Label>
                  <Textarea 
                    id="internalNotes" 
                    placeholder="Internal notes (not visible to client)" 
                    rows={2}
                    value={formData.internalNotes}
                    onChange={(e) => setFormData(prev => ({ ...prev, internalNotes: e.target.value }))}
                    disabled={isSubmitting || loading}
                  />
                </div>
              </div>
            </div>
          </form>
          
          <SheetFooter className="px-6 py-4 border-t sticky bottom-0 bg-background">
            <div className="flex items-center justify-between w-full gap-8">
              <SheetClose asChild>
                <Button variant="outline" className="flex flex-1" disabled={isSubmitting || loading}>
                  Cancel
                </Button>
              </SheetClose>
              <Button 
                type="submit" 
                form="invoice-form" 
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting || loading}
              >
                {isSubmitting || loading 
                  ? (isEditing ? "Updating Invoice..." : "Creating Invoice...") 
                  : (isEditing ? "Update Invoice" : "Create Invoice")}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
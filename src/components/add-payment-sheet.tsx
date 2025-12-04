// components/add-payment-sheet.tsx
import * as React from "react"
import { X } from "lucide-react"
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
import { CalendarIcon, Receipt } from "lucide-react"
import { format } from "date-fns"

interface AddPaymentSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPaymentSheet({ open, onOpenChange }: AddPaymentSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [paymentDate, setPaymentDate] = React.useState<Date>()
  const [amount, setAmount] = React.useState("")
  const [selectedInvoice, setSelectedInvoice] = React.useState("")

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

  // Mock invoice data
  const invoices = [
    { id: "inv-2023-001", client: "John Doe", amount: 150.00, dueDate: "2023-12-15", status: "pending" },
    { id: "inv-2023-002", client: "Jane Smith", amount: 250.50, dueDate: "2023-12-20", status: "partial" },
    { id: "inv-2023-003", client: "Robert Johnson", amount: 500.00, dueDate: "2023-12-25", status: "pending" },
    { id: "inv-2023-004", client: "Sarah Williams", amount: 175.75, dueDate: "2023-12-10", status: "overdue" },
    { id: "inv-2023-005", client: "Michael Brown", amount: 325.25, dueDate: "2024-01-05", status: "pending" },
  ]

  const selectedInvoiceData = invoices.find(inv => inv.id === selectedInvoice)
  const remainingAmount = selectedInvoiceData ? selectedInvoiceData.amount - parseFloat(amount || "0") : 0

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
                <SheetTitle className="text-2xl font-bold">Record New Payment</SheetTitle>
                <SheetDescription>
                  Fill in the payment details below
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
            id="payment-form" 
            onSubmit={handleSubmit} 
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6 pb-4">
              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentNumber">Payment Reference *</Label>
                  <Input 
                    id="paymentNumber" 
                    placeholder="PAY-2023-001" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal shadow-none bg-input/40",
                            !paymentDate && "text-muted-foreground"
                          )}
                          disabled={isSubmitting}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {paymentDate ? format(paymentDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={paymentDate}
                          onSelect={setPaymentDate}
                          initialFocus
                          disabled={isSubmitting}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="paymentTime">Payment Time</Label>
                    <Input 
                      id="paymentTime" 
                      type="time" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Payer Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payer Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="payer">Select Payer *</Label>
                  <Select disabled={isSubmitting} required>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Search for payer..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="robert-johnson">Robert Johnson</SelectItem>
                      <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                      <SelectItem value="michael-brown">Michael Brown</SelectItem>
                      <SelectItem value="acme-corp">Acme Corporation</SelectItem>
                      <SelectItem value="insurance-co">XYZ Insurance Co.</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payerEmail">Payer Email</Label>
                    <Input 
                      id="payerEmail" 
                      type="email" 
                      placeholder="payer@example.com" 
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="payerPhone">Payer Phone</Label>
                    <Input 
                      id="payerPhone" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="billedTo">Billed To</Label>
                  <Select disabled={isSubmitting}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Same as payer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="same">Same as Payer</SelectItem>
                      <SelectItem value="different">Different Billing Contact</SelectItem>
                      <SelectItem value="company">Company Account</SelectItem>
                      <SelectItem value="insurance">Insurance Provider</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Invoice Selection */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Invoice Details</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    disabled={isSubmitting}
                  >
                    <Receipt className="h-4 w-4 mr-2" />
                    View All Invoices
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="invoice">Select Invoice *</Label>
                  <Select 
                    value={selectedInvoice} 
                    onValueChange={setSelectedInvoice}
                    disabled={isSubmitting}
                    required
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select invoice to apply payment" />
                    </SelectTrigger>
                    <SelectContent>
                      {invoices.map(invoice => (
                        <SelectItem key={invoice.id} value={invoice.id}>
                          {invoice.id} - {invoice.client} (${invoice.amount.toFixed(2)}) - {invoice.status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {selectedInvoiceData && (
                  <div className="p-4 border rounded-lg bg-muted/50 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-muted-foreground">Invoice Amount</Label>
                        <p className="font-medium">${selectedInvoiceData.amount.toFixed(2)}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-muted-foreground">Due Date</Label>
                        <p className="font-medium">{selectedInvoiceData.dueDate}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Status</Label>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${
                          selectedInvoiceData.status === 'paid' ? 'bg-green-500' :
                          selectedInvoiceData.status === 'partial' ? 'bg-yellow-500' :
                          selectedInvoiceData.status === 'overdue' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`} />
                        <span className="font-medium capitalize">{selectedInvoiceData.status}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Amount */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Amount</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount ($) *</Label>
                    <Input 
                      id="amount" 
                      type="number"
                      min="0.01"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
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
                
                {selectedInvoiceData && (
                  <div className="p-4 border rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span>Invoice Total:</span>
                      <span className="font-medium">${selectedInvoiceData.amount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payment Amount:</span>
                      <span className="font-medium">${parseFloat(amount || "0").toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                      <span>Remaining Balance:</span>
                      <span className={
                        remainingAmount <= 0 ? "text-green-600" : 
                        remainingAmount < selectedInvoiceData.amount ? "text-yellow-600" : 
                        "text-red-600"
                      }>
                        ${remainingAmount.toFixed(2)}
                      </span>
                    </div>
                    {remainingAmount <= 0 && (
                      <div className="text-sm text-green-600 font-medium">
                        ✓ This payment will fully settle the invoice
                      </div>
                    )}
                    {remainingAmount > 0 && remainingAmount < selectedInvoiceData.amount && (
                      <div className="text-sm text-yellow-600 font-medium">
                        ⚠ This is a partial payment
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Method</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod">Method *</Label>
                  <Select disabled={isSubmitting} required>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="credit-card">
                        <div className="flex items-center">
                          <div className="h-4 w-6 bg-blue-500 rounded-sm mr-2" />
                          Credit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="debit-card">
                        <div className="flex items-center">
                          <div className="h-4 w-6 bg-green-500 rounded-sm mr-2" />
                          Debit Card
                        </div>
                      </SelectItem>
                      <SelectItem value="bank-transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cash">Cash</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="insurance">Insurance Claim</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastFourDigits">Card Last 4 Digits</Label>
                    <Input 
                      id="lastFourDigits" 
                      placeholder="1234" 
                      maxLength={4}
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="transactionId">Transaction ID</Label>
                    <Input 
                      id="transactionId" 
                      placeholder="TXN-123456" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentGateway">Payment Gateway</Label>
                  <Select disabled={isSubmitting}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="authorize">Authorize.net</SelectItem>
                      <SelectItem value="braintree">Braintree</SelectItem>
                      <SelectItem value="manual">Manual Entry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Status */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Status</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Payment Status *</Label>
                    <Select disabled={isSubmitting} defaultValue="completed" required>
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">Receipt Number</Label>
                    <Input 
                      id="receiptNumber" 
                      placeholder="RCPT-2023-001" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmationEmail">Send Confirmation Email</Label>
                  <Select disabled={isSubmitting} defaultValue="yes">
                    <SelectTrigger className="min-w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes, send email</SelectItem>
                      <SelectItem value="no">No, don't send</SelectItem>
                      <SelectItem value="later">Send later</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes & Attachments */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Notes & Attachments</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Payment Notes</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Add any notes about this payment" 
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="internalNotes">Internal Notes</Label>
                  <Textarea 
                    id="internalNotes" 
                    placeholder="Internal notes (for staff only)" 
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Attach Receipt/Proof</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <Receipt className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Upload receipt or proof of payment</p>
                        <p className="text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        disabled={isSubmitting}
                      >
                        Choose File
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fees & Charges */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Fees & Charges</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="processingFee">Processing Fee ($)</Label>
                    <Input 
                      id="processingFee" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="convenienceFee">Convenience Fee ($)</Label>
                    <Input 
                      id="convenienceFee" 
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="feeNotes">Fee Notes</Label>
                  <Textarea 
                    id="feeNotes" 
                    placeholder="Notes about any fees or charges" 
                    rows={2}
                    disabled={isSubmitting}
                  />
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
                form="payment-form" 
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Recording Payment..." : "Record Payment"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
// components/add-expense-sheet.tsx
import * as React from "react";
import { X, Receipt, Upload, AlertCircle } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddExpenseSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddExpenseSheet({ open, onOpenChange }: AddExpenseSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [expenseDate, setExpenseDate] = React.useState<Date>();
  const [amount, setAmount] = React.useState("");
  const [taxAmount, setTaxAmount] = React.useState("");
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [requiresApproval, setRequiresApproval] = React.useState(false);

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

  // Calculate total amount
  const totalAmount = React.useMemo(() => {
    const amountNum = parseFloat(amount) || 0;
    const taxNum = parseFloat(taxAmount) || 0;
    return amountNum + taxNum;
  }, [amount, taxAmount]);

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
                  Add New Expense
                </SheetTitle>
                <SheetDescription>
                  Record and track business expenses
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
              id="expense-form"
              onSubmit={handleSubmit}
              className="px-6 py-4"
            >
              <div className="space-y-6 pb-4">
                {/* Expense Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expense Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="expenseNumber">Expense Reference *</Label>
                    <Input
                      id="expenseNumber"
                      placeholder="EXP-2023-001"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Expense Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal bg-input/40 shadow-none",
                              !expenseDate && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {expenseDate
                              ? format(expenseDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={expenseDate}
                            onSelect={setExpenseDate}
                            initialFocus
                            disabled={isSubmitting}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate">Payment Due Date</Label>
                      <Input id="dueDate" type="date" disabled={isSubmitting} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Expense Description *</Label>
                    <Input
                      id="description"
                      placeholder="e.g., Office supplies, Medical equipment, Software subscription"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="details">Additional Details</Label>
                    <Textarea
                      id="details"
                      placeholder="Provide more details about this expense"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Amount & Payment */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Amount & Payment</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                      <Label htmlFor="taxAmount">Tax ($)</Label>
                      <Input
                        id="taxAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        value={taxAmount}
                        onChange={(e) => setTaxAmount(e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="totalAmount">Total Amount</Label>
                      <Input
                        id="totalAmount"
                        value={`$${totalAmount.toFixed(2)}`}
                        readOnly
                        disabled={isSubmitting}
                        className="bg-muted font-medium"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div className="space-y-2">
                      <Label htmlFor="exchangeRate">Exchange Rate</Label>
                      <Input
                        id="exchangeRate"
                        type="number"
                        min="0"
                        step="0.0001"
                        placeholder="1.0000"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMethod">Payment Method *</Label>
                      <Select disabled={isSubmitting} required>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="credit-card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="debit-card">Debit Card</SelectItem>
                          <SelectItem value="bank-transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="check">Check</SelectItem>
                          <SelectItem value="paypal">PayPal</SelectItem>
                          <SelectItem value="company-card">
                            Company Card
                          </SelectItem>
                        </SelectContent>
                      </Select>
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
                    <Label htmlFor="paymentNotes">Payment Notes</Label>
                    <Textarea
                      id="paymentNotes"
                      placeholder="Additional payment information"
                      rows={2}
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
                      <Label htmlFor="category">Expense Category *</Label>
                      <Select disabled={isSubmitting} required>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical-supplies">
                            Medical Supplies
                          </SelectItem>
                          <SelectItem value="equipment">
                            Medical Equipment
                          </SelectItem>
                          <SelectItem value="medications">
                            Medications
                          </SelectItem>
                          <SelectItem value="office-supplies">
                            Office Supplies
                          </SelectItem>
                          <SelectItem value="utilities">Utilities</SelectItem>
                          <SelectItem value="rent">Rent</SelectItem>
                          <SelectItem value="salaries">
                            Salaries & Wages
                          </SelectItem>
                          <SelectItem value="marketing">
                            Marketing & Advertising
                          </SelectItem>
                          <SelectItem value="software">
                            Software & Subscriptions
                          </SelectItem>
                          <SelectItem value="travel">
                            Travel & Transportation
                          </SelectItem>
                          <SelectItem value="insurance">Insurance</SelectItem>
                          <SelectItem value="maintenance">
                            Maintenance & Repairs
                          </SelectItem>
                          <SelectItem value="professional-fees">
                            Professional Fees
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
                          <SelectItem value="bandages">
                            Bandages & Dressings
                          </SelectItem>
                          <SelectItem value="syringes">
                            Syringes & Needles
                          </SelectItem>
                          <SelectItem value="gloves">Gloves & PPE</SelectItem>
                          <SelectItem value="diagnostic">
                            Diagnostic Equipment
                          </SelectItem>
                          <SelectItem value="surgical">
                            Surgical Equipment
                          </SelectItem>
                          <SelectItem value="furniture">
                            Office Furniture
                          </SelectItem>
                          <SelectItem value="stationery">Stationery</SelectItem>
                          <SelectItem value="electricity">
                            Electricity
                          </SelectItem>
                          <SelectItem value="water">Water</SelectItem>
                          <SelectItem value="internet">Internet</SelectItem>
                          <SelectItem value="phone">Phone</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., urgent, recurring, tax-deductible"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department/Cost Center</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="administration">
                          Administration
                        </SelectItem>
                        <SelectItem value="clinical">Clinical</SelectItem>
                        <SelectItem value="pharmacy">Pharmacy</SelectItem>
                        <SelectItem value="laboratory">Laboratory</SelectItem>
                        <SelectItem value="radiology">Radiology</SelectItem>
                        <SelectItem value="billing">
                          Billing & Finance
                        </SelectItem>
                        <SelectItem value="hr">Human Resources</SelectItem>
                        <SelectItem value="it">IT Department</SelectItem>
                        <SelectItem value="facilities">Facilities</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vendor/Supplier Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Vendor/Supplier Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="vendor">Vendor/Supplier *</Label>
                    <Select disabled={isSubmitting} required>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select or add vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="medsupply">
                          MedSupply Inc.
                        </SelectItem>
                        <SelectItem value="pharmadist">
                          PharmaDist Co.
                        </SelectItem>
                        <SelectItem value="office-depot">
                          Office Depot
                        </SelectItem>
                        <SelectItem value="amazon">Amazon Business</SelectItem>
                        <SelectItem value="dell">Dell Technologies</SelectItem>
                        <SelectItem value="microsoft">Microsoft</SelectItem>
                        <SelectItem value="utility-co">
                          Local Utility Company
                        </SelectItem>
                        <SelectItem value="landlord">
                          Building Landlord
                        </SelectItem>
                        <SelectItem value="new-vendor">
                          + Add New Vendor
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="vendorContact">Vendor Contact</Label>
                      <Input
                        id="vendorContact"
                        placeholder="Contact person name"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vendorPhone">Vendor Phone</Label>
                      <Input
                        id="vendorPhone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorEmail">Vendor Email</Label>
                    <Input
                      id="vendorEmail"
                      type="email"
                      placeholder="vendor@example.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vendorAddress">Vendor Address</Label>
                    <Textarea
                      id="vendorAddress"
                      placeholder="Vendor business address"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Receipt & Documentation */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Receipt & Documentation
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="receiptNumber">
                      Receipt/Invoice Number
                    </Label>
                    <Input
                      id="receiptNumber"
                      placeholder="RCPT-123456"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Receipt Date</Label>
                      <Input type="date" disabled={isSubmitting} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="receiptAmount">Receipt Amount ($)</Label>
                      <Input
                        id="receiptAmount"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Attach Receipt/Document</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Upload className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Upload receipt or invoice
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, JPG, PNG up to 10MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          disabled={isSubmitting}
                        >
                          <Receipt className="h-4 w-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentNotes">Document Notes</Label>
                    <Textarea
                      id="documentNotes"
                      placeholder="Notes about attached documents"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Expense Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Expense Settings</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isRecurring">Recurring Expense</Label>
                        <p className="text-sm text-muted-foreground">
                          This expense repeats regularly (monthly, quarterly,
                          etc.)
                        </p>
                      </div>
                      <Switch
                        id="isRecurring"
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                        disabled={isSubmitting}
                      />
                    </div>

                    {isRecurring && (
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="frequency">Frequency *</Label>
                            <Select disabled={isSubmitting}>
                              <SelectTrigger className="min-w-full">
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="bi-weekly">
                                  Bi-weekly
                                </SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">
                                  Quarterly
                                </SelectItem>
                                <SelectItem value="semi-annual">
                                  Semi-annual
                                </SelectItem>
                                <SelectItem value="annual">Annual</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              id="endDate"
                              type="date"
                              disabled={isSubmitting}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requiresApproval">
                          Requires Approval
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          This expense needs manager approval before processing
                        </p>
                      </div>
                      <Switch
                        id="requiresApproval"
                        checked={requiresApproval}
                        onCheckedChange={setRequiresApproval}
                        disabled={isSubmitting}
                      />
                    </div>

                    {requiresApproval && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          This expense will be submitted for approval and cannot
                          be paid until approved.
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="status">Expense Status *</Label>
                        <Select
                          disabled={isSubmitting}
                          defaultValue="pending"
                          required
                        >
                          <SelectTrigger className="min-w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="pending">
                              Pending Approval
                            </SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="partially-paid">
                              Partially Paid
                            </SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select disabled={isSubmitting} defaultValue="normal">
                          <SelectTrigger className="min-w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tax & Accounting */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Tax & Accounting</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="taxDeductible">Tax Deductible</Label>
                      <Select disabled={isSubmitting} defaultValue="yes">
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">
                            Yes, fully deductible
                          </SelectItem>
                          <SelectItem value="partial">
                            Partially deductible
                          </SelectItem>
                          <SelectItem value="no">Not deductible</SelectItem>
                          <SelectItem value="unknown">
                            Need to verify
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="vat">VAT/GST Included</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select VAT status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="included">
                            VAT included in amount
                          </SelectItem>
                          <SelectItem value="excluded">
                            VAT excluded from amount
                          </SelectItem>
                          <SelectItem value="exempt">VAT exempt</SelectItem>
                          <SelectItem value="zero-rated">Zero-rated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="glAccount">GL Account Code</Label>
                      <Input
                        id="glAccount"
                        placeholder="e.g., 5010, 6050"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="costCenter">Cost Center Code</Label>
                      <Input
                        id="costCenter"
                        placeholder="e.g., CC-101, CC-202"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="accountingNotes">Accounting Notes</Label>
                    <Textarea
                      id="accountingNotes"
                      placeholder="Notes for accounting department"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="employee">Employee/Submitter</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john-doe">
                          John Doe (Administration)
                        </SelectItem>
                        <SelectItem value="jane-smith">
                          Jane Smith (Clinical)
                        </SelectItem>
                        <SelectItem value="robert-j">
                          Robert Johnson (Pharmacy)
                        </SelectItem>
                        <SelectItem value="sarah-w">
                          Sarah Williams (Finance)
                        </SelectItem>
                        <SelectItem value="michael-b">
                          Michael Brown (IT)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="approver">Approver/Manager</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select approver" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manager-1">
                          Dr. Sarah Johnson
                        </SelectItem>
                        <SelectItem value="manager-2">
                          Michael Chen (Finance Manager)
                        </SelectItem>
                        <SelectItem value="manager-3">
                          Emily Rodriguez (Operations)
                        </SelectItem>
                        <SelectItem value="manager-4">
                          David Wilson (Clinic Director)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">Internal Notes</Label>
                    <Textarea
                      id="internalNotes"
                      placeholder="Internal notes for staff only"
                      rows={3}
                      disabled={isSubmitting}
                    />
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
                form="expense-form"
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Expense..." : "Add Expense"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

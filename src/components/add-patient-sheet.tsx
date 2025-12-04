// components/add-patient-sheet.tsx
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

interface AddPatientSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddPatientSheet({ open, onOpenChange }: AddPatientSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false)

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
                <SheetTitle className="text-2xl font-bold">Add New Patient</SheetTitle>
                <SheetDescription>
                  Fill in the patient details below
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
            id="patient-form" 
            onSubmit={handleSubmit} 
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6 pb-4">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender *</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+1 (555) 123-4567" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input 
                      id="emergencyContact" 
                      placeholder="+1 (555) 987-6543" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Address Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="streetAddress">Street Address *</Label>
                  <Input 
                    id="streetAddress" 
                    placeholder="123 Main Street" 
                    required 
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input 
                      id="city" 
                      placeholder="New York" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State/Province *</Label>
                    <Input 
                      id="state" 
                      placeholder="NY" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP/Postal Code *</Label>
                    <Input 
                      id="zipCode" 
                      placeholder="10001" 
                      required 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Select disabled={isSubmitting}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Medical Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="bloodType">Blood Type</Label>
                  <Select disabled={isSubmitting}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select blood type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="a+">A+</SelectItem>
                      <SelectItem value="a-">A-</SelectItem>
                      <SelectItem value="b+">B+</SelectItem>
                      <SelectItem value="b-">B-</SelectItem>
                      <SelectItem value="o+">O+</SelectItem>
                      <SelectItem value="o-">O-</SelectItem>
                      <SelectItem value="ab+">AB+</SelectItem>
                      <SelectItem value="ab-">AB-</SelectItem>
                      <SelectItem value="unknown">Unknown</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      type="number" 
                      placeholder="175" 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input 
                      id="weight" 
                      type="number" 
                      placeholder="70" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea 
                    id="allergies" 
                    placeholder="List any allergies (e.g., Penicillin, Peanuts)" 
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medicalConditions">Medical Conditions</Label>
                  <Textarea 
                    id="medicalConditions" 
                    placeholder="List any existing medical conditions" 
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentMedications">Current Medications</Label>
                  <Textarea 
                    id="currentMedications" 
                    placeholder="List current medications and dosages" 
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Insurance Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Insurance Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                    <Input 
                      id="insuranceProvider" 
                      placeholder="Blue Cross Blue Shield" 
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyNumber">Policy Number</Label>
                    <Input 
                      id="policyNumber" 
                      placeholder="BCBS123456789" 
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insuranceNotes">Insurance Notes</Label>
                  <Textarea 
                    id="insuranceNotes" 
                    placeholder="Additional insurance information" 
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
                form="patient-form" 
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Patient..." : "Add Patient"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
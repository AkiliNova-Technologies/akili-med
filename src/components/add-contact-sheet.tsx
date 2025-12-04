// components/add-contact-sheet.tsx
import * as React from "react";
import {
  X,
  UserPlus,
  Building,
  Phone,
  Mail,
  MapPin,
  Briefcase,
} from "lucide-react";
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

interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddContactSheet({ open, onOpenChange }: AddContactSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [contactType, setContactType] = React.useState("individual");
  const [isEmergencyContact, setIsEmergencyContact] = React.useState(false);
  const [isPrimaryContact, setIsPrimaryContact] = React.useState(true);

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
                  Add New Contact
                </SheetTitle>
                <SheetDescription>
                  Add a new contact to your address book
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
              id="contact-form"
              onSubmit={handleSubmit}
              className="px-6 py-4"
            >
              <div className="space-y-6 pb-4">
                {/* Contact Type */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Type</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactType">Contact Type *</Label>
                      <Select
                        value={contactType}
                        onValueChange={setContactType}
                        disabled={isSubmitting}
                        required
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="individual">
                            <div className="flex items-center">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Individual
                            </div>
                          </SelectItem>
                          <SelectItem value="company">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Company/Organization
                            </div>
                          </SelectItem>
                          <SelectItem value="doctor">
                            Medical Professional
                          </SelectItem>
                          <SelectItem value="supplier">
                            Supplier/Vendor
                          </SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="employee">
                            Employee/Staff
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medical">
                            Medical Contacts
                          </SelectItem>
                          <SelectItem value="business">
                            Business Contacts
                          </SelectItem>
                          <SelectItem value="personal">
                            Personal Contacts
                          </SelectItem>
                          <SelectItem value="emergency">
                            Emergency Contacts
                          </SelectItem>
                          <SelectItem value="suppliers">Suppliers</SelectItem>
                          <SelectItem value="partners">Partners</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isEmergencyContact">
                          Emergency Contact
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Mark this contact as an emergency contact
                        </p>
                      </div>
                      <Switch
                        id="isEmergencyContact"
                        checked={isEmergencyContact}
                        onCheckedChange={setIsEmergencyContact}
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isPrimaryContact">
                          Primary Contact
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Set as primary contact for this category
                        </p>
                      </div>
                      <Switch
                        id="isPrimaryContact"
                        checked={isPrimaryContact}
                        onCheckedChange={setIsPrimaryContact}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Personal Information
                  </h3>

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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="middleName">Middle Name</Label>
                      <Input
                        id="middleName"
                        placeholder="Michael"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prefix">Prefix/Title</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select title" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mr">Mr.</SelectItem>
                          <SelectItem value="mrs">Mrs.</SelectItem>
                          <SelectItem value="ms">Ms.</SelectItem>
                          <SelectItem value="dr">Dr.</SelectItem>
                          <SelectItem value="prof">Prof.</SelectItem>
                          <SelectItem value="rev">Rev.</SelectItem>
                          <SelectItem value="hon">Hon.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suffix">Suffix</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select suffix" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jr">Jr.</SelectItem>
                          <SelectItem value="sr">Sr.</SelectItem>
                          <SelectItem value="ii">II</SelectItem>
                          <SelectItem value="iii">III</SelectItem>
                          <SelectItem value="iv">IV</SelectItem>
                          <SelectItem value="phd">Ph.D.</SelectItem>
                          <SelectItem value="md">M.D.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nickname">Nickname/Preferred Name</Label>
                      <Input
                        id="nickname"
                        placeholder="Johnny"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="non-binary">Non-binary</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Personal Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional personal information"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Company Information */}
                {contactType === "company" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Company Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        placeholder="Acme Corporation"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title/Position</Label>
                        <Input
                          id="jobTitle"
                          placeholder="e.g., Sales Manager, CEO"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          placeholder="e.g., Marketing, IT, Sales"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyWebsite">Company Website</Label>
                      <Input
                        id="companyWebsite"
                        type="url"
                        placeholder="https://example.com"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="companyDescription">
                        Company Description
                      </Label>
                      <Textarea
                        id="companyDescription"
                        placeholder="Brief description of the company"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Contact Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="john.doe@example.com"
                          className="pl-10"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          className="pl-10"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="mobile">Mobile Number</Label>
                      <Input
                        id="mobile"
                        type="tel"
                        placeholder="+1 (555) 987-6543"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fax">Fax Number</Label>
                      <Input
                        id="fax"
                        type="tel"
                        placeholder="+1 (555) 123-7890"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Personal Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://personalwebsite.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="socialMedia">Social Media Profiles</Label>
                    <div className="space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="LinkedIn" disabled={isSubmitting} />
                        <Input
                          placeholder="Twitter/X"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input placeholder="Facebook" disabled={isSubmitting} />
                        <Input
                          placeholder="Instagram"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="streetAddress">Street Address</Label>
                    <Input
                      id="streetAddress"
                      placeholder="123 Main Street"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        placeholder="New York"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        placeholder="NY"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                      <Input
                        id="zipCode"
                        placeholder="10001"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="au">Australia</SelectItem>
                        <SelectItem value="de">Germany</SelectItem>
                        <SelectItem value="fr">France</SelectItem>
                        <SelectItem value="jp">Japan</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="addressType">Address Type</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home Address</SelectItem>
                          <SelectItem value="work">Work Address</SelectItem>
                          <SelectItem value="billing">
                            Billing Address
                          </SelectItem>
                          <SelectItem value="shipping">
                            Shipping Address
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="est">Eastern Time (ET)</SelectItem>
                          <SelectItem value="cst">Central Time (CT)</SelectItem>
                          <SelectItem value="mst">
                            Mountain Time (MT)
                          </SelectItem>
                          <SelectItem value="pst">Pacific Time (PT)</SelectItem>
                          <SelectItem value="gmt">GMT/UTC</SelectItem>
                          <SelectItem value="cet">
                            Central European Time (CET)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="h-5 w-5" />
                    Professional Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="profession">Profession</Label>
                      <Input
                        id="profession"
                        placeholder="e.g., Doctor, Engineer, Teacher"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        placeholder="e.g., Cardiology, Software Development"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="licenseNumber">License/ID Number</Label>
                      <Input
                        id="licenseNumber"
                        placeholder="e.g., MED123456, ENG789012"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="taxId">Tax ID/SSN</Label>
                      <Input
                        id="taxId"
                        placeholder="XXX-XX-XXXX"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      placeholder="Educational background and degrees"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Professional Experience</Label>
                    <Textarea
                      id="experience"
                      placeholder="Professional background and experience"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Medical Information (for medical contacts) */}
                {(contactType === "doctor" || contactType === "patient") && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Medical Information
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="medicalLicense">
                          Medical License Number
                        </Label>
                        <Input
                          id="medicalLicense"
                          placeholder="e.g., MED123456"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hospital">Hospital/Clinic</Label>
                        <Input
                          id="hospital"
                          placeholder="e.g., General Hospital"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialty">Medical Specialty</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">
                            Dermatology
                          </SelectItem>
                          <SelectItem value="emergency">
                            Emergency Medicine
                          </SelectItem>
                          <SelectItem value="family">
                            Family Medicine
                          </SelectItem>
                          <SelectItem value="internal">
                            Internal Medicine
                          </SelectItem>
                          <SelectItem value="neurology">Neurology</SelectItem>
                          <SelectItem value="obgyn">OB/GYN</SelectItem>
                          <SelectItem value="oncology">Oncology</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="psychiatry">Psychiatry</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="medicalNotes">Medical Notes</Label>
                      <Textarea
                        id="medicalNotes"
                        placeholder="Medical information and notes"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* Emergency Contact Information */}
                {isEmergencyContact && (
                  <div className="space-y-4 p-4 border rounded-lg bg-red-50 dark:bg-red-950/20">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">
                      Emergency Contact Information
                    </h3>

                    <div className="space-y-2">
                      <Label htmlFor="relationship">
                        Relationship to Patient *
                      </Label>
                      <Input
                        id="relationship"
                        placeholder="e.g., Spouse, Parent, Child, Friend"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emergencyPriority">
                        Emergency Priority
                      </Label>
                      <Select disabled={isSubmitting} defaultValue="primary">
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="primary">
                            Primary Contact
                          </SelectItem>
                          <SelectItem value="secondary">
                            Secondary Contact
                          </SelectItem>
                          <SelectItem value="backup">Backup Contact</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="specialInstructions">
                        Special Instructions
                      </Label>
                      <Textarea
                        id="specialInstructions"
                        placeholder="Special instructions for emergency situations"
                        rows={2}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                )}

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="tags">Tags/Labels</Label>
                    <Input
                      id="tags"
                      placeholder="e.g., important, client, friend, family"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Contact Source</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="How did you meet?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="referral">Referral</SelectItem>
                          <SelectItem value="conference">
                            Conference/Event
                          </SelectItem>
                          <SelectItem value="work">Work/Colleague</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="website">
                            Website/Online
                          </SelectItem>
                          <SelectItem value="cold-call">Cold Call</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referredBy">Referred By</Label>
                      <Input
                        id="referredBy"
                        placeholder="Name of person who referred this contact"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="interests">Interests/Hobbies</Label>
                    <Input
                      id="interests"
                      placeholder="e.g., hiking, reading, photography"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">Internal Notes</Label>
                    <Textarea
                      id="internalNotes"
                      placeholder="Internal notes and observations"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Contact Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Settings</h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allowMarketing">
                          Allow Marketing Emails
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          This contact can receive marketing communications
                        </p>
                      </div>
                      <Switch id="allowMarketing" disabled={isSubmitting} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shareDetails">
                          Share Contact Details
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Allow sharing this contact with team members
                        </p>
                      </div>
                      <Switch
                        id="shareDetails"
                        defaultChecked
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isActive">Active Contact</Label>
                        <p className="text-sm text-muted-foreground">
                          Active contacts appear in search results
                        </p>
                      </div>
                      <Switch
                        id="isActive"
                        defaultChecked
                        disabled={isSubmitting}
                      />
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
                form="contact-form"
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Contact..." : "Add Contact"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

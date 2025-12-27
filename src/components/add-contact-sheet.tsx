import * as React from "react";
import {
  X,
  UserPlus,
  Building,
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
import { toast } from "sonner"; // or your toast library
import { ContactType, ContactCategory, Gender } from "@/types/contacts";

interface AddContactSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact: (contactData: any) => Promise<any>;
}

export function AddContactSheet({ open, onOpenChange, onAddContact }: AddContactSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [contactType, setContactType] = React.useState<ContactType>(ContactType.INDIVIDUAL);
  const [isEmergencyContact, setIsEmergencyContact] = React.useState(false);
  const [isPrimaryContact, setIsPrimaryContact] = React.useState(true);
  const [formData, setFormData] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    jobTitle: '',
    contactType: ContactType.INDIVIDUAL,
    category: ContactCategory.OTHER,
    gender: Gender.PREFER_NOT_TO_SAY,
    isActive: true,
    isPrimaryContact: true,
    isEmergencyContact: false,
    allowMarketing: false,
    shareDetails: true,
    notes: '',
    tags: [] as string[],
  });

  // Map frontend type to backend type
  const mapContactType = (type: string): ContactType => {
    const typeMap: Record<string, ContactType> = {
      'individual': ContactType.INDIVIDUAL,
      'company': ContactType.COMPANY,
      'doctor': ContactType.DOCTOR,
      'supplier': ContactType.SUPPLIER,
      'patient': ContactType.PATIENT,
      'employee': ContactType.EMPLOYEE,
    };
    return typeMap[type] || ContactType.INDIVIDUAL;
  };

  // Map frontend category to backend category
  const mapContactCategory = (category: string): ContactCategory => {
    const categoryMap: Record<string, ContactCategory> = {
      'medical': ContactCategory.MEDICAL_CONTACTS,
      'business': ContactCategory.BUSINESS_CONTACTS,
      'personal': ContactCategory.PERSONAL_CONTACTS,
      'emergency': ContactCategory.EMERGENCY_CONTACTS,
      'suppliers': ContactCategory.SUPPLIERS,
      'partners': ContactCategory.PARTNERS,
      'other': ContactCategory.OTHER,
    };
    return categoryMap[category] || ContactCategory.OTHER;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare contact data for backend
      const contactData = {
        ...formData,
        contactType: mapContactType(contactType.toLowerCase()),
        category: mapContactCategory(formData.category?.toLowerCase() || 'other'),
        isEmergencyContact,
        isPrimaryContact,
        isActive: true,
      };

      // Remove empty fields
      Object.keys(contactData).forEach(key => {
        if (contactData[key as keyof typeof contactData] === '' || 
            contactData[key as keyof typeof contactData] === undefined) {
          delete contactData[key as keyof typeof contactData];
        }
      });

      await onAddContact(contactData);
      
      toast.success('Contact added successfully');
      onOpenChange(false);
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        companyName: '',
        jobTitle: '',
        contactType: ContactType.INDIVIDUAL,
        category: ContactCategory.OTHER,
        gender: Gender.PREFER_NOT_TO_SAY,
        isActive: true,
        isPrimaryContact: true,
        isEmergencyContact: false,
        allowMarketing: false,
        shareDetails: true,
        notes: '',
        tags: [],
      });
      setContactType(ContactType.INDIVIDUAL);
      setIsEmergencyContact(false);
      setIsPrimaryContact(true);

    } catch (error: any) {
      console.error('Failed to add contact:', error);
      toast.error(error?.message || 'Failed to add contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
                        onValueChange={(value) => {
                          setContactType(value as ContactType);
                          handleInputChange('contactType', value);
                        }}
                        disabled={isSubmitting}
                        required
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="INDIVIDUAL">
                            <div className="flex items-center">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Individual
                            </div>
                          </SelectItem>
                          <SelectItem value="COMPANY">
                            <div className="flex items-center">
                              <Building className="h-4 w-4 mr-2" />
                              Company/Organization
                            </div>
                          </SelectItem>
                          <SelectItem value="DOCTOR">
                            Medical Professional
                          </SelectItem>
                          <SelectItem value="SUPPLIER">
                            Supplier/Vendor
                          </SelectItem>
                          <SelectItem value="PATIENT">Patient</SelectItem>
                          <SelectItem value="EMPLOYEE">
                            Employee/Staff
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select 
                        value={formData.category}
                        onValueChange={(value) => handleInputChange('category', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEDICAL_CONTACTS">
                            Medical Contacts
                          </SelectItem>
                          <SelectItem value="BUSINESS_CONTACTS">
                            Business Contacts
                          </SelectItem>
                          <SelectItem value="PERSONAL_CONTACTS">
                            Personal Contacts
                          </SelectItem>
                          <SelectItem value="EMERGENCY_CONTACTS">
                            Emergency Contacts
                          </SelectItem>
                          <SelectItem value="SUPPLIERS">Suppliers</SelectItem>
                          <SelectItem value="PARTNERS">Partners</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
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
                        onCheckedChange={(checked) => {
                          setIsEmergencyContact(checked);
                          handleInputChange('isEmergencyContact', checked);
                        }}
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
                        onCheckedChange={(checked) => {
                          setIsPrimaryContact(checked);
                          handleInputChange('isPrimaryContact', checked);
                        }}
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
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john.doe@example.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select 
                        value={formData.gender}
                        onValueChange={(value) => handleInputChange('gender', value)}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="PREFER_NOT_TO_SAY">
                            Prefer not to say
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {contactType === ContactType.COMPANY && (
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input
                        id="companyName"
                        placeholder="Acme Corporation"
                        value={formData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        disabled={isSubmitting}
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      placeholder="e.g., Sales Manager, CEO"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
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
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Additional information about this contact"
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
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
                      <Switch
                        id="allowMarketing"
                        checked={formData.allowMarketing}
                        onCheckedChange={(checked) => handleInputChange('allowMarketing', checked)}
                        disabled={isSubmitting}
                      />
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
                        checked={formData.shareDetails}
                        onCheckedChange={(checked) => handleInputChange('shareDetails', checked)}
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
                  onClick={() => {
                    // Reset form on cancel
                    setFormData({
                      firstName: '',
                      lastName: '',
                      email: '',
                      phone: '',
                      companyName: '',
                      jobTitle: '',
                      contactType: ContactType.INDIVIDUAL,
                      category: ContactCategory.OTHER,
                      gender: Gender.PREFER_NOT_TO_SAY,
                      isActive: true,
                      isPrimaryContact: true,
                      isEmergencyContact: false,
                      allowMarketing: false,
                      shareDetails: true,
                      notes: '',
                      tags: [],
                    });
                  }}
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
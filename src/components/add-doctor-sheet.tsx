// components/add-doctor-sheet.tsx
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
import { useReduxDoctors } from "@/hooks/useReduxDoctors"
import { toast } from "sonner"
import { Gender } from "@/types/patients"

interface AddDoctorSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddDoctorSheet({ open, onOpenChange, onSuccess }: AddDoctorSheetProps) {
  const { addDoctor } = useReduxDoctors()
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "" as Gender | "",
    title: "",
    specialization: "",
    specialty: "",
    medicalLicense: "",
    licenseExpiryDate: "",
    hospital: "",
    department: "",
    yearsOfExperience: "",
    education: "",
    certifications: "",
    languages: "",
    bio: "",
    consultationFee: "",
    isActive: true,
  })

  // Reset form when sheet closes
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          title: "",
          specialization: "",
          specialty: "",
          medicalLicense: "",
          licenseExpiryDate: "",
          hospital: "",
          department: "",
          yearsOfExperience: "",
          education: "",
          certifications: "",
          languages: "",
          bio: "",
          consultationFee: "",
          isActive: true,
        })
      }, 300)
    }
  }, [open])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value,
    }))
  }

//   const handleMultiSelectChange = (id: string, value: string) => {
//     const currentValues = formData[id as keyof typeof formData]?.toString().split(', ') || []
//     const newValues = value.split(',').map(v => v.trim()).filter(v => v)
//     setFormData(prev => ({
//       ...prev,
//       [id]: newValues.join(', '),
//     }))
//   }

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = []
    
    if (!formData.firstName.trim()) errors.push("First name is required")
    if (!formData.lastName.trim()) errors.push("Last name is required")
    if (!formData.email.trim()) {
      errors.push("Email is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.push("Email is invalid")
    }
    if (!formData.phone.trim()) errors.push("Phone number is required")
    if (!formData.specialization.trim() && !formData.specialty.trim()) {
      errors.push("Specialization or specialty is required")
    }
    if (!formData.medicalLicense.trim()) errors.push("Medical license is required")
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    const { isValid, errors } = validateForm()
    if (!isValid) {
      errors.forEach(error => toast.error(error))
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Format the data for API
      const doctorData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        // dateOfBirth: formData.dateOfBirth || undefined,
        // gender: formData.gender as Gender,
        title: formData.title.trim() || undefined,
        specialization: formData.specialization.trim() || undefined,
        specialty: formData.specialty.trim() || undefined,
        medicalLicense: formData.medicalLicense.trim(),
        // licenseExpiryDate: formData.licenseExpiryDate || undefined,
        hospital: formData.hospital.trim() || undefined,
        department: formData.department.trim() || undefined,
        // yearsOfExperience: formData.yearsOfExperience ? parseInt(formData.yearsOfExperience) : undefined,
        // education: formData.education.split(', ').filter(e => e.trim()),
        // certifications: formData.certifications.split(', ').filter(c => c.trim()),
        // languages: formData.languages.split(', ').filter(l => l.trim()),
        // bio: formData.bio.trim() || undefined,
        // consultationFee: formData.consultationFee ? parseFloat(formData.consultationFee) : undefined,
        // isActive: true,
      }
      
      await addDoctor(doctorData)
      
      toast.success("Doctor added successfully!")
      onOpenChange(false)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add doctor")
      console.error("Error adding doctor:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Format phone number
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    const formatted = formatPhoneNumber(value)
    setFormData(prev => ({
      ...prev,
      phone: formatted,
    }))
  }

  // Common specializations
  const specializations = [
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Hematology",
    "Internal Medicine",
    "Neurology",
    "Oncology",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Surgery",
    "Urology",
    "Orthopedics",
    "Ophthalmology",
    "ENT",
    "General Practitioner",
  ]

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
                <SheetTitle className="text-2xl font-bold">Add New Doctor</SheetTitle>
                <SheetDescription>
                  Fill in the doctor details below. Fields marked with * are required.
                </SheetDescription>
              </div>
              <SheetClose asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8"
                  disabled={isSubmitting}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </SheetClose>
            </div>
          </SheetHeader>
          
          <form 
            id="doctor-form" 
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
                      value={formData.firstName}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      required 
                      disabled={isSubmitting}
                      value={formData.lastName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input 
                      id="dateOfBirth" 
                      type="date" 
                      disabled={isSubmitting}
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      max={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      disabled={isSubmitting}
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={Gender.MALE}>Male</SelectItem>
                        <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                        <SelectItem value={Gender.OTHER}>Other</SelectItem>
                        <SelectItem value={Gender.UNSPECIFIED}>Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Select 
                      disabled={isSubmitting}
                      value={formData.title}
                      onValueChange={(value) => handleSelectChange("title", value)}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select title" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization *</Label>
                    <Select 
                      disabled={isSubmitting}
                      value={formData.specialization}
                      onValueChange={(value) => handleSelectChange("specialization", value)}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map(spec => (
                          <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medicalLicense">Medical License *</Label>
                    <Input 
                      id="medicalLicense" 
                      placeholder="MED-123456" 
                      required 
                      disabled={isSubmitting}
                      value={formData.medicalLicense}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                    <Input 
                      id="licenseExpiryDate" 
                      type="date" 
                      disabled={isSubmitting}
                      value={formData.licenseExpiryDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialty">Specialty (if different from specialization)</Label>
                  <Input 
                    id="specialty" 
                    placeholder="e.g., Pediatric Cardiology" 
                    disabled={isSubmitting}
                    value={formData.specialty}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                    <Input 
                      id="yearsOfExperience" 
                      type="number" 
                      placeholder="10" 
                      min="0"
                      max="50"
                      disabled={isSubmitting}
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultationFee">Consultation Fee ($)</Label>
                    <Input 
                      id="consultationFee" 
                      type="number" 
                      placeholder="100" 
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                      value={formData.consultationFee}
                      onChange={handleInputChange}
                    />
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
                    placeholder="john.doe@hospital.com" 
                    required 
                    disabled={isSubmitting}
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="(555) 123-4567" 
                    required 
                    disabled={isSubmitting}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                  />
                </div>
              </div>

              {/* Hospital Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Hospital Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hospital">Hospital</Label>
                    <Input 
                      id="hospital" 
                      placeholder="City General Hospital" 
                      disabled={isSubmitting}
                      value={formData.hospital}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Input 
                      id="department" 
                      placeholder="Cardiology Department" 
                      disabled={isSubmitting}
                      value={formData.department}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Qualifications */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Qualifications</h3>
                <div className="space-y-2">
                  <Label htmlFor="education">Education (comma separated)</Label>
                  <Input 
                    id="education" 
                    placeholder="MD, PhD, MBA" 
                    disabled={isSubmitting}
                    value={formData.education}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="certifications">Certifications (comma separated)</Label>
                  <Input 
                    id="certifications" 
                    placeholder="Board Certified, ACLS, BLS" 
                    disabled={isSubmitting}
                    value={formData.certifications}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input 
                    id="languages" 
                    placeholder="English, Spanish, French" 
                    disabled={isSubmitting}
                    value={formData.languages}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Bio</h3>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biography</Label>
                  <Textarea 
                    id="bio" 
                    placeholder="Brief biography about the doctor..." 
                    rows={4}
                    disabled={isSubmitting}
                    value={formData.bio}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>
          </form>
          
          <SheetFooter className="px-6 py-4 border-t sticky bottom-0 bg-background">
            <div className="flex items-center justify-between w-full gap-8">
              <SheetClose asChild>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="flex flex-1" 
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </SheetClose>
              <Button 
                type="submit" 
                form="doctor-form" 
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Adding Doctor...
                  </>
                ) : (
                  "Add Doctor"
                )}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  )
}
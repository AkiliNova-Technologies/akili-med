"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { AddAppointmentSheet } from "@/components/add-appointment-sheet"
import { useState, useCallback } from "react"
import type { Event } from "@/components/enhanced-calender"
import { EnhancedCalendar } from "@/components/enhanced-calender"

// Sample appointment data structure
const initialAppointments: Event[] = [
  {
    id: "1",
    title: "John Doe - Routine Checkup",
    description: "Annual physical examination. Patient reports occasional headaches.",
    startTime: new Date(new Date().setHours(9, 0, 0, 0)),
    endTime: new Date(new Date().setHours(9, 30, 0, 0)),
    color: "blue",
    category: "Routine Checkup",
    tags: ["Follow-up", "Insurance"]
  },
  {
    id: "2",
    title: "Jane Smith - Cardiology Consultation",
    description: "Follow-up after heart surgery. Monitor recovery progress.",
    startTime: new Date(new Date().setHours(10, 0, 0, 0)),
    endTime: new Date(new Date().setHours(10, 45, 0, 0)),
    color: "red",
    category: "Consultation",
    tags: ["High Priority", "Cardiology"]
  },
  {
    id: "3",
    title: "Robert Johnson - Lab Test",
    description: "Blood work and cholesterol screening. Fasting required.",
    startTime: new Date(new Date().setHours(11, 30, 0, 0)),
    endTime: new Date(new Date().setHours(12, 0, 0, 0)),
    color: "green",
    category: "Lab Test",
    tags: ["Lab", "Test Results"]
  },
  {
    id: "4",
    title: "Sarah Williams - Therapy Session",
    description: "Weekly cognitive behavioral therapy session.",
    startTime: new Date(new Date().setHours(14, 0, 0, 0)),
    endTime: new Date(new Date().setHours(14, 50, 0, 0)),
    color: "purple",
    category: "Therapy Session",
    tags: ["Mental Health", "Weekly"]
  },
  {
    id: "5",
    title: "Michael Brown - Vaccination",
    description: "Annual flu shot and COVID-19 booster.",
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 1)).setHours(15, 30, 0, 0)),
    color: "orange",
    category: "Vaccination",
    tags: ["Preventive", "Vaccine"]
  },
  {
    id: "6",
    title: "Emma Wilson - Emergency Visit",
    description: "Acute abdominal pain. Possible appendicitis.",
    startTime: new Date(new Date().setDate(new Date().getDate() - 1)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(16, 0, 0, 0)),
    color: "red",
    category: "Emergency",
    tags: ["Urgent", "Emergency"]
  },
  {
    id: "7",
    title: "David Miller - Follow-up",
    description: "Post-surgery check-up. Stitch removal scheduled.",
    startTime: new Date(new Date().setDate(new Date().getDate() + 2)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 2)).setHours(9, 0, 0, 0)),
    color: "blue",
    category: "Follow-up",
    tags: ["Surgery", "Post-op"]
  },
  {
    id: "8",
    title: "Lisa Taylor - Pediatric Consultation",
    description: "Child wellness check. Vaccination schedule review.",
    startTime: new Date(new Date().setDate(new Date().getDate() + 3)),
    endTime: new Date(new Date(new Date().setDate(new Date().getDate() + 3)).setHours(10, 30, 0, 0)),
    color: "pink",
    category: "Consultation",
    tags: ["Pediatric", "Wellness"]
  }
]

// Medical-specific categories and tags
const appointmentCategories = [
  "Consultation",
  "Follow-up",
  "Routine Checkup",
  "Emergency",
  "Vaccination",
  "Lab Test",
  "Surgery",
  "Therapy Session",
  "Pediatric",
  "Dental",
  "Physical Therapy",
  "Specialist Referral"
]

const availableTags = [
  "Urgent",
  "High Priority",
  "Follow-up",
  "Insurance",
  "New Patient",
  "Returning Patient",
  "Pediatric",
  "Geriatric",
  "Lab",
  "Test Results",
  "Mental Health",
  "Surgery",
  "Post-op",
  "Preventive",
  "Vaccine",
  "Emergency",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Orthopedic"
]

export default function AppointmentsPage() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [appointments, setAppointments] = useState<Event[]>(initialAppointments)

  const handleEventCreate = useCallback((event: Omit<Event, "id">) => {
    const newAppointment: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9)
    }
    setAppointments(prev => [...prev, newAppointment])
    console.log("Appointment created:", newAppointment)
  }, [])

  const handleEventUpdate = useCallback((id: string, updatedEvent: Partial<Event>) => {
    setAppointments(prev =>
      prev.map(event =>
        event.id === id ? { ...event, ...updatedEvent } : event
      )
    )
    console.log("Appointment updated:", id, updatedEvent)
  }, [])

  const handleEventDelete = useCallback((id: string) => {
    setAppointments(prev => prev.filter(event => event.id !== id))
    console.log("Appointment deleted:", id)
  }, [])

  // Function to convert appointment form data to Event format
  const handleAppointmentSubmit = useCallback((formData: any) => {
    // Create a new appointment from form data
    const startDate = formData.date
    const [startHour, startMinute] = formData.startTime.split(':').map(Number)
    const [endHour, endMinute] = formData.endTime.split(':').map(Number)
    
    const startTime = new Date(startDate)
    startTime.setHours(startHour, startMinute, 0, 0)
    
    const endTime = new Date(startDate)
    endTime.setHours(endHour, endMinute, 0, 0)
    
    const newEvent: Omit<Event, "id"> = {
      title: `${formData.patient} - ${formData.appointmentType}`,
      description: formData.reason,
      startTime,
      endTime,
      color: getColorForAppointmentType(formData.appointmentType),
      category: formData.appointmentType,
      tags: [formData.priority, formData.paymentStatus]
    }
    
    handleEventCreate(newEvent)
  }, [handleEventCreate])

  // Helper function to assign colors based on appointment type
  const getColorForAppointmentType = (type: string): string => {
    const colorMap: Record<string, string> = {
      "Emergency": "red",
      "Consultation": "blue",
      "Follow-up": "green",
      "Routine Checkup": "purple",
      "Vaccination": "orange",
      "Lab Test": "pink",
      "Surgery": "red",
      "Therapy Session": "purple",
      "Pediatric": "pink",
      "Dental": "blue",
      "Physical Therapy": "green",
      "Specialist Referral": "orange"
    }
    return colorMap[type] || "blue"
  }

  return (
    <>
      <SiteHeader
        rightActions={
          <Button 
            className="h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold"
            onClick={() => setSheetOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Appointment
          </Button>
        }
      />
      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Appointments</h1>
            <p className="text-muted-foreground mt-2">
              Manage and schedule patient appointments. Drag and drop to reschedule.
            </p>
          </div>
          
          <Card className="border-none shadow-none">
            <div className="px-8">
              <EnhancedCalendar
                events={appointments}
                onEventCreate={handleEventCreate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
                categories={appointmentCategories}
                availableTags={availableTags}
                defaultView="week"
                className="w-full"
              />
            </div>
          </Card>
          
        </div>
      </div>
      
      <AddAppointmentSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen}
        onSubmit={handleAppointmentSubmit}
      />
    </>
  )
}
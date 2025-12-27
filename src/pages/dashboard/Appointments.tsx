"use client"

import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { AddAppointmentSheet } from "@/components/add-appointment-sheet"
import { useState, useCallback, useEffect } from "react"
import type { Event } from "@/components/enhanced-calender"
import { EnhancedCalendar } from "@/components/enhanced-calender"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { useReduxAppointments } from "@/hooks/useReduxAppointments"
import { useReduxPatients } from "@/hooks/useReduxPatients"
import { useReduxDoctors } from "@/hooks/useReduxDoctors"
import {
  AppointmentType,
  PaymentStatus,
  PriorityLevel,
  ReminderPreference,
} from "@/types/appointments"

// Medical-specific categories and tags
const appointmentCategories = [
  "CONSULTATION",
  "FOLLOW_UP",
  "ROUTINE_CHECKUP",
  "EMERGENCY",
  "VACCINATION",
  "LAB_TEST",
  "SURGERY",
  "THERAPY_SESSION",
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
  const [mobileView] = useState<"month" | "week" | "day" | "list">("week")
  const isMobile = useIsMobile()

  // Use the Redux hooks
  const {
    appointments,
    loading,
    addAppointment,
    editAppointment,
    removeAppointment,
    getAppointments,
  } = useReduxAppointments()

  const { patients, loading: patientsLoading } = useReduxPatients()
  const { doctors, loading: doctorsLoading } = useReduxDoctors()

  // Fetch appointments on component mount
  useEffect(() => {
    getAppointments({
      page: 1,
      limit: 50, // Fetch more for calendar view
      filters: {},
    })
  }, [getAppointments])

  

  // Convert Redux appointments to calendar events
  const calendarEvents = appointments.map((appointment) => {
    const startDate = new Date(appointment.date)
    const [startHour, startMinute] = appointment.startTime.split(':').map(Number)
    const [endHour, endMinute] = appointment.endTime.split(':').map(Number)
    
    const startTime = new Date(startDate)
    startTime.setHours(startHour, startMinute, 0, 0)
    
    const endTime = new Date(startDate)
    endTime.setHours(endHour, endMinute, 0, 0)

    const getColorForAppointmentStatus = (status: string): string => {
    const colorMap: Record<string, string> = {
      "SCHEDULED": "blue",
      "CONFIRMED": "green",
      "WAITING": "yellow",
      "IN_PROGRESS": "purple",
      "COMPLETED": "gray",
      "CANCELLED": "red",
      "NO_SHOW": "orange",
      "RESCHEDULED": "indigo"
    }
    return colorMap[status] || "blue"
  }
    
    return {
      id: appointment.id,
      title: `${appointment.patient?.firstName || 'Unknown'} ${appointment.patient?.lastName || 'Patient'} - ${appointment.appointmentType}`,
      description: appointment.reason,
      startTime,
      endTime,
      color: getColorForAppointmentStatus(appointment.status), // Now this function is defined above
      category: appointment.appointmentType,
      tags: [appointment.priority, appointment.status],
      metaData: {
        appointmentId: appointment.id,
        patientId: appointment.patientId,
        doctorId: appointment.doctorId,
        status: appointment.status,
        priority: appointment.priority,
      }
    } as Event
  })

  const handleEventCreate = useCallback(async (event: Omit<Event, "id">) => {
    // Extract patient and doctor from title (simplified)
    const titleParts = event.title.split(' - ')
    const patientName = titleParts[0] || 'Unknown Patient'
    
    // Find patient by name (simplified - you'd use a search in real app)
    const patient = patients.find(p => 
      `${p.firstName} ${p.lastName}` === patientName
    )
    
    if (!patient) {
      console.error("Patient not found:", patientName)
      return
    }

    // Find first available doctor (simplified)
    const doctor = doctors[0]
    
    if (!doctor) {
      console.error("No doctors available")
      return
    }

    try {
      const appointmentData = {
      patientId: patient.id,
      doctorId: doctor.id,
      appointmentType: event.category as AppointmentType || AppointmentType.CONSULTATION,
      date: event.startTime.toISOString().split('T')[0],
      startTime: event.startTime.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      endTime: event.endTime.toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      reason: event.description || 'Appointment',
      priority: PriorityLevel.NORMAL,
      reminderPreference: ReminderPreference.ONE_DAY_BEFORE,
      paymentStatus: PaymentStatus.PENDING,
    }

      await addAppointment(appointmentData)
      console.log("Appointment created via calendar drag")
    } catch (error) {
      console.error("Failed to create appointment:", error)
    }
  }, [addAppointment, patients, doctors])

  const handleEventUpdate = useCallback(async (id: string, updatedEvent: Partial<Event>) => {
    try {
      // Find the existing appointment
      const existingAppointment = appointments.find(app => app.id === id)
      if (!existingAppointment) return

      // Prepare update data
      const updateData: any = {}

      // Update date if startTime changed
      if (updatedEvent.startTime) {
        const newDate = updatedEvent.startTime
        updateData.date = newDate.toISOString().split('T')[0]
        updateData.startTime = newDate.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }

      // Update end time if provided
      if (updatedEvent.endTime) {
        updateData.endTime = updatedEvent.endTime.toLocaleTimeString('en-US', { 
          hour12: false, 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }

      // Update if there are changes
      if (Object.keys(updateData).length > 0) {
        await editAppointment(id, updateData)
        console.log("Appointment updated via calendar drag")
      }
    } catch (error) {
      console.error("Failed to update appointment:", error)
    }
  }, [editAppointment, appointments])

  const handleEventDelete = useCallback(async (id: string) => {
    try {
      await removeAppointment(id)
      console.log("Appointment deleted via calendar")
    } catch (error) {
      console.error("Failed to delete appointment:", error)
    }
  }, [removeAppointment])

  // Function to convert appointment form data to Event format
  // const handleAppointmentSubmit = useCallback(async (formData: any) => {
  //   try {
  //     const appointmentData = {
  //       patientId: formData.patientId,
  //       doctorId: formData.doctorId,
  //       roomId: formData.roomId || undefined,
  //       appointmentType: formData.appointmentType as AppointmentType,
  //       date: formData.date,
  //       startTime: formData.startTime,
  //       endTime: formData.endTime,
  //       reason: formData.reason,
  //       symptoms: formData.symptoms || undefined,
  //       notes: formData.notes || undefined,
  //       priority: formData.priority as PriorityLevel,
  //       reminderPreference: formData.reminderPreference as any,
  //       paymentStatus: formData.paymentStatus as any,
  //       estimatedCost: formData.estimatedCost ? parseFloat(formData.estimatedCost) : undefined,
  //       paymentNotes: formData.paymentNotes || undefined,
  //     }

  //     await addAppointment(appointmentData)
  //     console.log("Appointment created via form")
  //   } catch (error) {
  //     console.error("Failed to create appointment:", error)
  //   }
  // }, [addAppointment])


  // Handle status change from calendar context menu
  // const handleStatusChange = useCallback(async (appointmentId: string, newStatus: string) => {
  //   try {
  //     await updateStatus(appointmentId, newStatus)
  //   } catch (error) {
  //     console.error("Failed to update status:", error)
  //   }
  // }, [updateStatus])

  return (
    <>
      <SiteHeader
        rightActions={
          <Button 
            className={cn(
              "h-9 md:h-11 bg-[#e11d48] hover:bg-[#e11d48]/80 font-semibold text-white",
              isMobile ? "text-xs px-3" : ""
            )}
            onClick={() => setSheetOpen(true)}
            size={isMobile ? "sm" : "default"}
            disabled={loading || patientsLoading || doctorsLoading}
          >
            <Plus className={cn("h-3 w-3 md:h-4 md:w-4", isMobile ? "mr-1" : "mr-2")} />
            {isMobile ? "Add" : "Add Appointment"}
          </Button>
        }
      />
      <div className="min-h-screen">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              Appointments
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
              Manage and schedule patient appointments. Drag and drop to reschedule.
              {loading && " Loading appointments..."}
              {patientsLoading && " Loading patients..."}
              {doctorsLoading && " Loading doctors..."}
            </p>
          </div>
        
          <Card className={cn(
            "border-none shadow-none",
            isMobile ? "p-2" : "p-6 md:p-6"
          )}>
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading appointments...</p>
                </div>
              </div>
            ) : (
              <EnhancedCalendar
                events={calendarEvents}
                onEventCreate={handleEventCreate}
                onEventUpdate={handleEventUpdate}
                onEventDelete={handleEventDelete}
                categories={appointmentCategories}
                availableTags={availableTags}
                defaultView={isMobile ? mobileView : "week"}
                className="w-full"
                // onEventContextMenu={(event, mouseEvent) => {
                  
                //   console.log("Context menu for event:", event)
                // }}
              />
            )}
          </Card>
          
        </div>
      </div>
      
      <AddAppointmentSheet 
        open={sheetOpen} 
        onOpenChange={setSheetOpen}
      />
    </>
  )
}
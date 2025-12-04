// components/add-appointment-sheet.tsx
import * as React from "react";
import { X } from "lucide-react";
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
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";

interface AddAppointmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (formData: any) => void;
}

export function AddAppointmentSheet({
  open,
  onOpenChange,
  onSubmit,
}: AddAppointmentSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [date, setDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("10:00");
  const [patient, setPatient] = React.useState("");
  const [appointmentType, setAppointmentType] = React.useState("");
  const [reason, setReason] = React.useState("");
  const [priority, setPriority] = React.useState("normal");
  const [paymentStatus, setPaymentStatus] = React.useState("pending");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      patient,
      appointmentType,
      date,
      startTime,
      endTime,
      reason,
      priority,
      paymentStatus,
    };

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Call the onSubmit prop if provided
    if (onSubmit) {
      onSubmit(formData);
    }

    console.log("Form submitted:", formData);
    setIsSubmitting(false);
    onOpenChange(false);

    // Reset form
    setPatient("");
    setAppointmentType("");
    setReason("");
    setDate(undefined);
    setStartTime("09:00");
    setEndTime("10:00");
    setPriority("normal");
    setPaymentStatus("pending");
  };
  // Generate time options (every 30 minutes from 8:00 to 18:00)
  const timeOptions = React.useMemo(() => {
    const times = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const hourStr = hour.toString().padStart(2, "0");
        const minuteStr = minute.toString().padStart(2, "0");
        times.push(`${hourStr}:${minuteStr}`);
      }
    }
    return times;
  }, []);

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
                  Schedule New Appointment
                </SheetTitle>
                <SheetDescription>
                  Fill in the appointment details below
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
            id="appointment-form"
            onSubmit={handleSubmit}
            className="flex-1 overflow-y-auto px-6 py-4"
          >
            <div className="space-y-6 pb-4">
              {/* Patient Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Patient Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="patient">Select Patient *</Label>
                  <Select disabled={isSubmitting} required>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Search for patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="robert-johnson">
                        Robert Johnson
                      </SelectItem>
                      <SelectItem value="sarah-williams">
                        Sarah Williams
                      </SelectItem>
                      <SelectItem value="michael-brown">
                        Michael Brown
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentType">Appointment Type *</Label>
                  <Select disabled={isSubmitting} required>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select appointment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="follow-up">Follow-up</SelectItem>
                      <SelectItem value="checkup">Routine Checkup</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="vaccination">Vaccination</SelectItem>
                      <SelectItem value="lab-test">Lab Test</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="therapy">Therapy Session</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Date & Time</h3>

                <div className="space-y-2">
                  <Label>Appointment Date *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal shadow-none bg-input/40",
                          !date && "text-muted-foreground"
                        )}
                        disabled={isSubmitting}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={isSubmitting}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">Start Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Select
                        value={startTime}
                        onValueChange={setStartTime}
                        disabled={isSubmitting}
                        required
                      >
                        <SelectTrigger className="min-w-full pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time *</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Select
                        value={endTime}
                        onValueChange={setEndTime}
                        disabled={isSubmitting}
                        required
                      >
                        <SelectTrigger className="min-w-full pl-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value="1 hour"
                    readOnly
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Doctor/Provider */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Provider</h3>
                <div className="space-y-2">
                  <Label htmlFor="doctor">Assigned Doctor/Provider *</Label>
                  <Select disabled={isSubmitting} required>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dr-smith">
                        Dr. Sarah Smith (General Physician)
                      </SelectItem>
                      <SelectItem value="dr-johnson">
                        Dr. Michael Johnson (Cardiologist)
                      </SelectItem>
                      <SelectItem value="dr-williams">
                        Dr. Emily Williams (Pediatrician)
                      </SelectItem>
                      <SelectItem value="dr-brown">
                        Dr. David Brown (Dermatologist)
                      </SelectItem>
                      <SelectItem value="dr-taylor">
                        Dr. Jennifer Taylor (Neurologist)
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room/Location</Label>
                  <Select disabled={isSubmitting}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="room-101">
                        Room 101 (Examination)
                      </SelectItem>
                      <SelectItem value="room-102">
                        Room 102 (Examination)
                      </SelectItem>
                      <SelectItem value="room-201">
                        Room 201 (Consultation)
                      </SelectItem>
                      <SelectItem value="room-202">
                        Room 202 (Consultation)
                      </SelectItem>
                      <SelectItem value="lab">Lab Room</SelectItem>
                      <SelectItem value="surgery">Surgery Room</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Appointment Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit *</Label>
                  <Textarea
                    id="reason"
                    placeholder="Describe the reason for the appointment"
                    rows={3}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Symptoms</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="List any symptoms the patient is experiencing"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes or special requirements"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Status & Priority */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Status & Priority</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Appointment Status</Label>
                    <Select disabled={isSubmitting} defaultValue="scheduled">
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="waiting">Waiting</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No Show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select disabled={isSubmitting} defaultValue="normal">
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder">Send Reminder</Label>
                  <Select disabled={isSubmitting} defaultValue="1-day">
                    <SelectTrigger className="min-w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Don't Send</SelectItem>
                      <SelectItem value="1-hour">1 hour before</SelectItem>
                      <SelectItem value="6-hours">6 hours before</SelectItem>
                      <SelectItem value="1-day">1 day before</SelectItem>
                      <SelectItem value="2-days">2 days before</SelectItem>
                      <SelectItem value="1-week">1 week before</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Payment Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Payment Information</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select disabled={isSubmitting} defaultValue="pending">
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="partial">Partial Payment</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="waived">Waived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentNotes">Payment Notes</Label>
                  <Textarea
                    id="paymentNotes"
                    placeholder="Payment-related notes"
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
                form="appointment-form"
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Scheduling..." : "Schedule Appointment"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

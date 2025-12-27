import * as React from "react";
import { X, CalendarIcon, Clock } from "lucide-react";
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
import { format } from "date-fns";
import { useReduxAppointments } from "@/hooks/useReduxAppointments";
import {
  AppointmentType,
  AppointmentStatus,
  PriorityLevel,
  PaymentStatus,
  ReminderPreference,
} from "@/types/appointments";
import { useReduxDoctors } from "@/hooks/useReduxDoctors";
import { useReduxPatients } from "@/hooks/useReduxPatients";
import { toast } from "sonner";

interface AddAppointmentSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddAppointmentSheet({
  open,
  onOpenChange,
}: AddAppointmentSheetProps) {
  const { addAppointment } = useReduxAppointments();
  // These hooks will be created in the next steps
  const { patients = [], loading: patientsLoading } = useReduxPatients();
  const { doctors, loading: doctorsLoading } = useReduxDoctors();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [date, setDate] = React.useState<Date>();
  const [startTime, setStartTime] = React.useState("09:00");
  const [endTime, setEndTime] = React.useState("10:00");
  const [patientId, setPatientId] = React.useState("");
  const [doctorId, setDoctorId] = React.useState("");
  const [appointmentType, setAppointmentType] = React.useState<AppointmentType>(
    AppointmentType.CONSULTATION
  );
  const [reason, setReason] = React.useState("");
  const [symptoms, setSymptoms] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [status, setStatus] = React.useState<AppointmentStatus>(
    AppointmentStatus.SCHEDULED
  );
  const [priority, setPriority] = React.useState<PriorityLevel>(
    PriorityLevel.NORMAL
  );
  const [reminderPreference, setReminderPreference] =
    React.useState<ReminderPreference>(ReminderPreference.ONE_DAY_BEFORE);
  const [paymentStatus, setPaymentStatus] = React.useState<PaymentStatus>(
    PaymentStatus.PENDING
  );
  const [estimatedCost, setEstimatedCost] = React.useState("");
  const [paymentNotes, setPaymentNotes] = React.useState("");
  const [roomId, setRoomId] = React.useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!patientId || !doctorId || !date || !reason) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const appointmentData = {
        patientId,
        doctorId,
        roomId: roomId || undefined,
        appointmentType,
        date,
        startTime,
        endTime,
        reason,
        symptoms: symptoms || undefined,
        notes: notes || undefined,
        priority,
        reminderPreference,
        paymentStatus,
        estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
        paymentNotes: paymentNotes || undefined,
      };

      await addAppointment(appointmentData);

      // Reset form
      resetForm();
      onOpenChange(false);
    } catch (error: any) {
      console.error("Failed to create appointment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setDate(undefined);
    setStartTime("09:00");
    setEndTime("10:00");
    setPatientId("");
    setDoctorId("");
    setAppointmentType(AppointmentType.CONSULTATION);
    setReason("");
    setSymptoms("");
    setNotes("");
    setStatus(AppointmentStatus.SCHEDULED);
    setPriority(PriorityLevel.NORMAL);
    setReminderPreference(ReminderPreference.ONE_DAY_BEFORE);
    setPaymentStatus(PaymentStatus.PENDING);
    setEstimatedCost("");
    setPaymentNotes("");
    setRoomId("");
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

  // Calculate duration
  const calculateDuration = () => {
    if (!startTime || !endTime) return "N/A";

    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    const durationMinutes = endTotal - startTotal;

    if (durationMinutes <= 0) return "Invalid";

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (hours === 0) return `${minutes} minutes`;
    if (minutes === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
    return `${hours}h ${minutes}m`;
  };

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
                  <Label htmlFor="patient">
                    Select Patient <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={patientId}
                    onValueChange={setPatientId}
                    disabled={isSubmitting || patientsLoading}
                    required
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Search for patient..." />
                    </SelectTrigger>
                    <SelectContent>
                      {patientsLoading ? (
                        <div className="py-2 px-2 text-sm text-muted-foreground">
                          Loading patients...
                        </div>
                      ) : patients.length === 0 ? (
                        <div className="py-2 px-2 text-sm text-muted-foreground">
                          No patients found
                        </div>
                      ) : (
                        patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id}>
                            {patient.firstName} {patient.lastName} -{" "}
                            {patient.phone}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="appointmentType">
                    Appointment Type <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={appointmentType}
                    onValueChange={(value) =>
                      setAppointmentType(value as AppointmentType)
                    }
                    disabled={isSubmitting}
                    required
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(AppointmentType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Date & Time */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Date & Time</h3>

                <div className="space-y-2">
                  <Label>
                    Appointment Date <span className="text-destructive">*</span>
                  </Label>
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
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startTime">
                      Start Time <span className="text-destructive">*</span>
                    </Label>
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
                    <Label htmlFor="endTime">
                      End Time <span className="text-destructive">*</span>
                    </Label>
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
                    value={calculateDuration()}
                    readOnly
                    aria-disabled
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {/* Doctor/Provider */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Medical Provider</h3>
                <div className="space-y-2">
                  <Label htmlFor="doctor">
                    Assigned Doctor <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={doctorId}
                    onValueChange={setDoctorId}
                    disabled={isSubmitting || doctorsLoading}
                    required
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select doctor" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorsLoading ? (
                        <div className="py-2 px-2 text-sm text-muted-foreground">
                          Loading doctors...
                        </div>
                      ) : doctors.length === 0 ? (
                        <div className="py-2 px-2 text-sm text-muted-foreground">
                          No doctors found
                        </div>
                      ) : (
                        doctors.map((doctor) => (
                          <SelectItem key={doctor.id} value={doctor.id}>
                            Dr. {doctor.firstName} {doctor.lastName} -{" "}
                            {doctor.specialization || "General Physician"}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Appointment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Appointment Details</h3>

                <div className="space-y-2">
                  <Label htmlFor="reason">
                    Reason for Visit <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
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
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="List any symptoms the patient is experiencing"
                    rows={2}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
                    <Select
                      value={status}
                      onValueChange={(value) =>
                        setStatus(value as AppointmentStatus)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(AppointmentStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority Level</Label>
                    <Select
                      value={priority}
                      onValueChange={(value) =>
                        setPriority(value as PriorityLevel)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PriorityLevel).map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reminder">Send Reminder</Label>
                  <Select
                    value={reminderPreference}
                    onValueChange={(value) =>
                      setReminderPreference(value as ReminderPreference)
                    }
                    disabled={isSubmitting}
                  >
                    <SelectTrigger className="min-w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ReminderPreference).map((pref) => (
                        <SelectItem key={pref} value={pref}>
                          {pref === "NONE"
                            ? "Don't Send"
                            : pref.replace("_", " ").toLowerCase()}
                        </SelectItem>
                      ))}
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
                    <Select
                      value={paymentStatus}
                      onValueChange={(value) =>
                        setPaymentStatus(value as PaymentStatus)
                      }
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(PaymentStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedCost">Estimated Cost ($)</Label>
                    <Input
                      id="estimatedCost"
                      type="number"
                      value={estimatedCost}
                      onChange={(e) => setEstimatedCost(e.target.value)}
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
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
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
                  onClick={resetForm}
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

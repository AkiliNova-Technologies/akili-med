import * as React from "react";
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  User,
  Paperclip,
  Send,
  Upload,
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
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Switch } from "@/components/ui/switch";
// import { Badge } from "@/components/ui/badge"

interface AddCommunicationSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddCommunicationSheet({
  open,
  onOpenChange,
}: AddCommunicationSheetProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [communicationDate, setCommunicationDate] = React.useState<Date>();
  const [communicationTime, setCommunicationTime] = React.useState("14:00");
  const [communicationType, setCommunicationType] = React.useState("email");
  const [priority, setPriority] = React.useState("normal");
  const [isFollowUpRequired, setIsFollowUpRequired] = React.useState(false);
  const [attachments, setAttachments] = React.useState<string[]>([]);

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

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newAttachments = Array.from(files).map((file) => file.name);
      setAttachments([...attachments, ...newAttachments]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  // Generate time options
  const timeOptions = React.useMemo(() => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
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
        className="w-full sm:max-w-2xl p-0 flex flex-col"
      >
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-2xl font-bold">
                  Add New Communication
                </SheetTitle>
                <SheetDescription>
                  Record communication with patients, staff, or contacts
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
              id="communication-form"
              onSubmit={handleSubmit}
              className="px-6 py-4"
            >
              <div className="space-y-6 pb-4">
                {/* Communication Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Communication Details
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="communicationType">
                      Communication Type *
                    </Label>
                    <Select
                      value={communicationType}
                      onValueChange={setCommunicationType}
                      disabled={isSubmitting}
                      required
                    >
                      <SelectTrigger className="min-w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </div>
                        </SelectItem>
                        <SelectItem value="phone">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Phone Call
                          </div>
                        </SelectItem>
                        <SelectItem value="sms">
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            SMS/Text Message
                          </div>
                        </SelectItem>
                        <SelectItem value="in-person">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            In-Person Meeting
                          </div>
                        </SelectItem>
                        <SelectItem value="video">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2" />
                            Video Call
                          </div>
                        </SelectItem>
                        <SelectItem value="letter">
                          <div className="flex items-center">
                            <Send className="h-4 w-4 mr-2" />
                            Letter/Post
                          </div>
                        </SelectItem>
                        <SelectItem value="internal-note">
                          Internal Note
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal shadow-none bg-input/40",
                              !communicationDate && "text-muted-foreground"
                            )}
                            disabled={isSubmitting}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {communicationDate
                              ? format(communicationDate, "PPP")
                              : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={communicationDate}
                            onSelect={setCommunicationDate}
                            initialFocus
                            disabled={isSubmitting}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="communicationTime">Time *</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Select
                          value={communicationTime}
                          onValueChange={setCommunicationTime}
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

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        min="1"
                        placeholder="e.g., 15, 30, 60"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status">Status *</Label>
                      <Select
                        disabled={isSubmitting}
                        defaultValue="completed"
                        required
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="scheduled">Scheduled</SelectItem>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="missed">Missed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="follow-up">
                            Follow-up Required
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Participants */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Participants</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="from">From (Sender/Initiator) *</Label>
                      <Select disabled={isSubmitting} required>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select sender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dr-smith">
                            Dr. Sarah Smith
                          </SelectItem>
                          <SelectItem value="nurse-jones">
                            Nurse Emily Jones
                          </SelectItem>
                          <SelectItem value="admin-brown">
                            Admin Michael Brown
                          </SelectItem>
                          <SelectItem value="billing-dept">
                            Billing Department
                          </SelectItem>
                          <SelectItem value="reception">
                            Reception Desk
                          </SelectItem>
                          <SelectItem value="system">
                            Automated System
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="to">To (Recipient) *</Label>
                      <Select disabled={isSubmitting} required>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="patient-john">
                            John Doe (Patient)
                          </SelectItem>
                          <SelectItem value="patient-jane">
                            Jane Smith (Patient)
                          </SelectItem>
                          <SelectItem value="vendor-acme">
                            Acme Medical Supplies
                          </SelectItem>
                          <SelectItem value="insurance-xyz">
                            XYZ Insurance Co.
                          </SelectItem>
                          <SelectItem value="dr-wilson">
                            Dr. Robert Wilson
                          </SelectItem>
                          <SelectItem value="staff-team">Staff Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cc">CC (Carbon Copy)</Label>
                    <Input
                      id="cc"
                      placeholder="Additional recipients (comma separated)"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bcc">BCC (Blind Carbon Copy)</Label>
                    <Input
                      id="bcc"
                      placeholder="Hidden recipients (comma separated)"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Subject & Content */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Subject & Content</h3>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject/Title *</Label>
                    <Input
                      id="subject"
                      placeholder="Enter subject or title of communication"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content/Message *</Label>
                    <Textarea
                      id="content"
                      placeholder="Enter the communication content..."
                      rows={6}
                      required
                      disabled={isSubmitting}
                      className="min-h-[150px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary/Key Points</Label>
                    <Textarea
                      id="summary"
                      placeholder="Brief summary or key points discussed"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Attachments */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Attachments</h3>

                  <div className="space-y-2">
                    <Label>Upload Files</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Paperclip className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Drag & drop files here or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PDF, DOC, JPG, PNG up to 10MB each
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isSubmitting}
                            onClick={() =>
                              document.getElementById("file-upload")?.click()
                            }
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Choose Files
                          </Button>
                          <input
                            id="file-upload"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleAttachmentUpload}
                            disabled={isSubmitting}
                          />
                          {attachments.length > 0 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setAttachments([])}
                              disabled={isSubmitting}
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {attachments.length > 0 && (
                    <div className="space-y-2">
                      <Label>Attached Files ({attachments.length})</Label>
                      <div className="space-y-2">
                        {attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <Paperclip className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{attachment}</span>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              disabled={isSubmitting}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Communication Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Communication Settings
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isFollowUpRequired">
                          Follow-up Required
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Mark if this communication requires follow-up action
                        </p>
                      </div>
                      <Switch
                        id="isFollowUpRequired"
                        checked={isFollowUpRequired}
                        onCheckedChange={setIsFollowUpRequired}
                        disabled={isSubmitting}
                      />
                    </div>

                    {isFollowUpRequired && (
                      <div className="p-4 border rounded-lg space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="followUpDate">Follow-up Date</Label>
                            <Input
                              id="followUpDate"
                              type="date"
                              disabled={isSubmitting}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="followUpAssignee">
                              Follow-up Assignee
                            </Label>
                            <Select disabled={isSubmitting}>
                              <SelectTrigger className="min-w-full">
                                <SelectValue placeholder="Assign to..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dr-smith">
                                  Dr. Sarah Smith
                                </SelectItem>
                                <SelectItem value="nurse-jones">
                                  Nurse Emily Jones
                                </SelectItem>
                                <SelectItem value="admin-brown">
                                  Admin Michael Brown
                                </SelectItem>
                                <SelectItem value="same-person">
                                  Same Person
                                </SelectItem>
                                <SelectItem value="team">Team</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="followUpNotes">Follow-up Notes</Label>
                          <Textarea
                            id="followUpNotes"
                            placeholder="Notes for follow-up action"
                            rows={2}
                            disabled={isSubmitting}
                          />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Select
                        value={priority}
                        onValueChange={setPriority}
                        disabled={isSubmitting}
                        required
                      >
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              Low Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="normal">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                              Normal Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="high">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                              High Priority
                            </div>
                          </SelectItem>
                          <SelectItem value="urgent">
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              Urgent
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="e.g., billing, appointment, urgent, confidential"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select disabled={isSubmitting}>
                          <SelectTrigger className="min-w-full">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appointment">
                              Appointment Related
                            </SelectItem>
                            <SelectItem value="billing">
                              Billing & Payment
                            </SelectItem>
                            <SelectItem value="medical">
                              Medical Information
                            </SelectItem>
                            <SelectItem value="follow-up">
                              Follow-up Care
                            </SelectItem>
                            <SelectItem value="administrative">
                              Administrative
                            </SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="relatedTo">Related To</Label>
                        <Select disabled={isSubmitting}>
                          <SelectTrigger className="min-w-full">
                            <SelectValue placeholder="Select related item" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appointment-123">
                              Appointment #123
                            </SelectItem>
                            <SelectItem value="invoice-456">
                              Invoice #456
                            </SelectItem>
                            <SelectItem value="patient-789">
                              Patient Record
                            </SelectItem>
                            <SelectItem value="prescription">
                              Prescription
                            </SelectItem>
                            <SelectItem value="test-result">
                              Test Results
                            </SelectItem>
                            <SelectItem value="supply-order">
                              Supply Order
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery & Tracking */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Delivery & Tracking</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryMethod">Delivery Method</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email-client">
                            Email Client
                          </SelectItem>
                          <SelectItem value="sms-gateway">
                            SMS Gateway
                          </SelectItem>
                          <SelectItem value="phone-system">
                            Phone System
                          </SelectItem>
                          <SelectItem value="postal-service">
                            Postal Service
                          </SelectItem>
                          <SelectItem value="in-person">
                            In-Person Delivery
                          </SelectItem>
                          <SelectItem value="system">
                            System Generated
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="trackingId">Tracking/Reference ID</Label>
                      <Input
                        id="trackingId"
                        placeholder="e.g., TRK-123456, MSG-789012"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryStatus">Delivery Status</Label>
                    <Select disabled={isSubmitting}>
                      <SelectTrigger className="min-w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sent">Sent</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="read">Read/Opened</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deliveryNotes">Delivery Notes</Label>
                    <Textarea
                      id="deliveryNotes"
                      placeholder="Notes about delivery or any issues encountered"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Confidentiality & Security */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Confidentiality & Security
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="isConfidential">Confidential</Label>
                        <p className="text-sm text-muted-foreground">
                          Mark as confidential (requires special access)
                        </p>
                      </div>
                      <Switch id="isConfidential" disabled={isSubmitting} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requiresSignature">
                          Requires Signature
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          This communication requires recipient signature
                        </p>
                      </div>
                      <Switch id="requiresSignature" disabled={isSubmitting} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="securityLevel">Security Level</Label>
                      <Select disabled={isSubmitting} defaultValue="standard">
                        <SelectTrigger className="min-w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="internal">Internal Use</SelectItem>
                          <SelectItem value="confidential">
                            Confidential
                          </SelectItem>
                          <SelectItem value="restricted">Restricted</SelectItem>
                          <SelectItem value="hipaa">HIPAA Protected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="retentionPeriod">Retention Period</Label>
                      <Select disabled={isSubmitting}>
                        <SelectTrigger className="min-w-full">
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30-days">30 Days</SelectItem>
                          <SelectItem value="90-days">90 Days</SelectItem>
                          <SelectItem value="1-year">1 Year</SelectItem>
                          <SelectItem value="3-years">3 Years</SelectItem>
                          <SelectItem value="7-years">
                            7 Years (Legal)
                          </SelectItem>
                          <SelectItem value="10-years">
                            10 Years (Medical)
                          </SelectItem>
                          <SelectItem value="permanent">Permanent</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Additional Information
                  </h3>

                  <div className="space-y-2">
                    <Label htmlFor="internalNotes">Internal Notes</Label>
                    <Textarea
                      id="internalNotes"
                      placeholder="Internal notes for staff only"
                      rows={3}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="outcome">Outcome/Result</Label>
                    <Textarea
                      id="outcome"
                      placeholder="Result or outcome of this communication"
                      rows={2}
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nextSteps">Next Steps</Label>
                    <Textarea
                      id="nextSteps"
                      placeholder="Next steps or action items"
                      rows={2}
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
                form="communication-form"
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 flex flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding Communication..." : "Add Communication"}
              </Button>
            </div>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}

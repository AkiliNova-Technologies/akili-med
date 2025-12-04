"use client";

import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DataTable,
  type TableData,
  type TableField,
  type TableAction,
} from "@/components/data-table";
import { SectionCards, type CardData } from "@/components/section-cards";
import {
  Users,
  Calendar,
  Stethoscope,
  Clock,
  DollarSign,
  AlertCircle,
  Eye,
  Edit,
  Download,
  Bed,
  Clipboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Recent Appointments Data
interface Appointment extends TableData {
  id: number;
  patient: string;
  doctor: string;
  type: string;
  time: string;
  status: "Scheduled" | "Completed" | "Cancelled" | "In Progress";
  room: string;
}

const recentAppointments: Appointment[] = [
  {
    id: 1,
    patient: "John Doe",
    doctor: "Dr. Sarah Smith",
    type: "Consultation",
    time: "09:00 AM",
    status: "Scheduled",
    room: "Room 101",
  },
  {
    id: 2,
    patient: "Jane Smith",
    doctor: "Dr. Michael Johnson",
    type: "Follow-up",
    time: "10:15 AM",
    status: "Completed",
    room: "Room 102",
  },
  {
    id: 3,
    patient: "Robert Johnson",
    doctor: "Dr. Emily Williams",
    type: "Emergency",
    time: "11:30 AM",
    status: "In Progress",
    room: "ER",
  },
  {
    id: 4,
    patient: "Sarah Williams",
    doctor: "Dr. David Brown",
    type: "Lab Test",
    time: "02:00 PM",
    status: "Scheduled",
    room: "Lab",
  },
  {
    id: 5,
    patient: "Michael Brown",
    doctor: "Dr. Jennifer Taylor",
    type: "Therapy",
    time: "03:45 PM",
    status: "Scheduled",
    room: "Room 201",
  },
  {
    id: 6,
    patient: "Emma Wilson",
    doctor: "Dr. Sarah Smith",
    type: "Checkup",
    time: "04:30 PM",
    status: "Cancelled",
    room: "Room 103",
  },
];

const appointmentFields: TableField<Appointment>[] = [
  { key: "patient", header: "Patient", enableSorting: true },
  { key: "doctor", header: "Doctor", enableSorting: true },
  { key: "type", header: "Type", enableSorting: true },
  { key: "time", header: "Time", enableSorting: true },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as string;

      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            status === "Completed"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
              : status === "Cancelled"
              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
              : status === "In Progress"
              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  { key: "room", header: "Room", enableSorting: true },
];

const appointmentActions: TableAction<Appointment>[] = [
  {
    type: "view",
    onClick: (row) => console.log("View", row),
    icon: <Eye className="size-4" />,
  },
  {
    type: "edit",
    onClick: (row) => console.log("Edit", row),
    icon: <Edit className="size-4" />,
  },
];

// Recent Patients Data
interface Patient extends TableData {
  id: number;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  condition: string;
  status: "Active" | "Inactive" | "Critical";
}

const recentPatients: Patient[] = [
  {
    id: 1,
    name: "John Doe",
    age: 45,
    gender: "Male",
    lastVisit: "2024-01-15",
    condition: "Hypertension",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    gender: "Female",
    lastVisit: "2024-01-14",
    condition: "Diabetes",
    status: "Active",
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 68,
    gender: "Male",
    lastVisit: "2024-01-13",
    condition: "Heart Disease",
    status: "Critical",
  },
  {
    id: 4,
    name: "Sarah Williams",
    age: 28,
    gender: "Female",
    lastVisit: "2024-01-12",
    condition: "Asthma",
    status: "Active",
  },
  {
    id: 5,
    name: "Michael Brown",
    age: 52,
    gender: "Male",
    lastVisit: "2024-01-10",
    condition: "Arthritis",
    status: "Inactive",
  },
];

const patientFields: TableField<Patient>[] = [
  { key: "name", header: "Patient Name", enableSorting: true },
  { key: "age", header: "Age", enableSorting: true },
  { key: "gender", header: "Gender", enableSorting: true },
  {
    key: "lastVisit",
    header: "Last Visit",
    cell: (value) => new Date(value as string).toLocaleDateString(),
  },
  { key: "condition", header: "Condition", enableSorting: true },
  {
    key: "status",
    header: "Status",
    cell: (value) => {
      const status = value as string;
      let color = "";
      if (status === "Active") color = "text-green-600";
      else if (status === "Critical") color = "text-red-600";
      else color = "text-gray-600";

      return <span className={`font-medium ${color}`}>{status}</span>;
    },
  },
];

// Statistics Cards Data
const statCards: CardData[] = [
  {
    title: "Total Patients",
    value: "1,284",
    change: { value: "12%", trend: "up", description: "From last month" },
    icon: <Users className="size-4" />,
    iconBgColor: "bg-blue-400 dark:bg-blue-900",
  },
  {
    title: "Today's Appointments",
    value: "24",
    change: { value: "2", trend: "down", description: "From yesterday" },
    icon: <Calendar className="size-4" />,
    iconBgColor: "bg-green-400 dark:bg-green-900",
  },
  {
    title: "Available Doctors",
    value: "18",
    change: { value: "3", trend: "up", description: "Currently available" },
    icon: <Stethoscope className="size-4" />,
    iconBgColor: "bg-purple-400 dark:bg-purple-900",
  },
  {
    title: "Monthly Revenue",
    value: "$42,580",
    change: { value: "8.2%", trend: "up", description: "From last month" },
    icon: <DollarSign className="size-4" />,
    iconBgColor: "bg-amber-400 dark:bg-amber-900",
  },
  {
    title: "Occupancy Rate",
    value: "78%",
    change: { value: "5%", trend: "up", description: "Hospital beds" },
    icon: <Bed className="size-4" />,
    iconBgColor: "bg-red-400 dark:bg-red-900",
  },
  {
    title: "Avg. Wait Time",
    value: "15m",
    change: { value: "3m", trend: "down", description: "From last week" },
    icon: <Clock className="size-4" />,
    iconBgColor: "bg-indigo-400 dark:bg-indigo-900",
  },
];

// Alerts Data
const alerts = [
  {
    id: 1,
    type: "critical",
    message: "Patient #103 requires immediate attention",
    time: "5 min ago",
  },
  {
    id: 2,
    type: "warning",
    message: "Low stock alert: Paracetamol running low",
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "info",
    message: "Dr. Smith's shift starts in 30 minutes",
    time: "2 hours ago",
  },
  {
    id: 4,
    type: "success",
    message: "Monthly revenue target achieved",
    time: "1 day ago",
  },
];

export default function DashboardPage() {
  return (
    <>
      <SiteHeader />
      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Medical Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Here's what's happening at your clinic today.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Overview</h2>
            </div>
            <SectionCards cards={statCards} layout="2x3" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Appointments & Quick Actions */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Appointments */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="mb-3">
                        Today's Appointments
                      </CardTitle>
                      <CardDescription>
                        {new Date().toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="-mt-6">
                  <DataTable
                    data={recentAppointments}
                    fields={appointmentFields}
                    actions={appointmentActions}
                    enableSelection={false}
                    enablePagination={false}
                  />
                </CardContent>
              </Card>

              {/* Recent Patients */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="mb-3">Recent Patients</CardTitle>
                      <CardDescription>
                        Patients added in the last 7 days
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="-mt-6">
                  <DataTable
                    data={recentPatients}
                    fields={patientFields}
                    enableSelection={false}
                    enablePagination={false}
                    onRowClick={(row) => console.log("View patient", row)}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Health Metrics, Alerts, Quick Actions */}
            <div className="space-y-6">
              {/* System Alerts */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="size-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="flex items-start gap-3 p-3 rounded-lg border"
                    >
                      <div
                        className={`mt-1 size-2 rounded-full ${
                          alert.type === "critical"
                            ? "bg-red-500"
                            : alert.type === "warning"
                            ? "bg-yellow-500"
                            : alert.type === "info"
                            ? "bg-blue-500"
                            : "bg-green-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Upcoming Events */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <CardTitle>Upcoming Events</CardTitle>
                  <CardDescription>
                    Meetings and important dates
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div>
                      <p className="font-medium">Staff Meeting</p>
                      <p className="text-sm text-muted-foreground">
                        Tomorrow, 10:00 AM
                      </p>
                    </div>
                    <Clock className="size-4 text-blue-500" />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div>
                      <p className="font-medium">Medical Supplies Delivery</p>
                      <p className="text-sm text-muted-foreground">
                        Jan 18, 2:00 PM
                      </p>
                    </div>
                    <Clipboard className="size-4 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Bottom Row - Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Doctor Availability */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle>Doctor Availability</CardTitle>
                <CardDescription>Current shift status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    "Dr. Sarah Smith",
                    "Dr. Michael Johnson",
                    "Dr. Emily Williams",
                  ].map((doctor, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          <Stethoscope className="size-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <div>
                          <p className="font-medium">{doctor}</p>
                          <p className="text-sm text-muted-foreground">
                            General Physician
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                      >
                        Available
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Room Utilization */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle>Room Utilization</CardTitle>
                <CardDescription>Current usage status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      room: "Room 101",
                      status: "Occupied",
                      patient: "John Doe",
                    },
                    { room: "Room 102", status: "Available", patient: "" },
                    { room: "Room 201", status: "Cleaning", patient: "" },
                    { room: "ER", status: "Occupied", patient: "Emergency" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-8 rounded-full flex items-center justify-center ${
                            item.status === "Occupied"
                              ? "bg-red-100 dark:bg-red-900"
                              : item.status === "Available"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-yellow-100 dark:bg-yellow-900"
                          }`}
                        >
                          <Bed
                            className={`size-4 ${
                              item.status === "Occupied"
                                ? "text-red-600 dark:text-red-300"
                                : item.status === "Available"
                                ? "text-green-600 dark:text-green-300"
                                : "text-yellow-600 dark:text-yellow-300"
                            }`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{item.room}</p>
                          {item.patient && (
                            <p className="text-sm text-muted-foreground">
                              {item.patient}
                            </p>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "Occupied"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : item.status === "Available"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        }
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="shadow-none border-none">
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Clinic performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Patient Satisfaction
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      94%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: "94%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Appointment Adherence
                    </span>
                    <span className="text-sm font-bold text-blue-600">88%</span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500"
                      style={{ width: "88%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Treatment Success Rate
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      91%
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500"
                      style={{ width: "91%" }}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">
                      Average Wait Time
                    </span>
                    <span className="text-sm font-bold text-amber-600">
                      15m
                    </span>
                  </div>
                  <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: "60%" }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

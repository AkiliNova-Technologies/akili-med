// app/reports/page.tsx
"use client";

import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Download,
  FileText,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  Printer,
  Share2,
  Stethoscope,
  Pill,
  Bed,
  Clock,
  AlertCircle,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DataTable,
  type TableData,
  type TableField,
} from "@/components/data-table";
import { SectionCards, type CardData } from "@/components/section-cards";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Revenue Report Data
interface RevenueReport extends TableData {
  id: number;
  month: string;
  appointments: number;
  consultations: number;
  procedures: number;
  labTests: number;
  pharmacy: number;
  total: number;
  growth: number;
}

const revenueData: RevenueReport[] = [
  {
    id: 1,
    month: "Jan 2024",
    appointments: 12480,
    consultations: 18500,
    procedures: 32500,
    labTests: 8500,
    pharmacy: 21500,
    total: 93480,
    growth: 12.5,
  },
  {
    id: 2,
    month: "Feb 2024",
    appointments: 13250,
    consultations: 19200,
    procedures: 34100,
    labTests: 9200,
    pharmacy: 22800,
    total: 98550,
    growth: 8.3,
  },
  {
    id: 3,
    month: "Mar 2024",
    appointments: 12890,
    consultations: 18800,
    procedures: 33800,
    labTests: 8900,
    pharmacy: 22100,
    total: 96490,
    growth: 5.2,
  },
  {
    id: 4,
    month: "Apr 2024",
    appointments: 14100,
    consultations: 21000,
    procedures: 36500,
    labTests: 9800,
    pharmacy: 24500,
    total: 105900,
    growth: 15.8,
  },
  {
    id: 5,
    month: "May 2024",
    appointments: 13980,
    consultations: 20500,
    procedures: 35800,
    labTests: 9600,
    pharmacy: 23800,
    total: 103680,
    growth: 13.2,
  },
  {
    id: 6,
    month: "Jun 2024",
    appointments: 14520,
    consultations: 21500,
    procedures: 37200,
    labTests: 10200,
    pharmacy: 25200,
    total: 108620,
    growth: 18.5,
  },
];

const revenueFields: TableField<RevenueReport>[] = [
  { key: "month", header: "Month", enableSorting: true },
  {
    key: "appointments",
    header: "Appointments",
    enableSorting: true,
    cell: (value) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "consultations",
    header: "Consultations",
    enableSorting: true,
    cell: (value) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "procedures",
    header: "Procedures",
    enableSorting: true,
    cell: (value) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "labTests",
    header: "Lab Tests",
    enableSorting: true,
    cell: (value) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "pharmacy",
    header: "Pharmacy",
    enableSorting: true,
    cell: (value) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "total",
    header: "Total Revenue",
    enableSorting: true,
    cell: (value) => (
      <span className="font-bold">${(value as number).toLocaleString()}</span>
    ),
  },
  {
    key: "growth",
    header: "Growth %",
    enableSorting: true,
    cell: (value) => {
      const growth = value as number;
      return (
        <div
          className={`flex items-center gap-1 ${
            growth >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {growth >= 0 ? (
            <TrendingUp className="size-4" />
          ) : (
            <TrendingDown className="size-4" />
          )}
          <span>{Math.abs(growth)}%</span>
        </div>
      );
    },
  },
];

// Patient Demographics Data
interface PatientDemographic extends TableData {
  id: number;
  ageGroup: string;
  count: number;
  percentage: number;
  avgVisits: number;
  avgSpending: number;
}

const demographicData: PatientDemographic[] = [
  {
    id: 1,
    ageGroup: "0-18",
    count: 245,
    percentage: 18,
    avgVisits: 2.3,
    avgSpending: 120,
  },
  {
    id: 2,
    ageGroup: "19-30",
    count: 312,
    percentage: 24,
    avgVisits: 1.8,
    avgSpending: 85,
  },
  {
    id: 3,
    ageGroup: "31-45",
    count: 398,
    percentage: 31,
    avgVisits: 3.2,
    avgSpending: 210,
  },
  {
    id: 4,
    ageGroup: "46-60",
    count: 275,
    percentage: 21,
    avgVisits: 4.5,
    avgSpending: 350,
  },
  {
    id: 5,
    ageGroup: "61+",
    count: 150,
    percentage: 12,
    avgVisits: 6.2,
    avgSpending: 520,
  },
];

// Doctor Performance Data
interface DoctorPerformance extends TableData {
  id: number;
  doctor: string;
  specialization: string;
  patients: number;
  revenue: number;
  satisfaction: number;
  avgWaitTime: string;
  efficiency: number;
}

const doctorPerformanceData: DoctorPerformance[] = [
  {
    id: 1,
    doctor: "Dr. Sarah Smith",
    specialization: "General Physician",
    patients: 328,
    revenue: 45800,
    satisfaction: 96,
    avgWaitTime: "12m",
    efficiency: 92,
  },
  {
    id: 2,
    doctor: "Dr. Michael Johnson",
    specialization: "Cardiologist",
    patients: 285,
    revenue: 68200,
    satisfaction: 94,
    avgWaitTime: "18m",
    efficiency: 88,
  },
  {
    id: 3,
    doctor: "Dr. Emily Williams",
    specialization: "Pediatrician",
    patients: 412,
    revenue: 52100,
    satisfaction: 98,
    avgWaitTime: "10m",
    efficiency: 95,
  },
  {
    id: 4,
    doctor: "Dr. David Brown",
    specialization: "Dermatologist",
    patients: 198,
    revenue: 38500,
    satisfaction: 91,
    avgWaitTime: "15m",
    efficiency: 86,
  },
  {
    id: 5,
    doctor: "Dr. Jennifer Taylor",
    specialization: "Neurologist",
    patients: 156,
    revenue: 62500,
    satisfaction: 93,
    avgWaitTime: "22m",
    efficiency: 84,
  },
];

const doctorPerformanceFields: TableField<DoctorPerformance>[] = [
  { key: "doctor", header: "Doctor", enableSorting: true },
  { key: "specialization", header: "Specialization", enableSorting: true },
  { key: "patients", header: "Patients", enableSorting: true },
  {
    key: "revenue",
    header: "Revenue",
    enableSorting: true,
    cell: (value) => `$${(value as number).toLocaleString()}`,
  },
  {
    key: "satisfaction",
    header: "Satisfaction",
    enableSorting: true,
    cell: (value) => {
      const satisfaction = value as number;
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium">{satisfaction}%</span>
          <div className="h-2 flex-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500"
              style={{ width: `${satisfaction}%` }}
            />
          </div>
        </div>
      );
    },
  },
  { key: "avgWaitTime", header: "Avg Wait", enableSorting: true },
  {
    key: "efficiency",
    header: "Efficiency",
    enableSorting: true,
    cell: (value) => {
      const eff = value as number;
      let color = "text-green-600";
      if (eff < 85) color = "text-red-600";
      else if (eff < 90) color = "text-yellow-600";

      return (
        <div className="flex items-center gap-1">
          <div
            className={`h-2 w-12 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden`}
          >
            <div
              className={`h-full ${
                eff >= 90
                  ? "bg-green-500"
                  : eff >= 85
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${eff}%` }}
            />
          </div>
          <span className={`font-medium ${color}`}>{eff}%</span>
        </div>
      );
    },
  },
];

// Appointments Analytics Data
interface AppointmentAnalytic extends TableData {
  id: number;
  date: string;
  scheduled: number;
  completed: number;
  cancelled: number;
  noShows: number;
  completionRate: number;
}

const appointmentAnalyticsData: AppointmentAnalytic[] = [
  {
    id: 1,
    date: "Mon, Jan 1",
    scheduled: 42,
    completed: 38,
    cancelled: 2,
    noShows: 2,
    completionRate: 90.5,
  },
  {
    id: 2,
    date: "Tue, Jan 2",
    scheduled: 45,
    completed: 41,
    cancelled: 1,
    noShows: 3,
    completionRate: 91.1,
  },
  {
    id: 3,
    date: "Wed, Jan 3",
    scheduled: 48,
    completed: 44,
    cancelled: 2,
    noShows: 2,
    completionRate: 91.7,
  },
  {
    id: 4,
    date: "Thu, Jan 4",
    scheduled: 38,
    completed: 35,
    cancelled: 1,
    noShows: 2,
    completionRate: 92.1,
  },
  {
    id: 5,
    date: "Fri, Jan 5",
    scheduled: 52,
    completed: 47,
    cancelled: 3,
    noShows: 2,
    completionRate: 90.4,
  },
];

// Report Summary Cards
const reportSummaryCards: CardData[] = [
  {
    title: "Total Revenue",
    value: "$632,420",
    change: { value: "15.2%", trend: "up", description: "From last quarter" },
    icon: <DollarSign className="size-4" />,
    iconBgColor: "bg-green-400 dark:bg-green-900",
  },
  {
    title: "Active Patients",
    value: "1,284",
    change: { value: "8.5%", trend: "up", description: "From last month" },
    icon: <Users className="size-4" />,
    iconBgColor: "bg-blue-400 dark:bg-blue-900",
  },
  {
    title: "Appointments",
    value: "4,823",
    change: { value: "12.3%", trend: "up", description: "From last quarter" },
    icon: <Calendar className="size-4" />,
    iconBgColor: "bg-purple-400 dark:bg-purple-900",
  },
  {
    title: "Avg Satisfaction",
    value: "94.2%",
    change: { value: "2.1%", trend: "up", description: "From last month" },
    icon: <Activity className="size-4" />,
    iconBgColor: "bg-amber-400 dark:bg-amber-900",
  },
];

// Available Reports
const availableReports = [
  {
    id: 1,
    name: "Monthly Revenue Report",
    type: "Finance",
    period: "Monthly",
    icon: <DollarSign className="size-4" />,
  },
  {
    id: 2,
    name: "Patient Demographics",
    type: "Analytics",
    period: "Quarterly",
    icon: <Users className="size-4" />,
  },
  {
    id: 3,
    name: "Doctor Performance",
    type: "Performance",
    period: "Monthly",
    icon: <Stethoscope className="size-4" />,
  },
  {
    id: 4,
    name: "Appointment Analytics",
    type: "Operations",
    period: "Weekly",
    icon: <Calendar className="size-4" />,
  },
  {
    id: 5,
    name: "Medication Usage",
    type: "Inventory",
    period: "Monthly",
    icon: <Pill className="size-4" />,
  },
  {
    id: 6,
    name: "Bed Occupancy Rate",
    type: "Operations",
    period: "Daily",
    icon: <Bed className="size-4" />,
  },
  {
    id: 7,
    name: "Wait Time Analysis",
    type: "Analytics",
    period: "Weekly",
    icon: <Clock className="size-4" />,
  },
  {
    id: 8,
    name: "Incident Reports",
    type: "Compliance",
    period: "Monthly",
    icon: <AlertCircle className="size-4" />,
  },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState("all");
  const [timePeriod, setTimePeriod] = useState("last-month");

  const handleExport = (format: string, reportName?: string) => {
    console.log(`Exporting ${reportName || "report"} as ${format}`);
    // In a real app, this would trigger the actual export
    alert(`Exporting ${reportName || "report"} as ${format.toUpperCase()}`);
  };

  const generateReport = () => {
    console.log("Generating report with filters:", { reportType, timePeriod });
    // In a real app, this would fetch/regenerate the report
    alert("Generating report with current filters...");
  };

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground mt-2">
                Generate, view, and export comprehensive reports for your clinic
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <Printer className="size-4" />
                Print
              </Button>
              <Button
                className="bg-[#e11d48] hover:bg-[#e11d48]/90 gap-2 text-white"
                onClick={generateReport}
              >
                <FileText className="size-4" />
                Generate Report
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Summary Overview</h2>
            <SectionCards cards={reportSummaryCards} layout="1x4" />
          </div>

          {/* Filters and Controls */}
          <Card className="shadow-none border-none">
            <CardHeader>
              <CardTitle>Report Filters</CardTitle>
              <CardDescription>
                Customize your report parameters
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="finance">Financial Reports</SelectItem>
                      <SelectItem value="clinical">Clinical Reports</SelectItem>
                      <SelectItem value="operational">
                        Operational Reports
                      </SelectItem>
                      <SelectItem value="compliance">
                        Compliance Reports
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Time Period</Label>
                  <Select value={timePeriod} onValueChange={setTimePeriod}>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last-week">Last Week</SelectItem>
                      <SelectItem value="last-month">Last Month</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="excel">Excel</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Actions</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => generateReport()}
                    >
                      <Filter className="size-4 mr-2" />
                      Apply Filters
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setReportType("all");
                        setTimePeriod("last-month");
                      }}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Tabs */}
          <Tabs defaultValue="revenue" className="space-y-4">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
              <TabsTrigger value="revenue" className="gap-2">
                <DollarSign className="size-4" />
                Revenue
              </TabsTrigger>
              <TabsTrigger value="patients" className="gap-2">
                <Users className="size-4" />
                Patients
              </TabsTrigger>
              <TabsTrigger value="doctors" className="gap-2">
                <Stethoscope className="size-4" />
                Doctors
              </TabsTrigger>
              <TabsTrigger value="appointments" className="gap-2">
                <Calendar className="size-4" />
                Appointments
              </TabsTrigger>
              <TabsTrigger value="inventory" className="gap-2">
                <Pill className="size-4" />
                Inventory
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2">
                <FileText className="size-4" />
                All Reports
              </TabsTrigger>
            </TabsList>

            {/* Revenue Report */}
            <TabsContent value="revenue" className="space-y-4">
              <Card className="shadow-none border-none rounded-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="mb-3">Revenue Report</CardTitle>
                      <CardDescription>
                        Monthly revenue breakdown by service category
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="size-4" />
                        Share
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => handleExport("pdf", "Revenue Report")}
                      >
                        <Download className="size-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="-mt-6">
                  <DataTable
                    data={revenueData}
                    fields={revenueFields}
                    enableSelection={false}
                    enablePagination={false}
                  />
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  <div className="w-full">
                    <h4 className="font-semibold mb-2">Revenue Distribution</h4>
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: "25%" }}
                        title="Appointments: 25%"
                      />
                      <div
                        className="h-full bg-green-500"
                        style={{ width: "30%" }}
                        title="Consultations: 30%"
                      />
                      <div
                        className="h-full bg-purple-500"
                        style={{ width: "35%" }}
                        title="Procedures: 35%"
                      />
                      <div
                        className="h-full bg-amber-500"
                        style={{ width: "10%" }}
                        title="Other: 10%"
                      />
                    </div>
                    <div className="flex flex-wrap gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-blue-500" />
                        <span className="text-sm">Appointments (25%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-green-500" />
                        <span className="text-sm">Consultations (30%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="size-3 rounded-full bg-purple-500" />
                        <span className="text-sm">Procedures (35%)</span>
                      </div>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Doctor Performance Report */}
            <TabsContent value="doctors" className="space-y-4">
              <Card className="shadow-none border-none rounded-sm">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <CardTitle className="mb-3">Doctor Performance Report</CardTitle>
                      <CardDescription>
                        Performance metrics for medical staff
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() =>
                          handleExport("excel", "Doctor Performance")
                        }
                      >
                        <Download className="size-4" />
                        Export Excel
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="-mt-6">
                  <DataTable
                    data={doctorPerformanceData}
                    fields={doctorPerformanceFields}
                    enableSelection={false}
                    enablePagination={false}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            {/* All Reports */}
            <TabsContent value="all" className="space-y-4">
              <Card className="shadow-none border-none rounded-sm">
                <CardHeader>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>
                    Browse and access all available report types
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {availableReports.map((report) => (
                      <Card
                        key={report.id}
                        className="hover:shadow-md transition-shadow shadow-none"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div
                              className={`p-2 rounded-lg ${
                                report.type === "Finance"
                                  ? "bg-green-100 dark:bg-green-900"
                                  : report.type === "Analytics"
                                  ? "bg-blue-100 dark:bg-blue-900"
                                  : report.type === "Performance"
                                  ? "bg-purple-100 dark:bg-purple-900"
                                  : "bg-amber-100 dark:bg-amber-900"
                              }`}
                            >
                              {report.icon}
                            </div>
                            <Badge variant="outline">{report.period}</Badge>
                          </div>
                          <CardTitle className="text-lg mt-4">
                            {report.name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {report.type} Report
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <div className="flex gap-2 w-full">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleExport("pdf", report.name)}
                            >
                              <Eye className="size-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                              onClick={() => handleExport("excel", report.name)}
                            >
                              <Download className="size-4 mr-1" />
                              Export
                            </Button>
                          </div>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Quick Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Demographics */}
            <Card className="shadow-none border-none rounded-sm">
              <CardHeader>
                <CardTitle>Patient Demographics</CardTitle>
                <CardDescription>Age distribution analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {demographicData.map((demo) => (
                    <div key={demo.id} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          {demo.ageGroup} years
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {demo.count} patients ({demo.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500"
                          style={{ width: `${demo.percentage}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Avg visits: {demo.avgVisits}</span>
                        <span>Avg spending: ${demo.avgSpending}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleExport("csv", "Patient Demographics")}
                >
                  <Download className="size-4 mr-2" />
                  Export Demographic Data
                </Button>
              </CardFooter>
            </Card>

            {/* Appointment Analytics */}
            <Card className="shadow-none border-none rounded-sm">
              <CardHeader>
                <CardTitle>Appointment Analytics</CardTitle>
                <CardDescription>Daily appointment tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-green-600">
                        90.8%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Completion Rate
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-blue-600">
                        2.1%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Cancellation Rate
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-red-600">
                        4.3%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        No-Show Rate
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-purple-600">
                        15.2m
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Avg Wait Time
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {appointmentAnalyticsData.map((day) => (
                      <div key={day.id} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{day.date}</span>
                          <span className="text-sm font-bold">
                            {day.completionRate}%
                          </span>
                        </div>
                        <div className="flex h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-green-500"
                            style={{
                              width: `${
                                (day.completed / day.scheduled) * 100
                              }%`,
                            }}
                          />
                          <div
                            className="bg-yellow-500"
                            style={{
                              width: `${
                                (day.cancelled / day.scheduled) * 100
                              }%`,
                            }}
                          />
                          <div
                            className="bg-red-500"
                            style={{
                              width: `${(day.noShows / day.scheduled) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Report Generation */}
            <Card className="shadow-none border-none rounded-sm">
              <CardHeader>
                <CardTitle>Generate Custom Report</CardTitle>
                <CardDescription>Create a new custom report</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-name">Report Name</Label>
                  <Input id="report-name" placeholder="Enter report name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select>
                    <SelectTrigger className="min-w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">
                        Financial Analysis
                      </SelectItem>
                      <SelectItem value="clinical">
                        Clinical Statistics
                      </SelectItem>
                      <SelectItem value="operational">
                        Operational Metrics
                      </SelectItem>
                      <SelectItem value="compliance">
                        Compliance Report
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metrics">Select Metrics</Label>
                  <div className="space-y-2">
                    {[
                      "Revenue",
                      "Patients",
                      "Appointments",
                      "Medications",
                      "Doctors",
                      "Rooms",
                    ].map((metric) => (
                      <div key={metric} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`metric-${metric}`}
                          className="rounded"
                        />
                        <Label
                          htmlFor={`metric-${metric}`}
                          className="cursor-pointer"
                        >
                          {metric}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Input type="date" placeholder="Start date" />
                    <Input type="date" placeholder="End date" />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={generateReport}>
                  <FileText className="size-4 mr-2" />
                  Generate Custom Report
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}

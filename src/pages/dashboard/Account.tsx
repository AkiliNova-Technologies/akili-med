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
import { Textarea } from "@/components/ui/textarea";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  Eye,
  EyeOff,
  Save,
  Edit2,
  Camera,
  CheckCircle,
  XCircle,
  Bell,
  Lock,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import type { TableData } from "@/components/data-table";
import { cn } from "@/lib/utils";

// Current User Data (simulating logged-in user)
const currentUser = {
  name: "Dr. Sarah Smith",
  email: "sarah.smith@clinic.com",
  role: "Senior Physician",
  avatar: "/avatars/sarah.jpg",
  department: "General Medicine",
  phone: "+1 (555) 123-4567",
  address: "123 Medical Center Dr, Suite 201",
  joinDate: "2020-06-15",
  specialization: "Internal Medicine",
  licenseNumber: "MED123456",
  bio: "Senior physician with 10+ years of experience in internal medicine and patient care.",
};

// User Activity Log
interface UserActivity extends TableData {
  id: number;
  timestamp: string;
  action: string;
  details: string;
  ipAddress: string;
}

const userActivities: UserActivity[] = [
  {
    id: 1,
    timestamp: "2024-01-15 09:45:23",
    action: "Login",
    details: "Successful login",
    ipAddress: "192.168.1.100",
  },
  {
    id: 2,
    timestamp: "2024-01-15 09:50:12",
    action: "Patient Record",
    details: "Viewed patient John Doe's record",
    ipAddress: "192.168.1.100",
  },
  {
    id: 3,
    timestamp: "2024-01-15 10:15:30",
    action: "Prescription",
    details: "Created prescription for patient ID 123",
    ipAddress: "192.168.1.100",
  },
  {
    id: 4,
    timestamp: "2024-01-14 16:20:45",
    action: "Appointment",
    details: "Scheduled follow-up appointment",
    ipAddress: "192.168.1.100",
  },
  {
    id: 5,
    timestamp: "2024-01-14 14:35:18",
    action: "Logout",
    details: "Session ended",
    ipAddress: "192.168.1.100",
  },
  {
    id: 6,
    timestamp: "2024-01-13 11:45:22",
    action: "Settings",
    details: "Updated profile information",
    ipAddress: "192.168.1.150",
  },
];

// Role Types
const roleTypes = [
  "Doctor",
  "Nurse",
  "Receptionist",
  "Admin",
  "Lab Technician",
  "Pharmacist",
  "Radiologist",
  "Physiotherapist",
  "Dietitian",
  "Medical Assistant",
];

// Department Types
const departmentTypes = [
  "General Medicine",
  "Cardiology",
  "Emergency",
  "Pediatrics",
  "Orthopedics",
  "Neurology",
  "Dermatology",
  "Oncology",
  "Laboratory",
  "Pharmacy",
  "Radiology",
  "Administration",
];

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    appointmentReminders: true,
    newPatientAlerts: true,
    systemUpdates: false,
  });

  const handleSaveProfile = () => {
    console.log("Saving profile changes...");
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
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
                User Account
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage platform user and account settings
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - User Profile */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-30 w-30 border-4 border-background">
                          <AvatarImage
                            src={currentUser.avatar}
                            alt={currentUser.name}
                          />
                          <AvatarFallback className="bg-input text-lg">
                            {currentUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                          <Button
                            size="icon"
                            className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-[#e11d48] hover:bg-[#e11d48]/80 text-white"
                            onClick={() => console.log("Change photo")}
                          >
                            <Camera className="size-4" />
                          </Button>
                        )}
                      </div>
                      <div>
                        <CardTitle className="mb-2">{currentUser.name}</CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Briefcase className="size-4" />
                          {currentUser.role} • {currentUser.department}
                        </CardDescription>
                      </div>
                    </div>
                    <Button
                      variant={isEditing ? "secondary" : "outline"}
                      onClick={() => setIsEditing(!isEditing)}
                      className={cn("gap-2 w-xs", isEditing ? "" : "bg-[#e11d48] hover:bg-[#e11d48]/80 text-white hover:text-white")}
                    >
                      {isEditing ? (
                        <>
                          <XCircle className="size-4" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit2 className="size-4" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="name"
                            defaultValue={currentUser.name}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            defaultValue={currentUser.email}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="phone"
                            defaultValue={currentUser.phone}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                          <Input
                            id="address"
                            defaultValue={currentUser.address}
                            disabled={!isEditing}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Professional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Professional Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select
                          defaultValue={currentUser.role}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="min-w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {roleTypes.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          defaultValue={currentUser.department}
                          disabled={!isEditing}
                        >
                          <SelectTrigger className="min-w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {departmentTypes.map((dept) => (
                              <SelectItem key={dept} value={dept}>
                                {dept}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="license">License Number</Label>
                        <Input
                          id="license"
                          defaultValue={currentUser.licenseNumber}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="specialization">Specialization</Label>
                        <Input
                          id="specialization"
                          defaultValue={currentUser.specialization}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        defaultValue={currentUser.bio}
                        disabled={!isEditing}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Security Section */}
                  {isEditing && (
                    <div className="space-y-4 border-t pt-6">
                      <h3 className="text-lg font-semibold">Security</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="current-password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="pl-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" />
                              ) : (
                                <Eye className="size-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                              id="new-password"
                              type="password"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">
                              Confirm Password
                            </Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              placeholder="Confirm new password"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
                {isEditing && (
                  <CardFooter className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="w-xs"
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSaveProfile} className="gap-2 w-xs bg-[#e11d48] hover:bg-[#e11d48]/80 text-white hover:text-white">
                      <Save className="size-4" />
                      Save Changes
                    </Button>
                  </CardFooter>
                )}
              </Card>

              {/* User Activity Log */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Your platform activity log</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {userActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 rounded-lg border"
                      >
                        <div className="mt-1">
                          {activity.action === "Login" && (
                            <CheckCircle className="size-4 text-green-500" />
                          )}
                          {activity.action === "Logout" && (
                            <XCircle className="size-4 text-gray-500" />
                          )}
                          {activity.action.includes("Patient") && (
                            <User className="size-4 text-blue-500" />
                          )}
                          {activity.action === "Prescription" && (
                            <Briefcase className="size-4 text-purple-500" />
                          )}
                          {activity.action === "Appointment" && (
                            <Calendar className="size-4 text-amber-500" />
                          )}
                          {activity.action === "Settings" && (
                            <Edit2 className="size-4 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <p className="font-medium">{activity.details}</p>
                            <span className="text-xs text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {activity.action}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {activity.ipAddress}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - User Management & Settings */}
            <div className="space-y-6">
              {/* Notification Settings */}
              <Card className="shadow-none border-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="size-5" />
                    Notification Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <Label className="font-medium">
                          {key
                            .split(/(?=[A-Z])/)
                            .map(
                              (word) =>
                                word.charAt(0).toUpperCase() + word.slice(1)
                            )
                            .join(" ")}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {key === "email" && "Receive email notifications"}
                          {key === "push" && "Push notifications on mobile"}
                          {key === "sms" && "SMS text messages"}
                          {key === "appointmentReminders" &&
                            "Appointment reminders"}
                          {key === "newPatientAlerts" &&
                            "New patient registration alerts"}
                          {key === "systemUpdates" &&
                            "System maintenance updates"}
                        </p>
                      </div>
                      <Switch
                        checked={value}
                        onCheckedChange={() =>
                          handleToggleNotification(
                            key as keyof typeof notifications
                          )
                        }
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

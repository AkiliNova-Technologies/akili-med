"use client";

import { useState } from "react";
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
  Shield,
  Activity,
  LogOut,
  Trash2,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TableData } from "@/components/data-table";
import { Separator } from "@/components/ui/separator";

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
  const [activeTab, setActiveTab] = useState("profile");

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    appointmentReminders: true,
    newPatientAlerts: true,
    systemUpdates: false,
  });

  const isMobile = useIsMobile();

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
        <div className="p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4">
            <div>
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                User Account
              </h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                Manage platform user and account settings
              </p>
            </div>
          </div>

          {/* Mobile Tabs */}
          {isMobile && (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 h-auto">
                <TabsTrigger value="profile" className="gap-1 text-xs py-1.5">
                  <User className="h-3 w-3" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="security" className="gap-1 text-xs py-1.5">
                  <Shield className="h-3 w-3" />
                  Security
                </TabsTrigger>
                <TabsTrigger value="activity" className="gap-1 text-xs py-1.5">
                  <Activity className="h-3 w-3" />
                  Activity
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {/* Main Content */}
          {(!isMobile || activeTab === "profile") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Column - User Profile */}
              <div className="lg:col-span-2 space-y-4 md:space-y-6">
                {/* Profile Card */}
                <Card className="shadow-none border-none">
                  <CardHeader className="p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="relative">
                          <Avatar className={cn(
                            "border-4 border-background",
                            isMobile ? "h-16 w-16" : "h-20 w-20 md:h-24 md:w-24"
                          )}>
                            <AvatarImage
                              src={currentUser.avatar}
                              alt={currentUser.name}
                            />
                            <AvatarFallback className="bg-input text-base md:text-lg">
                              {currentUser.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          {isEditing && (
                            <Button
                              size="icon"
                              className="absolute bottom-0 right-0 h-6 w-6 md:h-7 md:w-7 rounded-full bg-[#e11d48] hover:bg-[#e11d48]/80 text-white"
                              onClick={() => console.log("Change photo")}
                            >
                              <Camera className="size-3 md:size-4" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-base md:text-lg lg:text-xl mb-1 md:mb-2">
                            {currentUser.name}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                            <Briefcase className="size-3 md:size-4" />
                            {currentUser.role} • {currentUser.department}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant={isEditing ? "secondary" : "default"}
                        onClick={() => setIsEditing(!isEditing)}
                        className={cn(
                          "gap-1 md:gap-2 mt-3 sm:mt-0",
                          isMobile ? "w-full sm:w-auto text-xs h-8" : "w-auto",
                          !isEditing && "bg-[#e11d48] hover:bg-[#e11d48]/80 text-white"
                        )}
                        size={isMobile ? "sm" : "default"}
                      >
                        {isEditing ? (
                          <>
                            <XCircle className="size-3 md:size-4" />
                            Cancel
                          </>
                        ) : (
                          <>
                            <Edit2 className="size-3 md:size-4" />
                            Edit Profile
                          </>
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                    {/* Personal Information */}
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-base md:text-lg font-semibold">
                        Personal Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm md:text-base">
                            Full Name
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="name"
                              defaultValue={currentUser.name}
                              disabled={!isEditing}
                              className="pl-9 md:pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm md:text-base">
                            Email Address
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="email"
                              type="email"
                              defaultValue={currentUser.email}
                              disabled={!isEditing}
                              className="pl-9 md:pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm md:text-base">
                            Phone Number
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="phone"
                              defaultValue={currentUser.phone}
                              disabled={!isEditing}
                              className="pl-9 md:pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="address" className="text-sm md:text-base">
                            Address
                          </Label>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="address"
                              defaultValue={currentUser.address}
                              disabled={!isEditing}
                              className="pl-9 md:pl-10 text-sm md:text-base"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-3 md:space-y-4">
                      <h3 className="text-base md:text-lg font-semibold">
                        Professional Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="role" className="text-sm md:text-base">Role</Label>
                          <Select
                            defaultValue={currentUser.role}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="min-w-full text-sm md:text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roleTypes.map((role) => (
                                <SelectItem key={role} value={role} className="text-sm">
                                  {role}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="department" className="text-sm md:text-base">Department</Label>
                          <Select
                            defaultValue={currentUser.department}
                            disabled={!isEditing}
                          >
                            <SelectTrigger className="min-w-full text-sm md:text-base">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {departmentTypes.map((dept) => (
                                <SelectItem key={dept} value={dept} className="text-sm">
                                  {dept}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="license" className="text-sm md:text-base">License Number</Label>
                          <Input
                            id="license"
                            defaultValue={currentUser.licenseNumber}
                            disabled={!isEditing}
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialization" className="text-sm md:text-base">Specialization</Label>
                          <Input
                            id="specialization"
                            defaultValue={currentUser.specialization}
                            disabled={!isEditing}
                            className="text-sm md:text-base"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm md:text-base">Bio</Label>
                        <Textarea
                          id="bio"
                          defaultValue={currentUser.bio}
                          disabled={!isEditing}
                          rows={2}
                          className="text-sm md:text-base"
                        />
                      </div>
                    </div>

                    {/* Security Section - Only show when editing */}
                    {isEditing && (
                      <div className="space-y-3 md:space-y-4 border-t pt-4 md:pt-6">
                        <h3 className="text-base md:text-lg font-semibold">Security</h3>
                        <div className="space-y-3 md:space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password" className="text-sm md:text-base">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="current-password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="pl-9 md:pl-10 text-sm md:text-base"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="size-3 md:size-4" />
                                ) : (
                                  <Eye className="size-3 md:size-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="new-password" className="text-sm md:text-base">New Password</Label>
                              <Input
                                id="new-password"
                                type="password"
                                placeholder="Enter new password"
                                className="text-sm md:text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password" className="text-sm md:text-base">Confirm Password</Label>
                              <Input
                                id="confirm-password"
                                type="password"
                                placeholder="Confirm new password"
                                className="text-sm md:text-base"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  {isEditing && (
                    <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 p-4 md:p-6 pt-0">
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                        className="w-full sm:w-auto text-sm md:text-base"
                        size={isMobile ? "sm" : "default"}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSaveProfile}
                        className="w-full sm:w-auto text-sm md:text-base bg-[#e11d48] hover:bg-[#e11d48]/80 text-white"
                        size={isMobile ? "sm" : "default"}
                      >
                        <Save className="size-3 md:size-4 mr-1 md:mr-2" />
                        Save Changes
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>

              {/* Right Column - User Management & Settings (Desktop only or when in profile tab) */}
              {!isMobile && (
                <div className="space-y-4 md:space-y-6">
                  {/* Notification Settings */}
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Bell className="size-4 md:size-5" />
                        Notification Settings
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Manage your notification preferences
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <div className="pr-4">
                            <Label className="font-medium text-sm md:text-base">
                              {key
                                .split(/(?=[A-Z])/)
                                .map(
                                  (word) =>
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                )
                                .join(" ")}
                            </Label>
                            <p className="text-xs md:text-sm text-muted-foreground">
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
                            className="scale-90 md:scale-100"
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          )}

          {/* Mobile Views for Security and Activity Tabs */}
          {isMobile && (
            <>
              {/* Security Tab */}
              {activeTab === "security" && (
                <div className="space-y-4">
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Lock className="size-4" />
                        Security Settings
                      </CardTitle>
                      <CardDescription className="text-sm">
                        Manage your account security
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 p-4 pt-0">
                      {/* Notification Settings for Mobile Security Tab */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Notification Preferences</h3>
                        <div className="space-y-3">
                          {Object.entries(notifications).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between"
                            >
                              <div className="pr-2">
                                <Label className="font-medium text-sm">
                                  {key
                                    .split(/(?=[A-Z])/)
                                    .map(
                                      (word) =>
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                    )
                                    .join(" ")}
                                </Label>
                              </div>
                              <Switch
                                checked={value}
                                onCheckedChange={() =>
                                  handleToggleNotification(
                                    key as keyof typeof notifications
                                  )
                                }
                                className="scale-90"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-2" />

                      {/* Password Change Section */}
                      <div className="space-y-3">
                        <h3 className="font-semibold">Change Password</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-password-mobile" className="text-sm">
                            Current Password
                          </Label>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="current-password-mobile"
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              className="pl-9 text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="size-3" />
                              ) : (
                                <Eye className="size-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password-mobile" className="text-sm">New Password</Label>
                          <Input
                            id="new-password-mobile"
                            type="password"
                            placeholder="Enter new password"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password-mobile" className="text-sm">Confirm Password</Label>
                          <Input
                            id="confirm-password-mobile"
                            type="password"
                            placeholder="Confirm new password"
                            className="text-sm"
                          />
                        </div>
                        <Button className="w-full text-sm">
                          Update Password
                        </Button>
                      </div>

                      <Separator className="my-2" />

                      {/* Account Actions */}
                      <div className="space-y-2">
                        <h3 className="font-semibold">Account Actions</h3>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-sm"
                          size="sm"
                        >
                          <LogOut className="mr-2 size-3" />
                          Logout All Devices
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full justify-start text-sm"
                          size="sm"
                        >
                          <Trash2 className="mr-2 size-3" />
                          Delete Account
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="space-y-4">
                  <Card className="shadow-none border-none">
                    <CardHeader className="p-4">
                      <CardTitle className="text-base">Recent Activity</CardTitle>
                      <CardDescription className="text-sm">
                        Your platform activity log
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="space-y-3">
                        {userActivities.slice(0, 4).map((activity) => (
                          <div
                            key={activity.id}
                            className="flex items-start gap-2 p-3 rounded-lg border"
                          >
                            <div className="mt-0.5 flex-shrink-0">
                              {activity.action === "Login" && (
                                <CheckCircle className="size-3 text-green-500" />
                              )}
                              {activity.action === "Logout" && (
                                <XCircle className="size-3 text-gray-500" />
                              )}
                              {activity.action.includes("Patient") && (
                                <User className="size-3 text-blue-500" />
                              )}
                              {activity.action === "Prescription" && (
                                <Briefcase className="size-3 text-purple-500" />
                              )}
                              {activity.action === "Appointment" && (
                                <Calendar className="size-3 text-amber-500" />
                              )}
                              {activity.action === "Settings" && (
                                <Edit2 className="size-3 text-gray-500" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">
                                {activity.details}
                              </p>
                              <div className="flex items-center gap-1 mt-0.5">
                                <span className="text-xs text-muted-foreground truncate">
                                  {activity.action}
                                </span>
                                <span className="text-xs text-muted-foreground">•</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(activity.timestamp).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      {userActivities.length > 4 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-3 text-xs"
                        >
                          View All Activity
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}

          {/* Desktop Activity Log (shown below profile when not mobile) */}
          {!isMobile && (
            <div className="lg:col-span-3">
              <Card className="shadow-none border-none">
                <CardHeader className="p-4 md:p-6">
                  <CardTitle className="text-base md:text-lg lg:text-xl">Recent Activity</CardTitle>
                  <CardDescription className="text-sm md:text-base">
                    Your platform activity log
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-4 md:p-6 pt-0">
                  <div className="space-y-3 md:space-y-4">
                    {userActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start gap-3 p-3 md:p-4 rounded-lg border"
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
                            <p className="font-medium text-sm md:text-base">{activity.details}</p>
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {new Date(activity.timestamp).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs md:text-sm text-muted-foreground">
                              {activity.action}
                            </span>
                            <span className="text-xs md:text-sm text-muted-foreground">
                              •
                            </span>
                            <span className="text-xs md:text-sm text-muted-foreground">
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
          )}
        </div>
      </div>
    </>
  );
}
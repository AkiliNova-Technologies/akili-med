"use client";

import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Users,
  Bell,
  Shield,
  Database,
  // Palette,
  Globe,
  CreditCard,
  Download,
  Upload,
  Save,
  RefreshCw,
  Trash2,
  Eye,
  EyeOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  User,
  Lock,
  Smartphone,
  AlertCircle,
  Cloud,
  Users2,
  History,
  BellRing,
  MessageSquare,
  Plus,
  Search,
  MoreVertical,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    reminders: true,
    billing: true,
    marketing: false,
  });

  const [businessInfo, setBusinessInfo] = useState({
    name: "Akili Medical Center",
    type: "medical-clinic",
    taxId: "TAX-123456789",
    registration: "REG-987654321",
    phone: "+1 (555) 123-4567",
    email: "info@akilimedical.com",
    website: "https://akilimedical.com",
    address: "123 Medical Plaza, Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  });

  const handleSaveSettings = () => {
    console.log("Settings saved");
    // Implement save logic
  };

  const handleExportData = () => {
    console.log("Exporting data...");
    // Implement export logic
  };

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      console.log("Settings reset");
      // Implement reset logic
    }
  };

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen bg-gray-50/50">
        <div className="container mx-auto p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your platform configuration and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6 shadow-none">
                <CardContent className="p-4">
                  <nav className="space-y-1">
                    <Button
                      variant={activeTab === "general" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("general")}
                    >
                      <Building className="mr-2 h-4 w-4" />
                      General
                    </Button>
                    <Button
                      variant={activeTab === "users" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("users")}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Users & Roles
                    </Button>
                    <Button
                      variant={
                        activeTab === "notifications" ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setActiveTab("notifications")}
                    >
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                    <Button
                      variant={activeTab === "security" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("security")}
                    >
                      <Shield className="mr-2 h-4 w-4" />
                      Security
                    </Button>
                    <Button
                      variant={activeTab === "data" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("data")}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Data Management
                    </Button>
                    {/* <Button
                      variant={
                        activeTab === "appearance" ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setActiveTab("appearance")}
                    >
                      <Palette className="mr-2 h-4 w-4" />
                      Appearance
                    </Button>
                    <Button
                      variant={
                        activeTab === "integrations" ? "secondary" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setActiveTab("integrations")}
                    >
                      <Globe className="mr-2 h-4 w-4" />
                      Integrations
                    </Button>
                    <Button
                      variant={activeTab === "billing" ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("billing")}
                    >
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Button> */}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-6">
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="h-5 w-5" />
                        Business Information
                      </CardTitle>
                      <CardDescription>
                        Update your clinic or practice information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName">Business Name *</Label>
                          <Input
                            id="businessName"
                            value={businessInfo.name}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                name: e.target.value,
                              })
                            }
                            placeholder="Your clinic name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType">Business Type</Label>
                          <Select value={businessInfo.type}>
                            <SelectTrigger className="min-w-full">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="medical-clinic">
                                Medical Clinic
                              </SelectItem>
                              <SelectItem value="hospital">Hospital</SelectItem>
                              <SelectItem value="specialty-center">
                                Specialty Center
                              </SelectItem>
                              <SelectItem value="dental-clinic">
                                Dental Clinic
                              </SelectItem>
                              <SelectItem value="veterinary">
                                Veterinary Clinic
                              </SelectItem>
                              <SelectItem value="laboratory">
                                Laboratory
                              </SelectItem>
                              <SelectItem value="pharmacy">Pharmacy</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="taxId">Tax ID Number</Label>
                          <Input
                            id="taxId"
                            value={businessInfo.taxId}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                taxId: e.target.value,
                              })
                            }
                            placeholder="TAX-XXXXXXXXX"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="registration">
                            Registration Number
                          </Label>
                          <Input
                            id="registration"
                            value={businessInfo.registration}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                registration: e.target.value,
                              })
                            }
                            placeholder="REG-XXXXXXXXX"
                          />
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">
                            <Phone className="inline h-4 w-4 mr-2" />
                            Phone Number
                          </Label>
                          <Input
                            id="phone"
                            value={businessInfo.phone}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                phone: e.target.value,
                              })
                            }
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">
                            <Mail className="inline h-4 w-4 mr-2" />
                            Email Address
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={businessInfo.email}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                email: e.target.value,
                              })
                            }
                            placeholder="contact@example.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website">
                          <Globe className="inline h-4 w-4 mr-2" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={businessInfo.website}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              website: e.target.value,
                            })
                          }
                          placeholder="https://example.com"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <Label htmlFor="address">
                          <MapPin className="inline h-4 w-4 mr-2" />
                          Street Address
                        </Label>
                        <Input
                          id="address"
                          value={businessInfo.address}
                          onChange={(e) =>
                            setBusinessInfo({
                              ...businessInfo,
                              address: e.target.value,
                            })
                          }
                          placeholder="123 Main Street"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={businessInfo.city}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                city: e.target.value,
                              })
                            }
                            placeholder="New York"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state">State/Province</Label>
                          <Input
                            id="state"
                            value={businessInfo.state}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                state: e.target.value,
                              })
                            }
                            placeholder="NY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                          <Input
                            id="zipCode"
                            value={businessInfo.zipCode}
                            onChange={(e) =>
                              setBusinessInfo({
                                ...businessInfo,
                                zipCode: e.target.value,
                              })
                            }
                            placeholder="10001"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country</Label>
                        <Select value={businessInfo.country}>
                          <SelectTrigger className="min-w-full">
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="United States">
                              United States
                            </SelectItem>
                            <SelectItem value="Canada">Canada</SelectItem>
                            <SelectItem value="United Kingdom">
                              United Kingdom
                            </SelectItem>
                            <SelectItem value="Australia">Australia</SelectItem>
                            <SelectItem value="Germany">Germany</SelectItem>
                            <SelectItem value="France">France</SelectItem>
                            <SelectItem value="Japan">Japan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        Working Hours & Schedule
                      </CardTitle>
                      <CardDescription>
                        Set your clinic operating hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                          "Saturday",
                          "Sunday",
                        ].map((day) => (
                          <div
                            key={day}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="font-medium min-w-[100px]">
                                {day}
                              </div>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="time"
                                  defaultValue="09:00"
                                  className="w-32"
                                />
                                <span>to</span>
                                <Input
                                  type="time"
                                  defaultValue="17:00"
                                  className="w-32"
                                />
                              </div>
                            </div>
                            <Switch
                              defaultChecked={
                                day !== "Saturday" && day !== "Sunday"
                              }
                            />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Users & Roles */}
              {activeTab === "users" && (
                <div className="space-y-6">
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>
                        Manage users and their permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search users..."
                              className="pl-10 w-64"
                            />
                          </div>
                          <Select defaultValue="all">
                            <SelectTrigger className="w-40">
                              <SelectValue placeholder="Filter by role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Roles</SelectItem>
                              <SelectItem value="admin">
                                Administrator
                              </SelectItem>
                              <SelectItem value="doctor">Doctor</SelectItem>
                              <SelectItem value="nurse">Nurse</SelectItem>
                              <SelectItem value="reception">
                                Reception
                              </SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Add User
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {[
                          {
                            name: "Dr. Sarah Smith",
                            email: "sarah@akilimedical.com",
                            role: "Administrator",
                            status: "active",
                          },
                          {
                            name: "Nurse Emily Jones",
                            email: "emily@akilimedical.com",
                            role: "Nurse",
                            status: "active",
                          },
                          {
                            name: "Michael Brown",
                            email: "michael@akilimedical.com",
                            role: "Reception",
                            status: "active",
                          },
                          {
                            name: "Dr. Robert Chen",
                            email: "robert@akilimedical.com",
                            role: "Doctor",
                            status: "inactive",
                          },
                          {
                            name: "Lisa Taylor",
                            email: "lisa@akilimedical.com",
                            role: "Billing",
                            status: "active",
                          },
                        ].map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-4">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <User className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium">{user.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {user.role}
                              </Badge>
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "outline"
                                    : "destructive"
                                }
                              >
                                {user.status === "active"
                                  ? "Active"
                                  : "Inactive"}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users2 className="h-5 w-5" />
                        Role Permissions
                      </CardTitle>
                      <CardDescription>
                        Configure permissions for each role
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="admin">
                        <TabsList className="grid grid-cols-5 mb-4">
                          <TabsTrigger value="admin">Admin</TabsTrigger>
                          <TabsTrigger value="doctor">Doctor</TabsTrigger>
                          <TabsTrigger value="nurse">Nurse</TabsTrigger>
                          <TabsTrigger value="reception">Reception</TabsTrigger>
                          <TabsTrigger value="billing">Billing</TabsTrigger>
                        </TabsList>
                        <TabsContent value="admin" className="space-y-4">
                          <div className="space-y-3">
                            {[
                              {
                                label: "Full System Access",
                                description:
                                  "Access to all features and settings",
                              },
                              {
                                label: "User Management",
                                description: "Create, edit, and delete users",
                              },
                              {
                                label: "Financial Reports",
                                description: "View and export financial data",
                              },
                              {
                                label: "System Configuration",
                                description: "Change system settings",
                              },
                            ].map((permission, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 border rounded-lg"
                              >
                                <div>
                                  <div className="font-medium">
                                    {permission.label}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {permission.description}
                                  </div>
                                </div>
                                <Switch defaultChecked />
                              </div>
                            ))}
                          </div>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-6">
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>
                        Configure how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Notification Channels
                        </h3>
                        <div className="space-y-3">
                          {Object.entries(notifications).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="space-y-0.5">
                                <Label htmlFor={key} className="capitalize">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive notifications via{" "}
                                  {key === "push" ? "browser" : key}
                                </p>
                              </div>
                              <Switch
                                id={key}
                                checked={value}
                                onCheckedChange={(checked) =>
                                  setNotifications({
                                    ...notifications,
                                    [key]: checked,
                                  })
                                }
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Notification Types
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="shadow-none">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <BellRing className="h-4 w-4" />
                                Appointment Reminders
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    24 hours before
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    1 hour before
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    No-show alerts
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="shadow-none">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                Patient Messages
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    New messages
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    Message replies
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    Urgent messages
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="shadow-none">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <CreditCard className="h-4 w-4" />
                                Billing Updates
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    Payment received
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    Overdue invoices
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    Monthly reports
                                  </Label>
                                  <Switch />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="shadow-none">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                System Alerts
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    System updates
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">
                                    Security alerts
                                  </Label>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between">
                                  <Label className="text-sm">Maintenance</Label>
                                  <Switch defaultChecked />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-6">
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Password & Authentication
                      </CardTitle>
                      <CardDescription>
                        Manage your account security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Change Password
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              placeholder="Enter new password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                              Confirm New Password
                            </Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              placeholder="Confirm new password"
                            />
                          </div>
                          <Button>Update Password</Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Two-Factor Authentication
                        </h3>
                        <div className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="space-y-0.5">
                            <div className="font-medium">
                              Two-Factor Authentication (2FA)
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Button variant="outline">Enable 2FA</Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Active Sessions
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              device: "Windows Desktop",
                              browser: "Chrome",
                              location: "New York, USA",
                              time: "Currently active",
                            },
                            {
                              device: "iPhone 13",
                              browser: "Safari",
                              location: "Boston, USA",
                              time: "2 hours ago",
                            },
                            {
                              device: "MacBook Pro",
                              browser: "Firefox",
                              location: "London, UK",
                              time: "1 week ago",
                            },
                          ].map((session, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-4 border rounded-lg"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                  <Smartphone className="h-5 w-5" />
                                </div>
                                <div>
                                  <div className="font-medium">
                                    {session.device}
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    {session.browser} • {session.location} •{" "}
                                    {session.time}
                                  </div>
                                </div>
                              </div>
                              {index === 0 ? (
                                <Badge variant="default">Current</Badge>
                              ) : (
                                <Button variant="ghost" size="sm">
                                  Sign out
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Data Management */}
              {activeTab === "data" && (
                <div className="space-y-6">
                  <Card className="shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Data Management
                      </CardTitle>
                      <CardDescription>
                        Manage your data backup, export, and retention
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="shadow-none ">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Cloud className="h-4 w-4" />
                              Backup Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Last Backup</span>
                                <span className="text-sm font-medium">
                                  2 hours ago
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">
                                  Backup Frequency
                                </span>
                                <span className="text-sm font-medium">
                                  Daily
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm">Storage Used</span>
                                <span className="text-sm font-medium">
                                  4.2 GB / 10 GB
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-600 h-2 rounded-full"
                                  style={{ width: "42%" }}
                                />
                              </div>
                              <Button className="w-full" variant="outline">
                                <Upload className="h-4 w-4 mr-2" />
                                Backup Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="shadow-none ">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Download className="h-4 w-4" />
                              Export Data
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm">Export Format</Label>
                              <Select defaultValue="csv">
                                <SelectTrigger className="min-w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="csv">CSV</SelectItem>
                                  <SelectItem value="excel">Excel</SelectItem>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                  <SelectItem value="json">JSON</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm">Data Range</Label>
                              <Select defaultValue="all">
                                <SelectTrigger className="min-w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all">All Time</SelectItem>
                                  <SelectItem value="last-month">
                                    Last Month
                                  </SelectItem>
                                  <SelectItem value="last-year">
                                    Last Year
                                  </SelectItem>
                                  <SelectItem value="custom">
                                    Custom Range
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="w-full"
                              onClick={handleExportData}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Export Data
                            </Button>
                          </CardContent>
                        </Card>

                        <Card className="shadow-none ">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <History className="h-4 w-4" />
                              Data Retention
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div className="space-y-2">
                              <Label className="text-sm">
                                Retention Period
                              </Label>
                              <Select defaultValue="7-years">
                                <SelectTrigger className="min-w-full">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1-year">1 Year</SelectItem>
                                  <SelectItem value="3-years">
                                    3 Years
                                  </SelectItem>
                                  <SelectItem value="5-years">
                                    5 Years
                                  </SelectItem>
                                  <SelectItem value="7-years">
                                    7 Years (Medical)
                                  </SelectItem>
                                  <SelectItem value="10-years">
                                    10 Years
                                  </SelectItem>
                                  <SelectItem value="forever">
                                    Forever
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              Medical records are retained according to legal
                              requirements
                            </div>
                            <Button className="w-full" variant="outline">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Clean Old Data
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Save/Reset Buttons */}
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={handleResetSettings}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reset to Default
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirm("Are you sure?")}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-[#e11d48] hover:bg-[#e11d48]/90"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

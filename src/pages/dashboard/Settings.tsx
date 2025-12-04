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
  
  BellRing,
  MessageSquare,
  Plus,
  Search,
  MoreVertical,
  
  X,
  Settings as SettingsIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
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

  const isMobile = useIsMobile();

  const handleSaveSettings = () => {
    console.log("Settings saved");
  };

  const handleExportData = () => {
    console.log("Exporting data...");
  };

  // const handleResetSettings = () => {
  //   if (confirm("Are you sure you want to reset all settings to default?")) {
  //     console.log("Settings reset");
  //   }
  // };

  // Mobile sidebar navigation items
  const navItems = [
    { id: "general", label: "General", icon: <Building className="h-4 w-4" /> },
    { id: "users", label: "Users & Roles", icon: <Users className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "data", label: "Data Management", icon: <Database className="h-4 w-4" /> },
  ];

  return (
    <>
      <SiteHeader />
      <div className="min-h-screen">
        <div className="p-3 sm:p-4 md:p-6">
          <div className="mb-4 md:mb-6">
            <div className="flex items-center justify-between md:block">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                  Settings
                </h1>
                <p className="text-sm md:text-base text-muted-foreground mt-1">
                  Manage your platform configuration and preferences
                </p>
              </div>
              
              {/* Mobile sidebar toggle */}
              {isMobile && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowMobileSidebar(!showMobileSidebar)}
                  className="h-10 w-10"
                >
                  {showMobileSidebar ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <SettingsIcon className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Mobile Sidebar Overlay */}
            {isMobile && showMobileSidebar && (
              <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div className="fixed inset-y-0 left-0 z-50 w-3/4 max-w-sm bg-background border-r p-4">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold">Settings Menu</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowMobileSidebar(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <nav className="space-y-1">
                    {navItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={activeTab === item.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => {
                          setActiveTab(item.id);
                          setShowMobileSidebar(false);
                        }}
                      >
                        {item.icon}
                        <span className="ml-2">{item.label}</span>
                      </Button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* Desktop Left Sidebar */}
            {!isMobile && (
              <div className="lg:col-span-1">
                <Card className="sticky top-6 shadow-none">
                  <CardContent className="p-4">
                    <nav className="space-y-1">
                      {navItems.map((item) => (
                        <Button
                          key={item.id}
                          variant={activeTab === item.id ? "secondary" : "ghost"}
                          className="w-full justify-start text-sm md:text-base"
                          onClick={() => setActiveTab(item.id)}
                        >
                          {item.icon}
                          <span className="ml-2">{item.label}</span>
                        </Button>
                      ))}
                    </nav>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Main Content */}
            <div className={cn("lg:col-span-3", isMobile && "lg:col-span-4")}>
              {/* Mobile Tabs Navigation */}
              {isMobile && (
                <div className="mb-4">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 sm:grid-cols-2 h-auto w-full">
                      <TabsTrigger value="general" className="text-xs py-1.5 flex flex-1">
                        <Building className="h-3 w-3 mr-1" />
                        General
                      </TabsTrigger>
                      <TabsTrigger value="users" className="text-xs py-1.5">
                        <Users className="h-3 w-3 mr-1" />
                        Users
                      </TabsTrigger>
                      <TabsTrigger value="notifications" className="text-xs py-1.5">
                        <Bell className="h-3 w-3 mr-1" />
                        Notifications
                      </TabsTrigger>
                      <TabsTrigger value="security" className="text-xs py-1.5">
                        <Shield className="h-3 w-3 mr-1" />
                        Security
                      </TabsTrigger>
                      <TabsTrigger value="data" className="text-xs py-1.5">
                        <Database className="h-3 w-3 mr-1" />
                        Data
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              )}

              {/* General Settings */}
              {activeTab === "general" && (
                <div className="space-y-4 md:space-y-6">
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Building className="h-4 w-4 md:h-5 md:w-5" />
                        Business Information
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Update your clinic or practice information
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                      <div className="grid grid-cols-1 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="businessName" className="text-sm md:text-base">
                            Business Name *
                          </Label>
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
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessType" className="text-sm md:text-base">
                            Business Type
                          </Label>
                          <Select value={businessInfo.type}>
                            <SelectTrigger className="min-w-full text-sm md:text-base">
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

                      <Separator className="my-2 md:my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm md:text-base">
                            <Phone className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
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
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm md:text-base">
                            <Mail className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
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
                            className="text-sm md:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm md:text-base">
                          <MapPin className="inline h-3 w-3 md:h-4 md:w-4 mr-1" />
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
                          className="text-sm md:text-base"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="city" className="text-sm md:text-base">City</Label>
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
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-sm md:text-base">State/Province</Label>
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
                            className="text-sm md:text-base"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="zipCode" className="text-sm md:text-base">ZIP/Postal Code</Label>
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
                            className="text-sm md:text-base"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Working Hours - Simplified for mobile */}
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5" />
                        Working Hours
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Set your clinic operating hours
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6 pt-0">
                      <div className="space-y-2 md:space-y-4">
                        {isMobile ? (
                          // Mobile simplified view
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Weekdays (Mon-Fri)</Label>
                              <span className="text-sm font-medium">9:00 AM - 5:00 PM</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Weekends</Label>
                              <span className="text-sm font-medium">Closed</span>
                            </div>
                            <Button variant="outline" size="sm" className="w-full text-xs">
                              Edit Hours
                            </Button>
                          </div>
                        ) : (
                          // Desktop detailed view
                          ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                            <div
                              key={day}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="font-medium min-w-[100px] text-sm">
                                  {day}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="time"
                                    defaultValue="09:00"
                                    className="w-32 text-sm"
                                  />
                                  <span className="text-sm">to</span>
                                  <Input
                                    type="time"
                                    defaultValue="17:00"
                                    className="w-32 text-sm"
                                  />
                                </div>
                              </div>
                              <Switch
                                defaultChecked={
                                  day !== "Saturday" && day !== "Sunday"
                                }
                                className="scale-90 md:scale-100"
                              />
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Users & Roles */}
              {activeTab === "users" && (
                <div className="space-y-4 md:space-y-6">
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Users className="h-4 w-4 md:h-5 md:w-5" />
                        User Management
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Manage users and their permissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <div className="relative flex-1 md:flex-none">
                            <Search className="absolute left-3 top-1/2 h-3 w-3 md:h-4 md:w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              placeholder="Search users..."
                              className="pl-8 md:pl-10 text-sm w-full md:w-48"
                            />
                          </div>
                          {!isMobile && (
                            <Select defaultValue="all">
                              <SelectTrigger className="w-40 text-sm">
                                <SelectValue placeholder="Filter by role" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">All Roles</SelectItem>
                                <SelectItem value="admin">Administrator</SelectItem>
                                <SelectItem value="doctor">Doctor</SelectItem>
                                <SelectItem value="nurse">Nurse</SelectItem>
                                <SelectItem value="reception">Reception</SelectItem>
                                <SelectItem value="billing">Billing</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        <Button size={isMobile ? "sm" : "default"} className="w-full md:w-auto">
                          <Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                          Add User
                        </Button>
                      </div>

                      <div className="space-y-3 md:space-y-4">
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
                        ].map((user, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 md:p-4 border rounded-lg"
                          >
                            <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                              <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                <User className="h-3 w-3 md:h-5 md:w-5 text-primary" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm md:text-base truncate">
                                  {user.name}
                                </div>
                                <div className="text-xs md:text-sm text-muted-foreground truncate">
                                  {user.email}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 md:gap-4 flex-shrink-0">
                              {!isMobile && (
                                <Badge
                                  variant={
                                    user.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {user.role}
                                </Badge>
                              )}
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "outline"
                                    : "destructive"
                                }
                                className="text-xs"
                              >
                                {user.status === "active" ? "Active" : "Inactive"}
                              </Badge>
                              <Button variant="ghost" size="sm" className="h-7 w-7 md:h-9 md:w-9 p-0">
                                <MoreVertical className="h-3 w-3 md:h-4 md:w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Role Permissions - Mobile simplified */}
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Users2 className="h-4 w-4 md:h-5 md:w-5" />
                        Role Permissions
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Configure permissions for each role
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 pt-0">
                      {isMobile ? (
                        <div className="space-y-3">
                          <Select defaultValue="admin">
                            <SelectTrigger className="min-w-full text-sm">
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="doctor">Doctor</SelectItem>
                              <SelectItem value="nurse">Nurse</SelectItem>
                              <SelectItem value="reception">Reception</SelectItem>
                              <SelectItem value="billing">Billing</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Full System Access</Label>
                              <Switch defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">User Management</Label>
                              <Switch defaultChecked />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Tabs defaultValue="admin">
                          <TabsList className="grid grid-cols-5 mb-4">
                            <TabsTrigger value="admin" className="text-sm">Admin</TabsTrigger>
                            <TabsTrigger value="doctor" className="text-sm">Doctor</TabsTrigger>
                            <TabsTrigger value="nurse" className="text-sm">Nurse</TabsTrigger>
                            <TabsTrigger value="reception" className="text-sm">Reception</TabsTrigger>
                            <TabsTrigger value="billing" className="text-sm">Billing</TabsTrigger>
                          </TabsList>
                          <TabsContent value="admin" className="space-y-4">
                            <div className="space-y-3">
                              {[
                                {
                                  label: "Full System Access",
                                  description: "Access to all features and settings",
                                },
                                {
                                  label: "User Management",
                                  description: "Create, edit, and delete users",
                                },
                              ].map((permission, index) => (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
                                  <div>
                                    <div className="font-medium text-sm">
                                      {permission.label}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {permission.description}
                                    </div>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                              ))}
                            </div>
                          </TabsContent>
                        </Tabs>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="space-y-4 md:space-y-6">
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Bell className="h-4 w-4 md:h-5 md:w-5" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Configure how you receive notifications
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold">
                          Notification Channels
                        </h3>
                        <div className="space-y-2 md:space-y-3">
                          {Object.entries(notifications).map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="space-y-0.5">
                                <Label htmlFor={key} className="capitalize text-sm md:text-base">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </Label>
                                <p className="text-xs md:text-sm text-muted-foreground">
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
                                className="scale-90 md:scale-100"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Separator className="my-3 md:my-4" />

                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold">
                          Notification Types
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          {[
                            {
                              title: "Appointment Reminders",
                              icon: <BellRing className="h-4 w-4" />,
                              items: ["24 hours before", "1 hour before", "No-show alerts"],
                            },
                            {
                              title: "Patient Messages",
                              icon: <MessageSquare className="h-4 w-4" />,
                              items: ["New messages", "Message replies", "Urgent messages"],
                            },
                            {
                              title: "Billing Updates",
                              icon: <CreditCard className="h-4 w-4" />,
                              items: ["Payment received", "Overdue invoices", "Monthly reports"],
                            },
                            {
                              title: "System Alerts",
                              icon: <AlertCircle className="h-4 w-4" />,
                              items: ["System updates", "Security alerts", "Maintenance"],
                            },
                          ].map((category, index) => (
                            <Card key={index} className="shadow-none">
                              <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
                                <CardTitle className="text-sm flex items-center gap-2">
                                  {category.icon}
                                  {category.title}
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="p-3 md:p-4 pt-0">
                                <div className="space-y-2 md:space-y-3">
                                  {category.items.map((item, itemIndex) => (
                                    <div key={itemIndex} className="flex items-center justify-between">
                                      <Label className="text-xs md:text-sm">{item}</Label>
                                      <Switch defaultChecked={itemIndex !== 2} className="scale-75 md:scale-90" />
                                    </div>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <div className="space-y-4 md:space-y-6">
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Lock className="h-4 w-4 md:h-5 md:w-5" />
                        Password & Authentication
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Manage your account security settings
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold">
                          Change Password
                        </h3>
                        <div className="space-y-3 md:space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword" className="text-sm md:text-base">
                              Current Password
                            </Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter current password"
                                className="text-sm md:text-base pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-3 w-3 md:h-4 md:w-4" />
                                ) : (
                                  <Eye className="h-3 w-3 md:h-4 md:w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="newPassword" className="text-sm md:text-base">New Password</Label>
                              <Input
                                id="newPassword"
                                type="password"
                                placeholder="Enter new password"
                                className="text-sm md:text-base"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirmPassword" className="text-sm md:text-base">Confirm Password</Label>
                              <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm new password"
                                className="text-sm md:text-base"
                              />
                            </div>
                          </div>
                          <Button size={isMobile ? "sm" : "default"} className="w-full md:w-auto">
                            Update Password
                          </Button>
                        </div>
                      </div>

                      <Separator className="my-3 md:my-4" />

                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-base md:text-lg font-semibold">
                          Active Sessions
                        </h3>
                        <div className="space-y-2 md:space-y-3">
                          {[
                            {
                              device: "Windows Desktop",
                              browser: "Chrome",
                              location: "New York, USA",
                              time: "Currently active",
                              current: true,
                            },
                            {
                              device: "iPhone 13",
                              browser: "Safari",
                              location: "Boston, USA",
                              time: "2 hours ago",
                              current: false,
                            },
                          ].map((session, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg"
                            >
                              <div className="flex items-center gap-2 md:gap-4">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                                  <Smartphone className="h-3 w-3 md:h-5 md:w-5" />
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-sm truncate">
                                    {session.device}
                                  </div>
                                  <div className="text-xs text-muted-foreground truncate">
                                    {session.browser} • {session.time}
                                  </div>
                                </div>
                              </div>
                              {session.current ? (
                                <Badge variant="default" className="text-xs">Current</Badge>
                              ) : (
                                <Button variant="ghost" size="sm" className="text-xs h-7">
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
                <div className="space-y-4 md:space-y-6">
                  <Card className="shadow-none">
                    <CardHeader className="p-4 md:p-6">
                      <CardTitle className="flex items-center gap-2 text-base md:text-lg lg:text-xl">
                        <Database className="h-4 w-4 md:h-5 md:w-5" />
                        Data Management
                      </CardTitle>
                      <CardDescription className="text-sm md:text-base">
                        Manage your data backup, export, and retention
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6 pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        <Card className="shadow-none">
                          <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Cloud className="h-3 w-3 md:h-4 md:w-4" />
                              Backup Status
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 md:p-4 pt-0">
                            <div className="space-y-2 md:space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs md:text-sm">Last Backup</span>
                                <span className="text-xs md:text-sm font-medium">2 hours ago</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 md:h-2">
                                <div
                                  className="bg-blue-600 h-1.5 md:h-2 rounded-full"
                                  style={{ width: "42%" }}
                                />
                              </div>
                              <Button className="w-full text-xs md:text-sm h-7 md:h-9" variant="outline">
                                <Upload className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                                Backup Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="shadow-none">
                          <CardHeader className="pb-2 md:pb-3 p-3 md:p-4">
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Download className="h-3 w-3 md:h-4 md:w-4" />
                              Export Data
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 md:p-4 pt-0 space-y-2 md:space-y-3">
                            <div className="space-y-1 md:space-y-2">
                              <Label className="text-xs md:text-sm">Export Format</Label>
                              <Select defaultValue="csv">
                                <SelectTrigger className="min-w-full text-xs md:text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="csv">CSV</SelectItem>
                                  <SelectItem value="excel">Excel</SelectItem>
                                  <SelectItem value="pdf">PDF</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <Button
                              className="w-full text-xs md:text-sm h-7 md:h-9"
                              onClick={handleExportData}
                            >
                              <Download className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                              Export Data
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Save/Reset Buttons */}
              <div className="flex flex-col-reverse md:flex-row items-center justify-between mt-4 md:mt-6 gap-3">
                <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                  <Button variant="outline" size={isMobile ? "sm" : "default"} className="w-full md:w-auto">
                    <RefreshCw className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
                    Reset to Default
                  </Button>
                  {!isMobile && (
                    <Button variant="destructive" size="default">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  )}
                </div>
                <Button
                  onClick={handleSaveSettings}
                  className="bg-[#e11d48] hover:bg-[#e11d48]/90 text-white w-full md:w-auto"
                  size={isMobile ? "sm" : "default"}
                >
                  <Save className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
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
"use client";

import { useState } from "react";
import {
  BarChart3,
  Users,
  Settings,
  Database,
  FileText,
  TrendingUp,
  Menu,
  X,
  Bell,
  Search,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { icon: BarChart3, label: "Dashboard", active: true },
  { icon: Users, label: "Users", active: false },
  { icon: Database, label: "Data", active: false },
  { icon: FileText, label: "Reports", active: false },
  { icon: TrendingUp, label: "Analytics", active: false },
  { icon: Settings, label: "Settings", active: false },
];

const statsCards = [
  { title: "Total Users", value: "12,345", change: "+12%", trend: "up" },
  { title: "Active Sessions", value: "1,234", change: "+5%", trend: "up" },
  { title: "Revenue", value: "$45,678", change: "+18%", trend: "up" },
  { title: "Conversion Rate", value: "3.2%", change: "-2%", trend: "down" },
];

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-sidebar-border transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            Admin Panel
          </h1>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigationItems.map((item, index) => (
              <li key={index}>
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 ${
                    item.active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-card border-b border-border h-16 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10 w-64" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
            <Button variant="ghost" size="sm">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground text-sm font-medium">
                A
              </span>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Title */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Dashboard
                </h2>
                <p className="text-muted-foreground mt-1">
                  Welcome back! Here's what's happening with your data.
                </p>
              </div>
              <Badge variant="secondary" className="text-sm">
                Last updated: 2 min ago
              </Badge>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {statsCards.map((stat, index) => (
                <Card key={index} className="bg-card">
                  <CardHeader className="pb-2">
                    <CardDescription className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-card-foreground">
                        {stat.value}
                      </div>
                      <Badge
                        variant={
                          stat.trend === "up" ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {stat.change}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Data Management Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Latest user interactions and system events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        action: "User registration",
                        user: "john@example.com",
                        time: "2 min ago",
                      },
                      {
                        action: "Data export",
                        user: "admin@company.com",
                        time: "5 min ago",
                      },
                      {
                        action: "Report generated",
                        user: "sarah@example.com",
                        time: "12 min ago",
                      },
                      {
                        action: "Settings updated",
                        user: "admin@company.com",
                        time: "1 hour ago",
                      },
                    ].map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between py-2 border-b border-border last:border-0"
                      >
                        <div>
                          <p className="text-sm font-medium text-card-foreground">
                            {activity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card">
                <CardHeader>
                  <CardTitle className="text-card-foreground">
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Frequently used data management tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 bg-transparent"
                    >
                      <Users className="h-6 w-6" />
                      <span className="text-sm">Manage Users</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 bg-transparent"
                    >
                      <Database className="h-6 w-6" />
                      <span className="text-sm">Export Data</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 bg-transparent"
                    >
                      <FileText className="h-6 w-6" />
                      <span className="text-sm">Generate Report</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-20 flex-col gap-2 bg-transparent"
                    >
                      <Settings className="h-6 w-6" />
                      <span className="text-sm">System Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Data Table Preview */}
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground">
                  Data Overview
                </CardTitle>
                <CardDescription>
                  Recent entries in your database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          ID
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Name
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Email
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Status
                        </th>
                        <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                          Created
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        {
                          id: "001",
                          name: "John Doe",
                          email: "john@example.com",
                          status: "Active",
                          created: "2024-01-15",
                        },
                        {
                          id: "002",
                          name: "Sarah Smith",
                          email: "sarah@example.com",
                          status: "Active",
                          created: "2024-01-14",
                        },
                        {
                          id: "003",
                          name: "Mike Johnson",
                          email: "mike@example.com",
                          status: "Inactive",
                          created: "2024-01-13",
                        },
                        {
                          id: "004",
                          name: "Emily Brown",
                          email: "emily@example.com",
                          status: "Active",
                          created: "2024-01-12",
                        },
                      ].map((row, index) => (
                        <tr
                          key={index}
                          className="border-b border-border hover:bg-muted/50"
                        >
                          <td className="py-3 px-4 text-card-foreground">
                            {row.id}
                          </td>
                          <td className="py-3 px-4 text-card-foreground">
                            {row.name}
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {row.email}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant={
                                row.status === "Active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {row.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {row.created}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

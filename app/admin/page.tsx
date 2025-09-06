"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import {
  MoreHorizontal,
  Ban,
  Shield,
  UserCheck,
  Search,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { authAPI, userAPI } from "@/lib/api";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: {
    id: number;
    name: "admin" | "user" | "editor";
  };
  profile_status: "normal" | "banned";
}

export default function UserPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [searchName, setSearchName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [filterRole, setFilterRole] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [role, setRole] = useState<string>("editor");

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await authAPI.authMe();
      setRole(data.role.name);
      const res = await userAPI.listUsers();
      setUsers(res.data.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  // ✅ Fetch on component mount
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const name = `${user.firstname} ${user.lastname}`;
      const matchesName = name.toLowerCase().includes(searchName.toLowerCase());
      const matchesEmail = user.email
        .toLowerCase()
        .includes(searchEmail.toLowerCase());
      const matchesRole = filterRole === "all" || user.role.name === filterRole;
      const matchesStatus =
        filterStatus === "all" || user.profile_status === filterStatus;

      return matchesName && matchesEmail && matchesRole && matchesStatus;
    });
  }, [users, searchName, searchEmail, filterRole, filterStatus]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSearchName("");
    setSearchEmail("");
    setFilterRole("all");
    setFilterStatus("all");
    setCurrentPage(1);
  };

  const handleBanUser = async (userId: string) => {
    await userAPI.banUser(userId);
    fetchUsers();
  };

  const handleUnbanUser = async (userId: string) => {
    await userAPI.unbanUser(userId);
    fetchUsers();
  };

  const handleChangeRole = (userId: string, newRole: number) => {
    userAPI.changeUserRole(userId, newRole).then(() => fetchUsers());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status: "normal" | "banned") => {
    return status === "normal" ? (
      <Badge
        variant="secondary"
        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      >
        Normal
      </Badge>
    ) : (
      <Badge variant="destructive">Banned</Badge>
    );
  };

  const getRoleBadge = (role: "admin" | "user" | "editor") => {
    const variants = {
      admin:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
      editor: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      user: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };

    return (
      <Badge variant="secondary" className={variants[role]}>
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </Badge>
    );
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            <p className="text-muted-foreground">
              Manage user accounts, roles, and permissions
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search by Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by name..."
                  value={searchName}
                  onChange={(e) => {
                    setSearchName(e.target.value);
                    handleFilterChange();
                  }}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search by Email</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search users by email..."
                  value={searchEmail}
                  onChange={(e) => {
                    setSearchEmail(e.target.value);
                    handleFilterChange();
                  }}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Filter by Role</label>
              <Select
                value={filterRole}
                onValueChange={(value) => {
                  setFilterRole(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="editor">Editor</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Filter by Status</label>
              <Select
                value={filterStatus}
                onValueChange={(value) => {
                  setFilterStatus(value);
                  handleFilterChange();
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center gap-2 bg-transparent"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {paginatedUsers.length} of {filteredUsers.length} users
              {filteredUsers.length !== users.length &&
                ` (filtered from ${users.length} total)`}
            </span>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm">
                      {user.id}
                    </TableCell>
                    <TableCell className="font-medium">{`${user.firstname} ${user.lastname}`}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{getRoleBadge(user.role.name)}</TableCell>
                    <TableCell>{getStatusBadge(user.profile_status)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {user.profile_status === "normal" ? (
                            <DropdownMenuItem
                              onClick={() => handleBanUser(user.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Ban User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handleUnbanUser(user.id)}
                              className="text-green-600 dark:text-green-400"
                            >
                              <UserCheck className="mr-2 h-4 w-4" />
                              Unban User
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          {role === "admin" &&
                            [
                              { id: 2, label: "Admin" },
                              { id: 3, label: "Editor" },
                              { id: 1, label: "User" },
                            ].map((r) => (
                              <DropdownMenuItem
                                key={r.id}
                                onClick={() => handleChangeRole(user.id, r.id)}
                              >
                                <Shield className="mr-2 h-4 w-4" />
                                Make {r.label}
                              </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No users found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredUsers.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredUsers.length / itemsPerPage)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredUsers.length}
          />
        )}
      </div>
    </AdminLayout>
  );
}

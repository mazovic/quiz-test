"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/ui/pagination";
import {
  MoreHorizontal,
  Search,
  Plus,
  Edit,
  TrashIcon,
  BookOpen,
  Video,
  Link,
  ExternalLink,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { resourceAPI } from "@/lib/api";

export interface Resource {
  id: number;
  resource_type: "book" | "video" | "link";
  resource_level: "beginner" | "intermediate" | "advanced";
  resource_name: string;
  resource_url: string;
  resource_description: string;
  createdAt: string;
  updatedAt: string;
}

const resourceTypeIcons = {
  book: BookOpen,
  video: Video,
  link: Link,
};

const resourceLevelColors = {
  beginner: "bg-green-100 text-green-800",
  intermediate: "bg-yellow-100 text-yellow-800",
  advanced: "bg-red-100 text-red-800",
};

export default function ResourcePage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterLevel, setFilterLevel] = useState<string>("all");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );

  // Form states
  const [formData, setFormData] = useState({
    resource_name: "",
    resource_type: "book" as "book" | "video" | "link",
    resource_level: "beginner" as "beginner" | "intermediate" | "advanced",
    resource_url: "",
    resource_description: "",
  });

  const fetchResources = useCallback(async () => {
    try {
      const res = await resourceAPI.getAllResources();
      setResources(res.data.data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleAddResource = () => {
    setDialogMode("add");
    setSelectedResource(null);
    setFormData({
      resource_name: "",
      resource_type: "book",
      resource_level: "beginner",
      resource_url: "",
      resource_description: "",
    });
    setIsDialogOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setDialogMode("edit");
    setSelectedResource(resource);
    setFormData({
      resource_name: resource.resource_name,
      resource_type: resource.resource_type,
      resource_level: resource.resource_level,
      resource_url: resource.resource_url,
      resource_description: resource.resource_description,
    });
    setIsDialogOpen(true);
  };

  const handleDeleteResource = async (id: number) => {
    try {
      await resourceAPI.deleteResource(id);
      fetchResources();
    } catch (error) {
      console.error("Failed to delete resource:", error);
    }
  };

  const handleSaveResource = async () => {
    try {
      if (dialogMode === "add") {
        await resourceAPI.createResource(formData);
      } else {
        await resourceAPI.updateResource(selectedResource?.id, formData);
      }
      setIsDialogOpen(false);
      fetchResources();
    } catch (error) {
      console.error("Failed to save resource:", error);
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesName = resource.resource_name
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const matchesType =
        filterType === "all" || resource.resource_type === filterType;
      const matchesLevel =
        filterLevel === "all" || resource.resource_level === filterLevel;

      return matchesName && matchesType && matchesLevel;
    });
  }, [resources, searchName, filterType, filterLevel]);

  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredResources.slice(startIndex, endIndex);
  }, [filteredResources, currentPage, itemsPerPage]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resources</h1>
            <p className="text-muted-foreground">Manage learning resources</p>
          </div>
          <Button
            onClick={handleAddResource}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Resource
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search resources by name..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  handleFilterChange();
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="link">Link</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Level</label>
            <Select
              value={filterLevel}
              onValueChange={(value) => {
                setFilterLevel(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[120px]">Level</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[100px]">URL</TableHead>
                <TableHead className="w-[100px]">Created</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedResources.length > 0 ? (
                paginatedResources.map((resource) => {
                  const Icon = resourceTypeIcons[resource.resource_type];
                  return (
                    <TableRow key={resource.id}>
                      <TableCell className="font-mono text-sm">
                        {resource.id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {resource.resource_name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Icon className="h-4 w-4" />
                          <span className="capitalize">
                            {resource.resource_type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            resourceLevelColors[resource.resource_level]
                          }`}
                        >
                          {resource.resource_level}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p
                          className="truncate"
                          title={resource.resource_description}
                        >
                          {resource.resource_description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <a
                          href={resource.resource_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="text-xs">View</span>
                        </a>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(resource.createdAt)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleEditResource(resource)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Resource
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteResource(resource.id)}
                              className="text-red-600"
                            >
                              <TrashIcon className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No resources found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredResources.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredResources.length / itemsPerPage)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredResources.length}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Add Resource" : "Edit Resource"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Add a new learning resource to the system."
                  : "Edit the details of this resource."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="name"
                  className="text-right text-sm font-medium"
                >
                  Name
                </label>
                <Input
                  id="name"
                  value={formData.resource_name}
                  onChange={(e) =>
                    setFormData({ ...formData, resource_name: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="Enter resource name..."
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="type"
                  className="text-right text-sm font-medium"
                >
                  Type
                </label>
                <Select
                  value={formData.resource_type}
                  onValueChange={(value: "book" | "video" | "link") =>
                    setFormData({ ...formData, resource_type: value })
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="level"
                  className="text-right text-sm font-medium"
                >
                  Level
                </label>
                <Select
                  value={formData.resource_level}
                  onValueChange={(
                    value: "beginner" | "intermediate" | "advanced"
                  ) => setFormData({ ...formData, resource_level: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="url" className="text-right text-sm font-medium">
                  URL
                </label>
                <Input
                  id="url"
                  type="url"
                  value={formData.resource_url}
                  onChange={(e) =>
                    setFormData({ ...formData, resource_url: e.target.value })
                  }
                  className="col-span-3"
                  placeholder="https://example.com/resource"
                />
              </div>

              <div className="grid grid-cols-4 items-start gap-4">
                <label
                  htmlFor="description"
                  className="text-right text-sm font-medium mt-2"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={formData.resource_description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      resource_description: e.target.value,
                    })
                  }
                  className="col-span-3"
                  placeholder="Enter resource description..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveResource}
                disabled={
                  !formData.resource_name.trim() ||
                  !formData.resource_url.trim()
                }
              >
                {dialogMode === "add" ? "Add Resource" : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

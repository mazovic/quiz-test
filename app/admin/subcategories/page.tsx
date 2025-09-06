"use client";

import { AdminLayout } from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { MoreHorizontal, Search, Plus, Edit } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { categoryAPI } from "@/lib/api";
import type { Category } from "../categories/page";

interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  category: {
    id: number;
    name: string;
  };
}

export default function SubCategoryPage() {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] =
    useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedSubCategory, setSelectedSubCategory] =
    useState<SubCategory | null>(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [categories, setCategories] = useState<Category[]>([]);

  const fetchSubCategories = useCallback(async () => {
    try {
      const res = await categoryAPI.getSubCategoriesAdmin();
      setSubCategories(res.data.data);
      const catRes = await categoryAPI.getCategories();
      setCategories(catRes.data.data);
    } catch (error) {
      console.error("Failed to fetch subCategories:", error);
    }
  }, []);

  useEffect(() => {
    fetchSubCategories();
  }, [fetchSubCategories]);

  const handleAddSubCategory = () => {
    setDialogMode("add");
    setSelectedSubCategory(null);
    setSelectedCategoryId(null);
    setSubCategoryName("");
    setIsDialogOpen(true);
  };

  const handleEditSubCategory = (subCategory: SubCategory) => {
    setDialogMode("edit");
    setSelectedSubCategory(subCategory);
    setSubCategoryName(subCategory.name);
    setSelectedCategoryId(subCategory.category_id);

    setIsDialogOpen(true);
  };

  const handleSaveSubCategory = async () => {
    try {
      if (dialogMode === "add") {
        await categoryAPI.createSubCat(subCategoryName, selectedCategoryId);
        fetchSubCategories();
        console.log("Adding subCategory:", subCategoryName);
      } else {
        await categoryAPI.updateSubCat(
          selectedSubCategory?.id,
          subCategoryName,
          selectedCategoryId
        );
        console.log(
          "Updating subCategory:",
          selectedSubCategory?.id,
          "to:",
          subCategoryName
        );
      }
      setIsDialogOpen(false);
      fetchSubCategories(); // Refresh the list
    } catch (error) {
      console.error("Failed to save subCategory:", error);
    }
  };

  const filteredSubCategories = useMemo(() => {
    return subCategories.filter((subCategory) => {
      const matchesName = subCategory.name
        .toLowerCase()
        .includes(searchName.toLowerCase());

      const matchesCategory =
        selectedFilterCategory === "" ||
        subCategory.category_id.toString() === selectedFilterCategory;

      return matchesName && matchesCategory;
    });
  }, [subCategories, searchName, selectedFilterCategory]);

  const paginatedSubCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSubCategories.slice(startIndex, endIndex);
  }, [filteredSubCategories, currentPage, itemsPerPage]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">SubCategories</h1>
            <p className="text-muted-foreground">Manage subCategories</p>
          </div>
          <Button
            onClick={handleAddSubCategory}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add SubCategory
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search subCategories by name..."
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
            <label className="text-sm font-medium">Filter by Category</label>
            <Select
              value={selectedFilterCategory}
              onValueChange={(value) => {
                setSelectedFilterCategory(value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedSubCategories.length > 0 ? (
                paginatedSubCategories.map((subCategory) => (
                  <TableRow key={subCategory.id}>
                    <TableCell className="font-mono text-sm">
                      {subCategory.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {subCategory.name}
                    </TableCell>
                    <TableCell>{subCategory.category.name}</TableCell>
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
                            onClick={() => handleEditSubCategory(subCategory)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Update
                          </DropdownMenuItem>
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
                    No subCategories found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredSubCategories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredSubCategories.length / itemsPerPage)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredSubCategories.length}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add"
                  ? "Add SubCategory"
                  : "Update SubCategory"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Enter details for the new subCategory."
                  : "Update the subCategory details."}
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
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter subCategory name..."
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label
                  htmlFor="category"
                  className="text-right text-sm font-medium"
                >
                  Category
                </label>
                <Select
                  value={selectedCategoryId?.toString() || "all"}
                  onValueChange={(value) =>
                    setSelectedCategoryId(Number(value))
                  }
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveSubCategory}
                disabled={!subCategoryName.trim() || !selectedCategoryId}
              >
                {dialogMode === "add"
                  ? "Add SubCategory"
                  : "Update SubCategory"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

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
import { Pagination } from "@/components/ui/pagination";
import { MoreHorizontal, Search, Plus, Edit, TrashIcon } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { categoryAPI } from "@/lib/api";

export interface Category {
  id: number;
  name: string;
  description: string | null;
  questionCount: number;
}

export default function CategoryPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchName, setSearchName] = useState("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryName, setCategoryName] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const res = await categoryAPI.getCategories();
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleAddCategory = () => {
    setDialogMode("add");
    setSelectedCategory(null);
    setCategoryName("");
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setDialogMode("edit");
    setSelectedCategory(category);
    setCategoryName(category.name);
    setIsDialogOpen(true);
  };

  const handleDeleteQuestion = async (id: number) => {
    try {
      await categoryAPI.deleteCat(id);
      fetchCategories();
    } catch (error) {
      console.error("Failed to Delete question:", error);
    }
  };

  const handleSaveCategory = async () => {
    try {
      if (dialogMode === "add") {
        // Add new category logic here
        await categoryAPI.createCat(categoryName);
        fetchCategories();
        console.log("Adding category:", categoryName);
        // await categoryAPI.createCategory({ name: categoryName });
      } else {
        // Update category logic here
        await categoryAPI.updateCat(selectedCategory?.id, categoryName);
        console.log(
          "Updating category:",
          selectedCategory?.id,
          "to:",
          categoryName
        );
        // await categoryAPI.updateCategory(selectedCategory?.id, { name: categoryName });
      }
      setIsDialogOpen(false);
      fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Failed to save category:", error);
    }
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesName = category.name
        .toLowerCase()
        .includes(searchName.toLowerCase());

      return matchesName;
    });
  }, [categories, searchName]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCategories.slice(startIndex, endIndex);
  }, [filteredCategories, currentPage, itemsPerPage]);

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
            <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
            <p className="text-muted-foreground">Manage categories</p>
          </div>
          <Button
            onClick={handleAddCategory}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search by Name</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search categories by name..."
                value={searchName}
                onChange={(e) => {
                  setSearchName(e.target.value);
                  handleFilterChange();
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Question Count</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono text-sm">
                      {category.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>{category.questionCount}</TableCell>
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
                            onClick={() => handleEditCategory(category)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Update Name
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteQuestion(category.id)}
                          >
                            <TrashIcon className="mr-2 h-4 w-4" />
                            Delete
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
                    No categories found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredCategories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredCategories.length / itemsPerPage)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredCategories.length}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Add Category" : "Update Category Name"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Enter a name for the new category."
                  : "Enter a new name for this category."}
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
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  className="col-span-3"
                  placeholder="Enter category name..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveCategory}
                disabled={!categoryName.trim()}
              >
                {dialogMode === "add" ? "Add Category" : "Update Name"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

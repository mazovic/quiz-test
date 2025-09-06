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
  Delete,
  TrashIcon,
  X,
} from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import { categoryAPI, quizAPI } from "@/lib/api";
import type { SubCategory } from "../subcategories/page";

interface Question {
  id: number;
  question: string;
  options: string | string[]; // Can be either string or array from backend
  correctAnswer: string;
  difficulty: "easy" | "medium" | "hard";
  subCategoryId: number;
  subCategory?: {
    id: number;
    name: string;
    category: {
      id: number;
      name: string;
    };
  };
}

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuestion, setSearchQuestion] = useState("");
  const [selectedFilterSubCategory, setSelectedFilterSubCategory] =
    useState<string>("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  // Form fields
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState<string[]>(["", ""]); // Start with 2 empty options
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  );
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(null);

  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  const fetchQuestions = useCallback(async () => {
    try {
      // Replace with your actual API call
      const res = await quizAPI.getAllQuizzes();
      setQuestions(res.data.data);

      // Fetch subcategories for the dropdown
      const subCatRes = await categoryAPI.getSubCategoriesAdmin();
      setSubCategories(subCatRes.data.data);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleAddQuestion = () => {
    setDialogMode("add");
    setSelectedQuestion(null);
    setQuestionText("");
    setOptions(["", ""]); // Start with 2 empty options
    setCorrectAnswer("");
    setDifficulty("medium");
    setSelectedSubCategoryId(null);
    setIsDialogOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setDialogMode("edit");
    setSelectedQuestion(question);
    setQuestionText(question.question);
    const parsedOptions = parseOptionsToArray(question.options);
    // Ensure at least 2 options
    setOptions(parsedOptions.length < 2 ? ["", ""] : parsedOptions);
    setCorrectAnswer(question.correctAnswer);
    setDifficulty(question.difficulty);
    setSelectedSubCategoryId(question.subCategoryId);
    setIsDialogOpen(true);
  };

  const handleDeleteQuestion = async (question: Question) => {
    try {
      await quizAPI.delete(question.id);
      fetchQuestions();
    } catch (error) {
      console.error("Failed to Delete question:", error);
    }
  };

  const handleSaveQuestion = async () => {
    try {
      // Filter out empty options and ensure we have valid options
      const validOptions = options.filter((opt) => opt.trim() !== "");

      // Validate at least 2 options
      if (validOptions.length < 2) {
        alert("Please provide at least 2 options");
        return;
      }

      const questionData = {
        question: questionText,
        options: validOptions,
        correctAnswer: correctAnswer,
        difficulty: difficulty,
        subCategoryId: selectedSubCategoryId,
      };

      if (dialogMode === "add") {
        await quizAPI.createQuiz(questionData);
        console.log("Adding question with options:", questionData);
      } else {
        await quizAPI.updateQuiz(selectedQuestion?.id, questionData);
        console.log(
          "Updating question:",
          selectedQuestion?.id,
          "with options:",
          questionData
        );
      }

      setIsDialogOpen(false);
      fetchQuestions(); // Refresh the list
    } catch (error) {
      console.error("Failed to save question:", error);
    }
  };

  const parseOptionsToArray = (optionsData: string | string[]): string[] => {
    // If it's already an array, return it
    if (Array.isArray(optionsData)) {
      return optionsData;
    }

    // If it's a string, try to parse it as JSON
    if (typeof optionsData === "string") {
      try {
        const parsed = JSON.parse(optionsData);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      } catch {
        // If parsing fails, try comma-separated
        return optionsData.split(",").map((opt) => opt.trim());
      }
    }

    return [];
  };

  const parseOptionsForDisplay = (optionsData: string | string[]): string => {
    // If it's already an array, join and return
    if (Array.isArray(optionsData)) {
      return optionsData.filter((opt) => opt && opt.trim()).join(", ");
    }

    // If it's a string, try to parse it
    if (typeof optionsData === "string") {
      try {
        const parsed = JSON.parse(optionsData);
        if (Array.isArray(parsed)) {
          return parsed.filter((opt) => opt && opt.trim()).join(", ");
        }
      } catch {
        // If it's not valid JSON, return as is
        return optionsData;
      }
    }

    return "";
  };

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const filteredQuestions = useMemo(() => {
    return questions.filter((question) => {
      const matchesQuestion = question.question
        .toLowerCase()
        .includes(searchQuestion.toLowerCase());

      const matchesSubCategory =
        selectedFilterSubCategory === "" ||
        question.subCategoryId.toString() === selectedFilterSubCategory;

      const matchesDifficulty =
        selectedDifficulty === "" || question.difficulty === selectedDifficulty;

      return matchesQuestion && matchesSubCategory && matchesDifficulty;
    });
  }, [
    questions,
    searchQuestion,
    selectedFilterSubCategory,
    selectedDifficulty,
  ]);

  const paginatedQuestions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredQuestions.slice(startIndex, endIndex);
  }, [filteredQuestions, currentPage, itemsPerPage]);

  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Count non-empty options for validation
  const getValidOptionsCount = () => {
    return options.filter((opt) => opt.trim() !== "").length;
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Questions</h1>
            <p className="text-muted-foreground">Manage quiz questions</p>
          </div>
          <Button
            onClick={handleAddQuestion}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Question
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search Questions</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchQuestion}
                onChange={(e) => {
                  setSearchQuestion(e.target.value);
                  handleFilterChange();
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Filter by SubCategory</label>
            <Select
              value={selectedFilterSubCategory}
              onValueChange={(value) => {
                setSelectedFilterSubCategory(value === "all" ? "" : value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subcategories</SelectItem>
                {subCategories.map((subCategory) => (
                  <SelectItem
                    key={subCategory.id}
                    value={subCategory.id.toString()}
                  >
                    {subCategory.name} ({subCategory.category.name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Filter by Difficulty</label>
            <Select
              value={selectedDifficulty}
              onValueChange={(value) => {
                setSelectedDifficulty(value === "all" ? "" : value);
                handleFilterChange();
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="All difficulties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All difficulties</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="min-w-[200px]">Question</TableHead>
                <TableHead className="min-w-[150px]">Options</TableHead>
                <TableHead>Correct Answer</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>SubCategory</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedQuestions.length > 0 ? (
                paginatedQuestions.map((question) => (
                  <TableRow key={question.id}>
                    <TableCell className="font-mono text-sm">
                      {question.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div
                        className="max-w-xs truncate"
                        title={question.question}
                      >
                        {question.question}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-xs truncate"
                        title={parseOptionsForDisplay(question.options)}
                      >
                        {parseOptionsForDisplay(question.options)}
                      </div>
                    </TableCell>
                    <TableCell>{question.correctAnswer}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${
                          question.difficulty === "easy"
                            ? "bg-green-100 text-green-800"
                            : question.difficulty === "medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {question.difficulty}
                      </span>
                    </TableCell>
                    <TableCell>{question.subCategory?.name || "N/A"}</TableCell>
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
                            onClick={() => handleEditQuestion(question)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteQuestion(question)}
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
                    colSpan={7}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No questions found matching your search criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredQuestions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredQuestions.length / itemsPerPage)}
            onPageChange={handlePageChange}
            itemsPerPage={itemsPerPage}
            totalItems={filteredQuestions.length}
          />
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? "Add Question" : "Edit Question"}
              </DialogTitle>
              <DialogDescription>
                {dialogMode === "add"
                  ? "Enter details for the new question."
                  : "Update the question details."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="question" className="text-sm font-medium">
                  Question
                </label>
                <Textarea
                  id="question"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Enter the question..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">
                    Options ({getValidOptionsCount()} filled, min: 2, max: 10)
                  </label>
                  <Button
                    type="button"
                    onClick={addOption}
                    disabled={options.length >= 10}
                    size="sm"
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Option
                  </Button>
                </div>
                <div className="grid gap-2 max-h-[300px] overflow-y-auto pr-2">
                  {options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm font-medium min-w-[30px]">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      <Input
                        value={option}
                        onChange={(e) => updateOption(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(
                          65 + index
                        )}`}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        onClick={() => removeOption(index)}
                        disabled={options.length <= 2}
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Add between 2 and 10 options. Empty options will be removed
                  when saving.
                </p>
              </div>

              <div className="grid gap-2">
                <label htmlFor="correctAnswer" className="text-sm font-medium">
                  Correct Answer
                </label>
                <Input
                  id="correctAnswer"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  placeholder="Enter the correct answer..."
                />
                <p className="text-xs text-muted-foreground">
                  Must match one of the options exactly
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </label>
                  <Select
                    value={difficulty}
                    onValueChange={(value) =>
                      setDifficulty(value as "easy" | "medium" | "hard")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select difficulty..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <label htmlFor="subcategory" className="text-sm font-medium">
                    SubCategory
                  </label>
                  <Select
                    value={selectedSubCategoryId?.toString() || ""}
                    onValueChange={(value) =>
                      setSelectedSubCategoryId(Number(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory..." />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subCategory) => (
                        <SelectItem
                          key={subCategory.id}
                          value={subCategory.id.toString()}
                        >
                          {subCategory.name} ({subCategory.category.name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveQuestion}
                disabled={
                  !questionText.trim() ||
                  getValidOptionsCount() < 2 || // At least 2 filled options
                  !correctAnswer.trim() ||
                  !selectedSubCategoryId
                }
              >
                {dialogMode === "add" ? "Add Question" : "Update Question"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}

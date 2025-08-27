"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExternalLink, Book, Video, Link2, Search, Filter } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { resourceAPI } from "@/lib/api";

interface Resource {
  id: number;
  resource_type: "book" | "video" | "link";
  resource_level: "beginner" | "intermediate" | "advanced";
  resource_name: string;
  resource_url: string;
  resource_description: string | null;
  createdAt: string;
  updatedAt: string;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case "book":
      return <Book className="h-5 w-5 text-primary" />;
    case "video":
      return <Video className="h-5 w-5 text-primary" />;
    case "link":
      return <Link2 className="h-5 w-5 text-primary" />;
    default:
      return <Link2 className="h-5 w-5 text-primary" />;
  }
};

const getLevelBadgeVariant = (level: string) => {
  switch (level) {
    case "beginner":
      return "secondary";
    case "intermediate":
      return "default";
    case "advanced":
      return "destructive";
    default:
      return "secondary";
  }
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const mockData = await resourceAPI.getAllResources();

        setResources(mockData.data.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on search term, type, and level
  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.resource_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.resource_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ??
        false);
    const matchesType =
      selectedType === "all" || resource.resource_type === selectedType;
    const matchesLevel =
      selectedLevel === "all" || resource.resource_level === selectedLevel;

    return matchesSearch && matchesType && matchesLevel;
  });

  // Group resources by type
  const groupedResources = filteredResources.reduce((acc, resource) => {
    if (!acc[resource.resource_type]) {
      acc[resource.resource_type] = [];
    }
    acc[resource.resource_type].push(resource);
    return acc;
  }, {} as Record<string, Resource[]>);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
                <p className="text-lg text-muted-foreground">
                  Loading scores...
                </p>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2 text-balance">
              Programming Resources
            </h1>
            <p className="text-lg text-muted-foreground text-pretty">
              Discover curated books, videos, and links to enhance your
              programming and competitive programming skills
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Resource Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="book">Books</SelectItem>
                    <SelectItem value="video">Videos</SelectItem>
                    <SelectItem value="link">Links</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Difficulty Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {filteredResources.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground text-lg">
                  No resources found matching your criteria.
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="space-y-6 p-6">
                {Object.entries(groupedResources).map(
                  ([type, typeResources]) => (
                    <div key={type} className="space-y-4">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(type)}
                        <h3 className="text-lg font-semibold capitalize">
                          {type}s ({typeResources.length})
                        </h3>
                      </div>
                      <Separator />
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {typeResources.map((resource) => (
                          <Card
                            key={resource.id}
                            className="hover:shadow-md transition-all duration-200 hover:scale-[1.02] border-border"
                          >
                            <CardContent className="p-4">
                              <div className="space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                  <h4 className="font-semibold text-sm leading-tight text-card-foreground">
                                    {resource.resource_name}
                                  </h4>
                                  <Badge
                                    variant={getLevelBadgeVariant(
                                      resource.resource_level
                                    )}
                                    className="text-xs shrink-0"
                                  >
                                    {resource.resource_level}
                                  </Badge>
                                </div>
                                {resource.resource_description && (
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {resource.resource_description}
                                  </p>
                                )}
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full bg-transparent hover:bg-primary hover:text-primary-foreground transition-colors"
                                  onClick={() =>
                                    window.open(resource.resource_url, "_blank")
                                  }
                                >
                                  <ExternalLink className="h-3 w-3 mr-2" />
                                  View Resource
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

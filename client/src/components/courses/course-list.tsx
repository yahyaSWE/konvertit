import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  Search, 
  Filter, 
  BookOpen,
  Loader2 
} from "lucide-react";
import { Course } from "@shared/schema";
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export function CourseList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [levelFilter, setLevelFilter] = useState<string>("");

  const { data: courses, isLoading } = useQuery({
    queryKey: ['/api/courses'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <Card className="text-center p-8">
        <CardContent className="pt-6">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium">No courses available</p>
          <p className="text-muted-foreground mt-2">
            Check back later for new course offerings or contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Extract unique categories and levels for filters
  const categories = Array.from(new Set(courses.map((course: Course) => course.category)));
  const levels = Array.from(new Set(courses.map((course: Course) => course.level)));

  // Apply filters and search
  const filteredCourses = courses.filter((course: Course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? course.category === categoryFilter : true;
    const matchesLevel = levelFilter ? course.level === levelFilter : true;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  return (
    <div>
      <div className="mb-6">
        <CardTitle className="text-2xl mb-2">Explore Courses</CardTitle>
        <CardDescription>Discover new skills, subjects, and creative topics</CardDescription>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search courses..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Levels</SelectItem>
              {levels.map((level) => (
                <SelectItem key={level} value={level}>{level}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <p className="text-lg font-medium">No matching courses found</p>
            <p className="text-muted-foreground mt-2">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => {
                setSearchTerm("");
                setCategoryFilter("");
                setLevelFilter("");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course: Course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: Course & {
    author?: {
      id: number;
      fullName: string;
    };
  };
}

function CourseCard({ course }: CourseCardProps) {
  return (
    <Card className="course-card overflow-hidden">
      <div className="relative h-40 w-full">
        <img 
          src={course.imageUrl || `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=200&q=80`} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4">
          <Badge className="bg-primary/90">{course.category}</Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{course.title}</CardTitle>
          <Badge variant="outline" className="ml-2 bg-secondary/10 text-secondary border-0">
            {course.level}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-gray-600 line-clamp-2 mb-2">{course.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            <BookOpen className="h-4 w-4 mr-1" />
            {course.duration} weeks
          </span>
          <span className="mx-2">•</span>
          <span>{course.points} points</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-2">
        <div className="flex items-center">
          <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {course.author?.fullName?.charAt(0) || "I"}
          </div>
          <span className="text-sm text-gray-600 ml-2">{course.author?.fullName || "Instructor"}</span>
        </div>
        <Link href={`/courses/${course.id}`}>
          <Button size="sm">View Course</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

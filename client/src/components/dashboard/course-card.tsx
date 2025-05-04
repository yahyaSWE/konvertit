import { Link } from "wouter";
import { Enrollment } from "@shared/schema";

interface CourseCardProps {
  enrollment: Enrollment & { course: any };
}

export function CourseCard({ enrollment }: CourseCardProps) {
  const course = enrollment.course;
  
  return (
    <div className="course-card bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
      <div className="relative h-36 bg-gray-100">
        <img 
          src={course.imageUrl || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&h=200&q=80"} 
          alt={course.title} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
          <span className="text-sm font-medium bg-primary/80 px-2 py-1 rounded">{course.category}</span>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-poppins font-semibold text-lg text-textColor">{course.title}</h3>
          <span className="ml-2 flex-shrink-0 bg-secondary/10 text-secondary text-xs font-medium px-2 py-1 rounded">
            {enrollment.progress}% Complete
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        <div className="mb-4">
          <div className="progress-bar">
            <div className="progress-value" style={{ width: `${enrollment.progress}%` }}></div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
              {course.author?.fullName?.charAt(0) || "I"}
            </div>
            <span className="text-sm text-gray-600 ml-2">{course.author?.fullName || "Instructor"}</span>
          </div>
          <Link 
            href={`/courses/${course.id}`} 
            className="bg-primary text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Continue
          </Link>
        </div>
      </div>
    </div>
  );
}

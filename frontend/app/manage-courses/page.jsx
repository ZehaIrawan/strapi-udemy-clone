"use client";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ManageCoursesPage = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:1337/api/courses`);

        setCourses(response.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCourses();
  }, []);

  const handleDeleteCourse = async (documentId) => {
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    try {
      await axios.delete(
        `http://localhost:1337/api/courses/${documentId}`,
        config,
      );
      setCourses(courses.filter((course) => course.documentId !== documentId));

      toast({
        title: "Success",
        description: "Course deleted successfully",
        duration: 3000,
        variant: "success",
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-center p-24">
      <Navbar />
      <h1 className="text-3xl font-semibold mb-6">Manage courses</h1>
      <Button className="mb-6">Create new course</Button>
      <div className="flex flex-col items-start gap-6 w-1/2">
        {courses.map((course) => (
          <div className="py-12 pl-6 text-left w-full border text-card-foreground bg-white shadow-md rounded-md">
            <h2 className="text-xl font-semibold mb-4">{course.title}</h2>
            <Link
              href={`/manage-courses/${course.slug}`}
              key={course.documentId}
              className="text-blue-500 mr-6"
            >
              <Button>Edit</Button>
            </Link>
            <Button onClick={() => handleDeleteCourse(course.documentId)}>
              Delete
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCoursesPage;

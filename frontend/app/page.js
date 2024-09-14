"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

const AllCoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:1337/api/courses");
        const fetchedCourses = response.data.data;
        
        const groupedCourses = fetchedCourses.reduce((acc, course) => {
          const category = course.category || "Uncategorized";
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(course);
          return acc;
        }, {});

        setCourses(fetchedCourses);
        setCategories(groupedCourses);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
        <div className="text-2xl font-bold mt-6">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-24">
      <div>
        <Link href="/">Home</Link>
      </div>
      {!isLoading && courses.length === 0 ? (
        <div>There are no courses available</div>
      ) : (
        <div>
          {Object.keys(categories).map((category) => (
            <div key={category} className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-800">{category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {categories[category].map((course) => (
                  <a
                    href={`/course/${course.slug}`}
                    key={course.id}
                    className="group block"
                  >
                    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                      <div className="relative w-full h-auto">
                        <img
                          src={course.thumbnail}
                          alt={course.title}
                          className="group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="p-4">
                        <p className="text-lg font-semibold group-hover:text-blue-600">
                          {course.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          {course.description}
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCoursesPage;

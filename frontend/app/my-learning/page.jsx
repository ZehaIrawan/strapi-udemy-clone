"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import Loader from "@/components/Loader";
import CourseRatingDialog from "@/components/CourseRatingDialog";

const MyLearningPage = () => {
  const [courseProgresses, setCourseProgresses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const fetchCourseProgresses = async () => {
      try {
        const token = localStorage.getItem("token");

        const currentUser = JSON.parse(localStorage.getItem("user"));
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const response = await axios.get(`http://127.0.0.1:1337/api/course-progresses?filters[user][id][$eq]=${currentUser.id}&populate=course`,config);
        setCourseProgresses(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course progresses:", error);
        setIsLoading(false);
      }
    };

    fetchCourseProgresses();
  }, []);

  if (isLoading) {
    return <Loader />
  }

  return (
    <main className="flex flex-col px-24 pt-12 bg-white w-full">
      <Navbar />
      <h1 className="text-3xl font-bold my-6">My Learning</h1>
      {courseProgresses.length === 0 ? (
        <p>You haven't started any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courseProgresses.map((progress) => (
            <div key={progress.id} className="border rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold">{progress.course.title}</h2>
              <p>Progress: {progress.progressPercentage}%</p>

              <div className="flex justify-between items-center mt-4">
                <Link
                  href={`/my-learning/${progress.course.slug}`}
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Continue Learning
              </Link>
              <CourseRatingDialog
                  selectedCourse={progress.course}
                  setSelectedCourse={setSelectedCourse}
                  setCourseProgresses={setCourseProgresses}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

export default MyLearningPage;

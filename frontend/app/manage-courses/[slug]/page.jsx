"use client";
import CourseForm from '@/components/CourseForm';
import Navbar from "@/components/Navbar";
import axios from "axios";

async function getCourseBySlug(slug) {
  try {
    const response = await axios.get("http://127.0.0.1:1337/api/courses", {
      params: {
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: {
          sections: {
            populate: "lectures",
          },
        },
      },
    });

    const course = response.data.data[0];
    return course || null;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export default async function EditCoursePage({ params}) {
  const course = await getCourseBySlug(params.slug);

  if (!course) {
    return (
      <div>
        <h1>We can’t find the page you’re looking for</h1>
        <a href="/">Go back</a>
      </div>
    );
  }

  return (
    <main className="flex flex-col p-24">
      <Navbar />
      <CourseForm existingCourse={course}/>
    </main>
  );
}
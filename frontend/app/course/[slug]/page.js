"use client";
import axios from "axios";
import Accordion from "@/components/Accordion";
import Link from "next/link";

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

export default async function Page({ params }) {
  const course = await getCourseBySlug(params.slug);
  if (!course) {
    return (
      <div>
        <h1>We can’t find the page you’re looking for</h1>
        <a href="/">Go back</a>
      </div>
    );
  }

  const getTotalLectures = () => {
    return course.sections.reduce(
      (total, section) => total + section.lectures.length,
      0,
    );
  };

  const getTotalLecturesDuration = () => {
    const totalSeconds = course.sections.reduce((total, section) => {
      console.log(section.lectures,'section');
      const sectionDuration = section.lectures[0].duration
      return total + sectionDuration;
    }, 0);
    return secondsToHMS(totalSeconds);
  };

  function secondsToHMS(duration) {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;

    const hoursStr = hours > 0 ? `${hours}:` : "";
    const minutesStr =
      minutes > 0 || hours > 0 ? String(minutes).padStart(2, "0") + ":" : "";
    const secondsStr = String(seconds).padStart(2, "0") 

    return `${hoursStr}${minutesStr}${secondsStr}`;
  }

  return (
    <main className="flex justify-center pt-16 bg-white ">
      <div className="max-w-5xl w-full p-8">
        <div>
          <Link href="/" className="mb-6 text-blue-500 hover:underline">
            Home
          </Link>
          <h1 className="text-4xl mb-6 font-bold text-gray-900">
            {course.title}
          </h1>

          <p className="text-lg text-gray-700 mb-8">{course.description}</p>

          <h2 className="text-2xl font-bold mt-8 text-gray-800 pb-2">
            Course Content
          </h2>

          <ul className="flex gap-6 items-center text-sm text-gray-800 mt-4">
            <li className="list-none">
              {`${course.sections.length} sections`}
            </li>
            <li className="list-disc">{`${getTotalLectures()} lectures`}</li>
            <li className="list-disc">
              
              {`${getTotalLecturesDuration()} total length`}
            </li>
          </ul>

            <Accordion course={course} secondsToHMS={secondsToHMS}/>
        </div>
      </div>
    </main>
  );
}
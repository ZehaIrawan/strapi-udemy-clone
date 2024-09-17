"use client";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function WatchCoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [userProgress, setUserProgress] = useState([]);
  const [completedLectures, setCompletedLectures] = useState([]);
  const [courseProgressId, setCourseProgressId] = useState(null);
  const router = useRouter();
  const [selectedVideoId, setSelectedVideoId] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setSelectedVideoId(course?.sections[0]?.lectures[0]?.videoURL);
  }, [course]);

  useEffect(() => {
    const fetchCourseAndProgress = async () => {
      try {
        const courseResponse = await axios.get(
          "http://127.0.0.1:1337/api/courses",
          {
            params: {
              filters: {
                slug: {
                  $eq: params.courseSlug,
                },
              },
              populate: {
                sections: {
                  populate: "lectures",
                },
              },
            },
          },
        );
        const courseData = courseResponse.data.data[0];
        setCourse(courseData);
        setIsLoading(false);
        const token = localStorage.getItem("token");
        const currentUser = localStorage.getItem("user");
        const currentUserId = JSON.parse(currentUser).id;
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };
        const userProgressResponse = await axios.get(
          `http://127.0.0.1:1337/api/course-progresses?filters[user][id][$eq]=${currentUserId}`,
          {
            ...config,
          },
        );

        const userProgressData = userProgressResponse.data.data;
        setUserProgress(userProgressData);
        setCourseProgressId(userProgressData[0]?.documentId);

        const completedLecturesData =
          userProgressData?.[0]?.completedLectures || [];
        setCompletedLectures(completedLecturesData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCourseAndProgress();
  }, [params.courseSlug]);

  const handleCheckboxChange = useCallback(
    async (lectureId, isChecked) => {
      try {
        const token = localStorage.getItem("token");
        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        let updatedCompletedLectures;
        if (isChecked) {
          updatedCompletedLectures = [...completedLectures, lectureId];
        } else {
          updatedCompletedLectures = completedLectures.filter(
            (id) => id !== lectureId,
          );
        }

        const totalLectures =
          course?.sections.reduce(
            (acc, section) => acc + section.lectures.length,
            0,
          ) || 0;
        const completedCount = updatedCompletedLectures.length;

        await axios.put(
          `http://127.0.0.1:1337/api/course-progresses/${courseProgressId}`,
          {
            data: {
              completedLectures: updatedCompletedLectures,
              progressPercentage: Math.round(
                (completedCount / totalLectures) * 100,
              ),
            },
          },
          config,
        );

        setCompletedLectures(updatedCompletedLectures);
      } catch (error) {
        console.error("Error updating course progress:", error);
      }
    },
    [completedLectures, courseProgressId],
  );

  if (!isLoading && !course) {
    return (
      <div>
        <h1>We can’t find the page you’re looking for</h1>
        <a href="/">Go back</a>
      </div>
    );
  }

  const handleSelectLecture = (videoId) => {
    setSelectedVideoId(videoId);
  };

  if (isLoading) return <Loader />;

  if (!course.isPurchased) {
    router.push(`/`);
  }

  return (
    <main className="flex flex-col pt-4 px-24 h-screen">
      <Navbar />
      <div className="flex justify-between w-full gap-12 pt-12 h-full">
        <div className="flex flex-col h-full justify-start w-full">
          <div className="w-full max-h-full h-3/4 ">
            <iframe
              className="block"
              width="100%"
              height="100%"
              src={selectedVideoId}
              title="Ultimate Guide To Web Scraping - Node.js &amp; Python (Puppeteer &amp; Beautiful Soup)"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
            ></iframe>
          </div>
          <div>
            <h1 className="text-3xl mb-4 font-semibold">{course.name}</h1>
            <p className="">{course.description}</p>
          </div>
        </div>
        <div className="w-1/4">
          {course.sections.length > 0 &&
            course.sections.map((section) => {
              return (
                <div key={section.id} className="">
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <ul className="list-disc">
                    {section.lectures.length > 0 &&
                      section.lectures.map((lecture) => {
                        const isCompleted = completedLectures.includes(
                          lecture.documentId,
                        );
                        return (
                          <li
                            className="flex items-center gap-6 mb-4 hover:bg-gray-400 p-2 rounded-md cursor-pointer"
                            key={lecture.id}
                            onClick={() =>
                              handleSelectLecture(lecture.videoURL)
                            }
                          >
                            {lecture.title}
                            <Checkbox
                              checked={isCompleted}
                              className="h-6 w-6"
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(
                                  lecture.documentId,
                                  checked,
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                            />
                          </li>
                        );
                      })}
                  </ul>
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}

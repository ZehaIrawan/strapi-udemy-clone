import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  handleAddNewSection,
  handleDeleteSection,
  handleSaveSection,
  handleChangeSection,
} from "@/lib/sectionUtils";
import {
  handleAddLecture,
  handleChangeLecture,
  handleDeleteLecture,
  handleSaveLecture,
} from "@/lib/lectureUtils";

export default function CourseForm({ onClose, setCourses, existingCourse }) {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
    thumbnail: "",
    sections: [],
  });

  useEffect(() => {
    if (existingCourse) {
      setFormData({
        title: existingCourse.title,
        description: existingCourse.description,
        slug: existingCourse.slug,
        thumbnail: existingCourse.thumbnail,
        sections: existingCourse.sections
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
          .map((section) => ({
            ...section,
            lectures: section.lectures
              ? section.lectures
                  .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                  .map((lecture) => ({
                    ...lecture,
                    documentId: lecture.documentId,
                  }))
              : [],
          })),
      });
    }
  }, [existingCourse]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    const payload = {
      title: formData.title,
      description: formData.description,
      slug: formData.slug,
      thumbnail: formData.thumbnail,
    }

    try {
      if (existingCourse) {
        const res = await axios.put(
          `http://127.0.0.1:1337/api/courses/${existingCourse.documentId}`,
          { data: payload },
          config,
        );
        toast({
          title: "Success",
          description: "Course updated successfully",
          duration: 3000,
          variant: "success",
        });
        router.push(`/manage-courses`);
      } else {
        const res = await axios.post(
          "http://127.0.0.1:1337/api/courses",
          { data: payload },
          config,
        );
        toast({
          title: "Success",
          description: "Course created successfully",
          duration: 3000,
          variant: "success",
        });
        setCourses((courses) => [...courses, res.data.data]);
        onClose();
      }
    } catch (error) {
      console.error("Error creating/editing course:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Course Name
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Slug
          </label>
          <input
            type="text"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Thumbnail
          </label>
          <input
            type="text"
            name="thumbnail"
            value={formData.thumbnail}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
          />
        </div>
        <div className="flex justify-end">
          {!existingCourse && (
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            {existingCourse ? "Update Course" : "Create Course"}
          </button>
        </div>
      </form>

      <Accordion type="single" collapsible className="w-full">
        {formData.sections.map((section, sectionIndex) => (
          <AccordionItem key={sectionIndex} value={`section-${sectionIndex}`}>
            <h2 className="text-2xl font-bold">Section</h2>
            <AccordionTrigger className="text-left">
              {section.title || `Section ${sectionIndex + 1}`}
            </AccordionTrigger>
            <AccordionContent>
              <div className="mb-4">
                <input
                  value={section.title}
                  onChange={(e) =>
                    handleChangeSection(
                      setFormData,
                      sectionIndex,
                      e.target.value,
                    )
                  }
                  className="shadow appearance-none border rounded w-full py-2 my-2 px-3 text-gray-700"
                  placeholder="Section title"
                />
                <div className="flex justify-end space-x-2 mt-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleSaveSection(
                        formData,
                        setFormData,
                        sectionIndex,
                        existingCourse.documentId,
                        toast,
                      )
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save Section
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteSection(
                        formData,
                        setFormData,
                        sectionIndex,
                        toast,
                      )
                    }
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete Section
                  </button>
                </div>

                <Accordion type="single" collapsible className="mt-4 ml-6">
                  {section.lectures &&
                    section.lectures.map((lecture, lectureIndex) => (
                      <AccordionItem
                      key={lectureIndex}
                      value={`lecture-${sectionIndex}-${lectureIndex}`}
                      >
                      <h2 className="text-xl font-bold">Lecture</h2>
                        <AccordionTrigger className="text-left">
                          {lecture.title || `Lecture ${lectureIndex + 1}`}
                        </AccordionTrigger>
                        <AccordionContent>
                          <input
                            value={lecture.title}
                            onChange={(e) =>
                              handleChangeLecture(
                                setFormData,
                                sectionIndex,
                                lectureIndex,
                                "title",
                                e.target.value,
                              )
                            }
                            className="shadow appearance-none border rounded w-full py-2 my-2 px-3 text-gray-700"
                            placeholder="Lecture Title"
                          />
                          <input
                            value={lecture.videoURL}
                            onChange={(e) =>
                              handleChangeLecture(
                                setFormData,
                                sectionIndex,
                                lectureIndex,
                                "videoURL",
                                e.target.value,
                              )
                            }
                            className="shadow appearance-none border rounded w-full py-2 my-2 px-3 text-gray-700"
                            placeholder="Video URL"
                          />
                          <input
                            type="number"
                            value={lecture.duration}
                            onChange={(e) =>
                              handleChangeLecture(
                                setFormData,
                                sectionIndex,
                                lectureIndex,
                                "duration",
                                parseInt(e.target.value, 10),
                              )
                            }
                            className="shadow appearance-none border rounded w-full py-2 my-2 px-3 text-gray-700"
                            placeholder="Duration (in seconds)"
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleSaveLecture(
                                  setFormData,
                                  formData,
                                  toast,
                                  sectionIndex,
                                  lectureIndex,
                                )
                              }
                              className="bg-blue-500 text-white px-4 py-2 rounded"
                            >
                              Save Lecture
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                handleDeleteLecture(
                                  setFormData,
                                  formData,
                                  toast,
                                  sectionIndex,
                                  lectureIndex,
                                  formData,
                                )
                              }
                              className="bg-red-500 text-white px-4 py-2 rounded"
                            >
                              Delete Lecture
                            </button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>

                <button
                  type="button"
                  onClick={() => handleAddLecture(setFormData, sectionIndex)}
                  className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
                >
                  Add Lecture
                </button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <button
        type="button"
        onClick={() => handleAddNewSection(setFormData)}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Add new section
      </button>
    </div>
  );
}

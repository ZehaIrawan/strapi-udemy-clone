import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

export default function CourseForm({ onClose, setCourses, existingCourse }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    slug: "",
  });


  useEffect(() => {
    if (existingCourse) {
      setFormData({
        title: existingCourse.title,
        description: existingCourse.description,
        slug: existingCourse.slug,
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

    try {
      if (existingCourse) {
        const res = await axios.put(
          `http://127.0.0.1:1337/api/courses/${existingCourse.documentId}`,
          { data: formData },
          config,
        );
        onClose(); 
        toast({
          title: "Success",
          description: "Course updated successfully",
          duration: 3000,
          variant: "success",
        });
      
      } else {
        const res = await axios.post(
          "http://127.0.0.1:1337/api/courses",
          { data: formData },
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
  );
}

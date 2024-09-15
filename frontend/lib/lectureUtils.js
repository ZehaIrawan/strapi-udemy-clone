import axios from "axios";

export const handleAddLecture = (setFormData,sectionIndex) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    sections: prevFormData.sections.map((section, index) =>
      index === sectionIndex
        ? {
            ...section,
            lectures: [
              ...(section.lectures || []),
              { title: "", videoURL: "", duration: 0 },
            ],
          }
        : section,
    ),
  }));
};

export const handleChangeLecture = (setFormData,sectionIndex, lectureIndex, field, value) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    sections: prevFormData.sections.map((section, index) =>
      index === sectionIndex
        ? {
            ...section,
            lectures: section.lectures.map((lecture, idx) =>
              idx === lectureIndex ? { ...lecture, [field]: value } : lecture,
            ),
          }
        : section,
    ),
  }));
};

export const handleDeleteLecture = async (setFormData,formData,toast,sectionIndex, lectureIndex) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const lecture = formData.sections[sectionIndex].lectures[lectureIndex];

  try {
    if (lecture.id) {
      await axios.delete(
        `http://127.0.0.1:1337/api/lectures/${lecture.documentId}`,
        config,
      );
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      sections: prevFormData.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              lectures: section.lectures.filter(
                (_, idx) => idx !== lectureIndex,
              ),
            }
          : section,
      ),
    }));
    toast({
      title: "Success",
      description: "Lecture deleted successfully!",
      duration: 3000,
    });
  } catch (error) {
    console.error("Error deleting lecture:", error);
    toast({
      title: "Error",
      description: "Error deleting lecture. Please try again.",
      variant: "destructive",
      duration: 3000,
    });
  }
};

export const handleSaveLecture = async (setFormData,formData,toast,sectionIndex, lectureIndex) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const lecture = formData.sections[sectionIndex].lectures[lectureIndex];
  const lecturePayload = {
    title: lecture.title,
    videoURL: lecture.videoURL,
    duration: lecture.duration,
    section: {
      connect: [formData.sections[sectionIndex].documentId],
    },
  };

  try {
    let res;
    if (lecture.documentId) {
      res = await axios.put(
        `http://127.0.0.1:1337/api/lectures/${lecture.documentId}`,
        { data: lecturePayload },
        config
      );
    } else {
      res = await axios.post(
        "http://127.0.0.1:1337/api/lectures",
        { data: lecturePayload },
        config
      );
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      sections: prevFormData.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              lectures: section.lectures.map((lec, j) =>
                j === lectureIndex
                  ? { ...lec, documentId: res.data.data.id }
                  : lec
              ),
            }
          : section
      ),
    }));

    toast({
      title: "Success",
      description: lecture.documentId ? "Lecture updated successfully!" : "Lecture saved successfully!",
      duration: 3000,
      variant: "success",
    });
  } catch (error) {
    console.error("Error saving/updating lecture:", error);
    toast({
      title: "Error",
      description: "Error saving/updating lecture. Please try again.",
      variant: "destructive",
      duration: 3000,
    });
  }
};
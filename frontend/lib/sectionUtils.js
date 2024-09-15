import axios from "axios";

export const handleAddNewSection = (setFormData) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    sections: [...prevFormData.sections, { title: "" }],
  }));
};

export const handleDeleteSection = async (formData, setFormData, index,toast) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const sectionId = formData.sections[index].documentId;
  await axios.delete(
    `http://127.0.0.1:1337/api/sections/${sectionId}`,
    config,
  );
  setFormData((prevFormData) => ({
    ...prevFormData,
    sections: prevFormData.sections.filter((section, i) => i !== index),
  }));
  toast({
    title: "Success",
    description: "Section deleted successfully!",
    duration: 3000,
    variant: "success",
  });
};

export const handleChangeSection = (setFormData,index, value) => {
  setFormData((prevFormData) => ({
    ...prevFormData,
    sections: prevFormData.sections.map((section, i) =>
      i === index ? { ...section, title: value } : section,
    ),
  }));
};

export const handleSaveSection = async (formData,setFormData,index,existingCourseId,toast) => {
  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const section = formData.sections[index];
  const sectionPayload = {
    title: section.title,
    course: {
      connect: [existingCourseId],
    },
  };

  try {
    let res;
    if (section.documentId) {
      res = await axios.put(
        `http://127.0.0.1:1337/api/sections/${section.documentId}`,
        { data: sectionPayload },
        config,
      );
    } else {
      res = await axios.post(
        "http://127.0.0.1:1337/api/sections",
        { data: sectionPayload },
        config,
      );
    }

    setFormData((prevFormData) => ({
      ...prevFormData,
      sections: prevFormData.sections.map((s, i) =>
        i === index ? { ...s, documentId: res.data.data.id } : s,
      ),
    }));

    toast({
      title: "Success",
      description: section.documentId
        ? "Section updated successfully!"
        : "Section saved successfully!",
      duration: 3000,
      variant: "success",
    });
  } catch (error) {
    console.error("Error saving/updating section:", error);
    toast({
      title: "Error",
      description: "Error saving/updating section. Please try again.",
      variant: "destructive",
      duration: 3000,
    });
  }
};

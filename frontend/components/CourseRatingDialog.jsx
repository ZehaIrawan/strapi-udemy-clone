import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import axios from "axios";

const CourseRatingDialog = ({
  selectedCourse,
  setSelectedCourse,
  setCourseProgresses,
}) => {
  const [rating, setRating] = useState(0);
  const [tempRating, setTempRating] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const getRatingText = (rating) => {
    switch (rating) {
      case 1:
        return "Very Bad";
      case 2:
        return "Bad";
      case 3:
        return "Good";
      case 4:
        return "Great";
      case 5:
        return "Excellent";
      default:
        return "Rate this course";
    }
  };

  const handleStarClick = (star) => {
    setRating(star);
    setTempRating(star);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setSelectedCourse(selectedCourse);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedCourse(null);
    setRating(0);
    setTempRating(0);
  };

  const handleRating = async () => {
    if (!selectedCourse || !rating) return;

    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      await axios.post(
        "http://localhost:1337/api/ratings",
        {
          data: {
            course: selectedCourse.id,
            rating: rating,
          },
        },
        config,
      );
      setCourseProgresses((prevProgresses) =>
        prevProgresses.map((progress) =>
          progress.course.id === selectedCourse.id
            ? { ...progress, userRating: rating }
            : progress,
        ),
      );

      setSelectedCourse(null);
      setRating(0);
      setTempRating(0);
      handleClose();
    } catch (error) {
      console.error("Error saving rating:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={handleOpen}>Leave a rating</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rate this course</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center">
          <h2 className="text-xl mb-4">{selectedCourse?.title}</h2>
          <div className="flex flex-col items-center mb-4">
            <div className="flex mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-8 w-8 cursor-pointer ${
                    star <= (tempRating || rating || 0)
                      ? "text-yellow-400 fill-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => setTempRating(star)}
                  onMouseLeave={() => setTempRating(rating)}
                />
              ))}
            </div>
            <span className="text-sm">{getRatingText(tempRating)}</span>
          </div>
          <Button className="px-4 py-2" onClick={handleRating}>Submit Rating</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseRatingDialog;

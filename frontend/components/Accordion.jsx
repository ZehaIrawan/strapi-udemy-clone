"use client";
import { useState } from 'react';

const Accordion = ({ course,secondsToHMS }) => {
  const [openSectionIndex, setOpenSectionIndex] = useState(0);

  const toggleSection = (index) => {
    setOpenSectionIndex(openSectionIndex === index ? null : index);
  };

  return (
    <div className='border border-gray-300 mt-2'>
      {course.sections.length > 0 &&
        course.sections.map((section, index) => {
          const isOpen = openSectionIndex === index;
          return (
            <div key={section.id}>
              <div
                className="flex justify-between items-center cursor-pointer bg-gray-100 p-4 border-b border-gray-300"
                onClick={() => toggleSection(index)}
              >
                <h3 className="text-xl font-semibold text-gray-800">
                  {section.title}
                </h3>
                <span className={`text-sm text-gray-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
                  ▼
                </span>
              </div>
              {isOpen && (
                <ul className="list-disc text-gray-700">
                  {section.lectures.length > 0 &&
                    section.lectures.map((lecture) => (
                      <li key={lecture.id} className="flex justify-between mt-1 py-6 px-12">
                        <span> {lecture.title}</span>
                        <span className="text-sm text-gray-500">
                          {secondsToHMS(lecture.duration)}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Accordion;
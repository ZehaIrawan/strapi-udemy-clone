import React from "react";

export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-1/3">
        <button
          onClick={onClose}
          className="text-black float-right font-bold"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
}
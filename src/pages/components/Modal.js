import React, { useEffect, useState } from "react";

const Modal = ({ emailContent, selectedEmail, onClose, children }) => {
  console.log(emailContent);
  const [decodedPlainText, setDecodedPlainText] = useState(null);

  useEffect(() => {
    const decodePlainText = (encodedMessage) => {
      console.log(encodedMessage, "msg");
      try {
        const decodedMessage = atob(encodedMessage);
        console.log(decodedMessage, "hello");
        return decodedMessage;
      } catch (error) {
        // console.error("Error decoding plain text message:", error);
        return null;
      }
    };

    const plainTextPart = emailContent?.payload.parts.find(
      (part) => part.mimeType === "text/plain"
    );
    const decodedPlainText = plainTextPart
      ? decodePlainText(plainTextPart.body.data)
      : null;

    setDecodedPlainText(decodedPlainText);
  }, [emailContent]);
  console.log(decodedPlainText);

  // if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      {/* Modal container */}
      <div className="relative w-auto max-w-lg mx-auto my-6">
        {/* Modal content */}
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Modal Title</h3>
            <button
              // onClick={handleCloseModal}
              className="text-gray-500 hover:text-gray-600 focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          {/* Body */}
          <div className="p-4">{children}</div>
          {/* Footer */}
          <div className="flex justify-end px-4 py-2 border-t border-gray-200">
            <button
              // onClick={handleCloseModal}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;

"use client";

import { useState } from "react";

export default function ValidatedEmailInput({ value, onChange, placeholder }) {
  const [emailError, setEmailError] = useState(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    onChange(email);

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
    } else {
      setEmailError(null);
    }
  };

  return (
    <div>
      <input
        type="email"
        placeholder={placeholder || "Email"}
        value={value}
        onChange={handleEmailChange}
        className={`w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none ${
          emailError === null && value !== ""
            ? "border-2 border-green-500"
            : emailError
              ? "border-2 border-red-500"
              : "border-2 border-gray-700"
        }`}
      />
      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
    </div>
  );
}

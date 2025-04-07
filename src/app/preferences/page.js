"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Button from "../components/Button";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function PreferencesPage() {
  const [userPreferencesData, setUserPreferencesData] = useState(null);
  const [genderPref, setGenderPref] = useState(0);
  const [ageRange, setAgeRange] = useState([18, 90]);
  const [distance, setDistance] = useState(99);

  useEffect(() => {
    const fetchUserPrefData = async () => {
      try {
        const response = await fetch("/api/preferences");
        if (!response.ok)
          throw new Error("Failed to fetch user Preferences data");
        const data = await response.json();
        console.log("fetching user Preferences data", data);
        setAgeRange([data.ageStart, data.ageEnd]);
        setDistance(data.distance);
        setGenderPref(data.gender);
        setUserPreferencesData(data);
      } catch (error) {
        console.error("Error fetching user Preferences data:", error);
      }
    };
    fetchUserPrefData();
  }, []);

  const handleSave = async () => {
    try {
      const updatedPreferences = {
        gender: genderPref,
        ageStart: ageRange[0],
        ageEnd: ageRange[1],
        distance: parseInt(distance),
      };

      console.log("Saving user data:", updatedPreferences);

      const response = await fetch("/api/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPreferences),
      });

      if (!response.ok) throw new Error("Failed to save user data");

      const receivedResp = await response.json();
      console.log("After Saving user data:", receivedResp);

      setUserPreferencesData(updatedPreferences); // Update state after successful save
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <>
      <header className="block w-full">
        <Navbar />
      </header>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-extrabold text-yellow-500 mb-8">
            Preferences
          </h1>
          <p className="text-lg dark:text-white text-gray-600 mb-12">
            Please edit these preferences for your getting better matches.
          </p>

          <div className="text-lg dark:text-white text-gray-600 mb-12">
            I’m interested in...
            <div className="flex items-center justify-center mb-12">
              <div className="relative w-80 h-10 bg-gray-200 rounded-full">
                <div
                  className={`absolute top-0 left-0 h-full w-1/3 bg-yellow-500 rounded-full transition-transform duration-300 ${
                    genderPref === "Men"
                      ? "translate-x-0"
                      : genderPref === "Women"
                        ? "translate-x-full"
                        : "translate-x-[200%]"
                  }`}
                ></div>
                <div className="absolute inset-0 flex justify-between items-center px-4">
                  {["Men", "Women", "Everyone"].map((option, index) => (
                    <button
                      key={option}
                      className={`text-gray-600 font-medium focus:outline-none px-5 w-1/3 ${
                        index === 0 ? "pl-0" : ""
                      }`}
                      onClick={() => setGenderPref(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="text-lg dark:text-white text-gray-600 mb-12">
            <div className="text-lg dark:text-white text-gray-600 mb-2">
              Distance:
            </div>
            <div className="flex flex-col items-center mt-4 border border-solid border-amber-400 rounded-lg p-8 mb-12">
              <span className="mt-2 text-gray-600 dark:text-white">
                Selected Distance: {distance}
              </span>
              <input
                type="range"
                min="0"
                max="100"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #d19e0b ${(distance / 100) * 100}%, #e5e7eb ${(distance / 100) * 100}%)`,
                }}
              />
            </div>
          </div>

          <div className="text-lg dark:text-white text-gray-600 mb-12">
            <div className="text-lg dark:text-white text-gray-600 mb-2">
              Age:
            </div>
            <div className="flex flex-col items-center mt-4 border border-solid border-amber-400 rounded-lg p-8 mb-12">
              <span className="mt-2 text-gray-600 dark:text-white">
                Selected Range: {ageRange[0]} - {ageRange[1]}
              </span>
              <RangeSlider
                min={18}
                max={100}
                step={1}
                value={ageRange}
                onInput={setAgeRange}
                className="w-full h-2 bg-amber-200 background rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>
          </div>

          <div className="mt-12 flex gap-6">
            <Button onClick={handleSave}>Apply</Button>
            <Button variant="outline">Cancel</Button>
          </div>
        </div>
      </div>
    </>
  );
}

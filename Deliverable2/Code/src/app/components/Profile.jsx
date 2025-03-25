"use client";
import React, { useState } from "react";
import AvatarUploader from "./AvatarUploader";
import EditableField from "./EditableField";
import SocialLinksEditor from "./SocialLinksEditor";
import MultiSelectDropdown from "./MultiSelectDropdown";
import Badge from "./Badge";
import Button from "./Button";
import Card from "./Card";

const mockUserData = {
  username: "adventureseeker",
  fullName: "Sarah Johnson",
  birthdate: "1990-05-15",
  location: "Denver, CO",
  languages: ["English", "Spanish"],
  bio: "Outdoor enthusiast who loves hiking, skiing, and backpacking.",
  profilePic: "/sj-pic.jpg",
  socialMedia: {
    instagram: "https://instagram.com/adventureseeker",
    twitter: "https://twitter.com/adventureseeker",
    linkedin: "https://linkedin.com/in/adventureseeker",
  },
  adventureTypes: ["Hiking", "Backpacking", "Skiing"],
  attitude: ["Adventurous", "Easy-Going", "Spontaneous"],
  skillLevel: "Intermediate",
};

const languageOptions = [
  "English",
  "Spanish",
  "Mandarin",
  "Hindi",
  "French",
  "Arabic",
  "Bengali",
  "Russian",
  "Portuguese",
  "German",
];

const adventureOptions = ["Hiking", "Backpacking", "Skiing", "Climbing"];
const attitudeOptions = [
  "Adventurous",
  "Easy-Going",
  "Spontaneous",
  "Fearless",
  "Open-Minded",
  "Curious",
  "Energetic",
  "Optimistic",
  "Resilient",
  "Independent",
  "Free-Spirited",
  "Social",
  "Flexible",
  "Nature-Loving",
  "Bold",
];

const skillLevelOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

export default function ProfilePage() {
  const {
    username,
    fullName,
    birthdate,
    location,
    languages,
    bio,
    profilePic,
    socialMedia,
    skillLevel,
  } = mockUserData;

  const [selectedAdventures, setSelectedAdventures] = useState(
    mockUserData.adventureTypes,
  );
  const [selectedAttitudes, setSelectedAttitudes] = useState([
    ...mockUserData.attitude,
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState(languages);
  const [birthDate, setBirthDate] = useState(birthdate);
  const [cityState, setCityState] = useState(location);
  const [profilePicture, setProfilePicture] = useState(profilePic);
  const [isEditing, setIsEditing] = useState(false);
  const [socialLinks, setSocialLinks] = useState(socialMedia);
  const [aboutMe, setAboutMe] = useState(bio);
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(skillLevel);

  const handleSocialChange = (platform, value) => {
    setSocialLinks({ ...socialLinks, [platform]: value });
  };

  return (
    <Card>
      <div className="flex flex-col md:flex-row items-center gap-8">
        <AvatarUploader
          src={profilePicture}
          isEditing={isEditing}
          onChange={(e) =>
            setProfilePicture(URL.createObjectURL(e.target.files[0]))
          }
        />
        <div>
          <h1 className="text-3xl font-extrabold">
            {fullName} (@{username})
          </h1>
          <div className="flex items-center gap-x-4">
            <EditableField
              isEditing={isEditing}
              value={birthDate}
              onChange={setBirthDate}
              type="date"
            >
              {`${calculateAge(birthDate)} years old`}
            </EditableField>
            <p> | </p>
            <EditableField
              isEditing={isEditing}
              value={cityState}
              onChange={setCityState}
            >
              {cityState}
            </EditableField>
          </div>
          <p className="text-gray-400 text-lg">
            Languages:{" "}
            {!isEditing ? (
              selectedLanguages.join(", ")
            ) : (
              <MultiSelectDropdown
                options={languageOptions}
                selected={selectedLanguages}
                onChange={(value) =>
                  setSelectedLanguages((prev) =>
                    prev.includes(value)
                      ? prev.filter((item) => item !== value)
                      : [...prev, value],
                  )
                }
              />
            )}
          </p>
          <SocialLinksEditor
            isEditing={isEditing}
            links={socialLinks}
            onChange={handleSocialChange}
          />
        </div>
      </div>

      <h2 className="text-2xl font-semibold mt-8">About Me</h2>
      <EditableField
        isEditing={isEditing}
        value={aboutMe}
        onChange={setAboutMe}
        type="textarea"
      >
        {aboutMe}
      </EditableField>

      <h2 className="text-2xl font-semibold mt-8">Adventure Preferences</h2>
      {!isEditing ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {selectedAdventures.map((type) => (
            <Badge key={type}>{type}</Badge>
          ))}
        </div>
      ) : (
        <MultiSelectDropdown
          options={adventureOptions}
          selected={selectedAdventures}
          onChange={(value) =>
            setSelectedAdventures((prev) =>
              prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
            )
          }
        />
      )}

      <h2 className="text-2xl font-semibold mt-8">Skill Level</h2>
      {!isEditing ? (
        <p className="text-lg">{selectedSkillLevel}</p>
      ) : (
        <select
          value={selectedSkillLevel}
          onChange={(e) => setSelectedSkillLevel(e.target.value)}
          className="mt-4 bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full md:w-1/2"
        >
          {skillLevelOptions.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      )}

      <h2 className="text-2xl font-semibold mt-8">Attitude</h2>
      {!isEditing ? (
        <div className="flex flex-wrap gap-3 mt-4">
          {selectedAttitudes.map((attitude) => (
            <Badge key={attitude}>{attitude}</Badge>
          ))}
        </div>
      ) : (
        <MultiSelectDropdown
          options={attitudeOptions}
          selected={selectedAttitudes}
          onChange={(value) =>
            setSelectedAttitudes((prev) =>
              prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value],
            )
          }
        />
      )}

      <div className="mt-8 flex gap-6">
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)}>Save</Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            <Button variant="outline">Delete Profile</Button>
          </>
        )}
      </div>
    </Card>
  );
}

const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

import React from "react";
import { FaInstagram, FaTwitter, FaLinkedin } from "react-icons/fa";

const SocialLinksEditor = ({ isEditing, links = {}, onChange }) => {
  return (
    <div className="flex gap-4 mt-4">
      {!isEditing ? (
        <>
          {links.instagram && (
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-yellow-500 text-2xl" />
            </a>
          )}
          {links.twitter && (
            <a
              href={links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <FaTwitter className="text-yellow-500 text-2xl" />
            </a>
          )}
          {links.linkedin && (
            <a
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="text-yellow-500 text-2xl" />
            </a>
          )}
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Instagram URL"
            value={links.instagram || ""}
            onChange={(e) => onChange("instagram", e.target.value)}
            className="bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="Twitter URL"
            value={links.twitter || ""}
            onChange={(e) => onChange("twitter", e.target.value)}
            className="bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full"
          />
          <input
            type="text"
            placeholder="LinkedIn URL"
            value={links.linkedin || ""}
            onChange={(e) => onChange("linkedin", e.target.value)}
            className="bg-gray-800 border border-yellow-500 text-white p-2 rounded-md w-full"
          />
        </div>
      )}
    </div>
  );
};

export default SocialLinksEditor;

import React from "react";
import Avatar from "./Avatar";

const AvatarUploader = ({ src, isEditing, onChange }) => {
  return (
    <div className="relative">
      <Avatar src={src} alt="Profile Picture" className="w-32 h-32" />
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
};

export default AvatarUploader;

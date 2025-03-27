import Image from "next/image";

export default function AvatarUploader({ src, alt, isEditing, onChange }) {
  return (
    <div className="relative border-4 border-yellow-500 rounded-full p-1">
      <Image
        src={src || "/profilepic.png"}
        alt={alt || "User Avatar"}
        width={150}
        height={150}
        className="rounded-full object-cover"
        priority
      />
      {isEditing && (
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      )}
    </div>
  );
}

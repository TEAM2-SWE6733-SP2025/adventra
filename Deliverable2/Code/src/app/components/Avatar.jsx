import Image from "next/image";

const Avatar = ({ src, alt, className }) => (
  <Image
    src={src}
    alt={alt}
    className={`rounded-full object-cover border-4 border-yellow-500 ${className}`}
    width={128}
    height={128}
  />
);

export default Avatar;

import { useEffect, useState } from "react";

export const ImagePreview = ({ image }: { image: string | File }) => {
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (typeof image === "string") {
      setImageUrl(image);
    } else if (image.type.startsWith("image/")) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);

      return () => URL.revokeObjectURL(url);
    }
  }, [image]);

  return (
    <img
      className="border-2 border-[color:--border-color]"
      src={imageUrl}
      alt="파일이 제공되지 않았거나 오류가 발생했습니다."
    />
  );
};

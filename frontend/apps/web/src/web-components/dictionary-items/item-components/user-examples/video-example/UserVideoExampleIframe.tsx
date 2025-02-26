export const UserVideoExampleIframe = ({
  videoId,
  start,
  end,
}: {
  videoId: string;
  start: number;
  end: number;
}) => {
  const src = `https://youtube.com/embed/${videoId}?start=${start}&end=${end}&hl=ko`;

  return (
    <iframe
      className="max-w-full aspect-video rounded-lg shadow-lg"
      src={src}
    ></iframe>
  );
};

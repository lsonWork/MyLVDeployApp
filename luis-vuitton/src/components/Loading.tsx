import { useEffect, useState } from "react";

type Props = {
  duration: number;
};
const Loading: React.FC<Props> = (props) => {
  const intervalTime = props.duration / 100;
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const idInterval = setInterval(() => {
      setWidth((prevState) => {
        return (prevState += 2.5);
      });
    }, intervalTime);

    return () => {
      clearInterval(idInterval);
    };
  }, [intervalTime]);
  return (
    <div
      style={{ width: `${width}%`, transition: "width 0.1s ease-in-out" }}
      // className="top-0 left-0 fixed h-[0.08rem] z-20 bg-stone-600"
      className="top-0 left-0 fixed h-[0.1rem] z-20 bg-stone-800"
    ></div>
  );
};

export default Loading;

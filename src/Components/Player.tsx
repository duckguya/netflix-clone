import ReactPlayer from "react-player/lazy";
import { IGetVideos } from "../api";

interface IProps {
  videos: IGetVideos;
}
export const Player = ({ videos }: IProps) => {
  return (
    <ReactPlayer
      className="react-player"
      url={`https://www.youtube.com/embed/${videos?.results[0].key}?autoplay=1`}
      // poster={makeImagePath(data.backdrop_path, "w500")}
      width="100%"
      height="50%"
      playing={true}
      muted={false}
      // volume={0.5}
      light={true}
      controls={false}
      // style={{ borderRadius: "15px" }}
    ></ReactPlayer>
  );
};

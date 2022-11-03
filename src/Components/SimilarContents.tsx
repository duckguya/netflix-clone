import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { IGetSimilarMovie } from "../api";
import { makeImagePath } from "../utils/makeImagePath";
import StarRate from "./StarRate";

interface IProps {
  similarData: IGetSimilarMovie;
  type: string;
}

function SimilarContents({ similarData, type }: IProps) {
  const navigate = useNavigate();
  const onBoxClicked = async (id: number) => {
    navigate(`/movies/${id}`);
  };

  return (
    <>
      {similarData?.results &&
        similarData.results.map((movie) => [
          <ContentBack key={movie.id}>
            <Box
              key={movie.id + type}
              bgphoto={makeImagePath(movie.poster_path, "w500")}
              onClick={() => onBoxClicked(movie.id)}
            ></Box>
            <Info>
              <h4>{type === "movie" ? movie.title : movie.name}</h4>
              <StarWrapper>
                <StarRate rate={movie.vote_average} />
                {String(movie.vote_average).slice(0, 3)}
              </StarWrapper>
              <p>
                {movie.overview.length > 80 ? movie.overview.slice(0, 80) : ""}
              </p>
            </Info>
          </ContentBack>,
        ])}
    </>
  );
}

const ContentBack = styled.div`
  background-color: #2e2e2e;
  height: 22rem;
  position: relative;
  border-radius: 0.5rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  position: relative;
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 10rem;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: left center;
  }
  &:last-child {
    transform-origin: right center;
  }
`;
const Info = styled(motion.div)`
  position: absolute;
  padding: 10px;
  width: 100%;
  h4 {
    text-align: left;
    font-weight: 350;
    padding: 1rem 0 0 0;
  }
  p {
    font-size: 0.8rem;
  }
  /* div {
    padding: 0.5rem 0;
  } */
`;
const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
`;

export default SimilarContents;

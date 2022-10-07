/* eslint-disable */
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getTvDetail, IGetTvDetail } from "../api";
import { useQuery } from "@tanstack/react-query";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.veryDark};
  z-index: 10;
`;

const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 50%;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 10px;
  font-size: 28px;
  position: relative;
  top: -60px;
`;
const BigOverView = styled.p`
  padding: 20px;
  position: relative;
  top: -60px;
  color: ${(props) => props.theme.white.lighter};
`;

interface IProps {
  //   results: IMovie[];
  titleType: string;
  tvId: number;
}

function TvDetail({ titleType, tvId }: IProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const onOverlayClicked = () => navigate("/tv");
  const bigTvMatch = useMatch("/tv/:tvId");

  const { data, isLoading } = useQuery<IGetTvDetail>(
    ["movies", tvId],
    async () => await getTvDetail(tvId),
    { enabled: !!tvId }
  );

  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);
  // const clickedMovie = results.find((movie) => movie.id === movieId);

  return (
    <>
      <AnimatePresence>
        {bigTvMatch ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigTvMatch.params.tvId + titleType}
            >
              {data && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, #141414, transparent), url(${makeImagePath(
                        data.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{data.name}</BigTitle>
                  <BigOverView>{data.overview}</BigOverView>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default TvDetail;

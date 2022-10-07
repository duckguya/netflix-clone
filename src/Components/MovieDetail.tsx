/* eslint-disable */
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {
  getMovieDetail,
  getSimilarMovies,
  IGetMovieDetail,
  IGetSimilarMovie,
} from "../api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

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
  width: 90vw;
  height: 100%;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  /* overflow: hidden; */
  background-color: ${(props) => props.theme.black.veryDark};
  line-height: 20px;
  z-index: 10;
  /* box-sizing: content-box; */
  margin-bottom: 2rem;
  @media screen and (min-width: 1200px) {
    width: 50vw;
  }
`;
const ContentContainer = styled.div`
  padding: 0 2rem; ;
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

const ContentWrapper = styled.div`
  display: flex;
  padding: 20px;
  position: relative;
`;
const ContentLeft = styled.p`
  /* position: relative; */
  /* top: -60px; */
  color: ${(props) => props.theme.white.lighter};
  width: 70vw;
  padding-right: 2rem;
  font-size: 15px;
`;
// const ContentLeft = styled.div``;
const ContentRight = styled.div`
  display: flex;
  width: 30vw;
  font-size: 13px;
  label {
    color: ${(props) => props.theme.black.lighter};
  }
`;
const ContentDetail = styled.div`
  display: flex;
  p {
    padding-right: 1rem;
  }
`;
const OverView = styled.p`
  padding-top: 2rem;
  font-size: 13px;
`;
const ContentBack = styled.div`
  background-color: #2e2e2e;
  height: 22rem;
  position: relative;
  border-radius: 0.5rem;
`;
const ContentImage = styled.div`
  padding: 1rem;
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(3, 1fr);
  position: relative;
  width: 100%;
  margin-bottom: 4rem;
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
  div {
    padding: 0.5rem 0;
  }
`;

const InfoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

interface IProps {
  // results: IMovie[];
  titleType: string;
  // movieId: number;
}

function MovieDetail({ titleType }: IProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const onOverlayClicked = () => navigate("/");
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [similarData, setsimilarData] = useState<IGetSimilarMovie>();

  let params = useParams();
  let id = Number(params.movieId);

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["movies", id],
    () => getMovieDetail(id),
    { enabled: !!id }
  );

  const { data: similarResults, isLoading: similarIsLoading } =
    useQuery<IGetSimilarMovie>(
      ["similar-movies", id],
      () => getSimilarMovies(id),
      { enabled: !!id }
    );
  useEffect(() => {
    if (similarResults) {
      if (similarResults.results.length > 10) {
        let copy = similarResults;
        copy.results.splice(9, similarResults.results.length - 1);
        setsimilarData(copy);
      } else {
        setsimilarData(similarResults);
      }
    }
  }, [similarIsLoading]);

  const onBoxClicked = async (id: number) => {
    navigate(`/movies/${id}`);
  };

  return (
    <>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {
              <BigMovie
                style={{ top: scrollY.get() + 100 }}
                layoutId={bigMovieMatch.params.movieId + titleType}
              >
                {data && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, #141414, transparent), url(${makeImagePath(
                          data.backdrop_path,
                          "w500"
                        )})`,
                        borderRadius: "15px",
                      }}
                    />
                    <ContentContainer>
                      <BigTitle>{data.title}</BigTitle>
                      <ContentWrapper>
                        <ContentLeft>
                          <ContentDetail>
                            <p>{data.release_date.split("-")[0]}</p>
                            <p>{data.runtime}분</p>
                            <p>{data.vote_average}별</p>
                          </ContentDetail>
                          <OverView>
                            {data.overview.slice(0, 300) + "..."}
                          </OverView>
                        </ContentLeft>
                        <ContentRight>
                          <label>장르:</label>
                          <p>
                            {data.genres.map((d) =>
                              d.id === data.genres[data.genres.length - 1].id
                                ? d.name
                                : d.name + ", "
                            )}
                          </p>
                        </ContentRight>
                      </ContentWrapper>
                      <ContentImage>
                        {similarData?.results &&
                          similarData.results.map((movie) => [
                            <ContentBack>
                              <Box
                                key={movie.id + titleType}
                                bgphoto={makeImagePath(
                                  movie.poster_path,
                                  "w500"
                                )}
                                onClick={() => onBoxClicked(movie.id)}
                              ></Box>
                              <Info>
                                <h4>{movie.title}</h4>
                                <div>{movie.vote_average}</div>
                                <p>{movie.overview.slice(0, 80) + "..."}</p>
                              </Info>
                            </ContentBack>,
                          ])}
                      </ContentImage>
                    </ContentContainer>
                  </>
                )}
              </BigMovie>
            }
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieDetail;

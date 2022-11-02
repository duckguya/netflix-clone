/* eslint-disable */
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import {
  getMovieDetail,
  getMovieVideos,
  getSimilarMovies,
  IGetMovieDetail,
  IGetMovieVideos,
  IGetSimilarMovie,
} from "../api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player/lazy";
import StarRate from "./StarRate";
import { type } from "@testing-library/user-event/dist/type";

interface IProps {
  children?: React.ReactNode;
  data: IGetMovieDetail;
  type: string;
  // movieId: number;
}

function ContentDetail({ data, type }: IProps) {
  console.log("detail data", data);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  //   const onOverlayClicked = () => navigate("/");
  const onOverlayClicked = () => {
    console.log("type", type);
    if (type === "movie") {
      navigate("/");
    } else {
      navigate("/tv");
    }
  };
  const bigMovieMatch = useMatch("/movies/:movieId");
  const movieMatch = useMatch("/movies/:movieId");
  const tvMatch = useMatch("/tv/:tvId");
  const contentId = movieMatch
    ? movieMatch.params.movieId
    : tvMatch?.params.tvId;
  const [similarData, setsimilarData] = useState<IGetSimilarMovie>();

  let params = useParams();
  let id = Number(params.movieId);
  //   const { data, isLoading } = useQuery<IGetMovieDetail>(
  //     ["movies", id],
  //     () => getMovieDetail(id),
  //     { enabled: !!id }
  //   );

  const { data: videos, isLoading: videosIsLoading } =
    useQuery<IGetMovieVideos>(["videos", id], () => getMovieVideos(id), {
      enabled: !!id,
    });
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
        {
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {
              <DetailWrapper
                style={{ top: scrollY.get() + 100 }}
                layoutId={contentId + type}
              >
                {data && (
                  <>
                    {videos?.results &&
                      (videos?.results.length > 0 ? (
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
                      ) : (
                        <Cover
                          style={{
                            backgroundImage: `linear-gradient(to top, #141414, transparent), url(${makeImagePath(
                              data.backdrop_path,
                              "w500"
                            )})`,
                            borderRadius: "15px",
                          }}
                        />
                      ))}

                    <ContentContainer>
                      <Title>{data.title}</Title>
                      <ContentWrapper>
                        <ContentLeft>
                          <Detail>
                            <p>{data.release_date.split("-")[0]}</p>
                            <p>{data.runtime}분</p>
                            <StarRate rate={data.vote_average} />
                            {String(data.vote_average).slice(0, 3)}
                          </Detail>
                          <OverView>
                            {data.overview.length > 300
                              ? data.overview.slice(0, 300) + "..."
                              : data.overview}
                          </OverView>
                        </ContentLeft>
                        <ContentRight>
                          <label>장르&nbsp;:&nbsp;</label>
                          {data.genres.map((d) =>
                            d.id === data.genres[data.genres.length - 1].id ? (
                              <p key={d.id}>{d.name}</p>
                            ) : (
                              <p key={d.id}>{d.name},</p>
                            )
                          )}
                        </ContentRight>
                      </ContentWrapper>
                      <SubTitle>비슷한 콘텐츠</SubTitle>
                      <ContentImage>
                        {similarData?.results &&
                          similarData.results.map((movie) => [
                            <ContentBack key={movie.id}>
                              <Box
                                key={movie.id + type}
                                bgphoto={makeImagePath(
                                  movie.poster_path,
                                  "w500"
                                )}
                                onClick={() => onBoxClicked(movie.id)}
                              ></Box>
                              <Info>
                                <h4>{movie.title}</h4>
                                <StarWrapper>
                                  <StarRate rate={movie.vote_average} />
                                  {String(movie.vote_average).slice(0, 3)}
                                </StarWrapper>
                                <p>
                                  {movie.overview.length > 80
                                    ? movie.overview.slice(0, 80)
                                    : ""}
                                </p>
                              </Info>
                            </ContentBack>,
                          ])}
                      </ContentImage>
                    </ContentContainer>
                  </>
                )}
              </DetailWrapper>
            }
          </>
        }
      </AnimatePresence>
    </>
  );
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const DetailWrapper = styled(motion.div)`
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
  padding: 0 2rem 2rem 2rem;
  background-color: ${(props) => props.theme.black.veryDark};
`;

const Cover = styled.iframe`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 50%;
`;
const Title = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  /* padding: 10px; */
  font-size: 28px;
  /* position: relative; */
  /* top: -10px; */
  padding: 2rem 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  position: relative;
`;
const ContentLeft = styled.div`
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
  justify-content: flex-end;
  flex-wrap: wrap;
  width: 40vw;
  font-size: 14px;
  label {
    color: ${(props) => props.theme.black.lighter};
  }
  p {
    margin-right: 0.5rem;
  }
`;
const Detail = styled.div`
  display: flex;
  align-items: center;
  p {
    padding-right: 1rem;
  }
`;
const OverView = styled.p`
  padding-top: 2rem;
  font-size: 14px;
  line-height: 1.5rem;
`;
const ContentBack = styled.div`
  background-color: #2e2e2e;
  height: 22rem;
  position: relative;
  border-radius: 0.5rem;
`;
const ContentImage = styled.div`
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
  /* div {
    padding: 0.5rem 0;
  } */
`;
const SubTitle = styled.p`
  font-size: 1.4rem;
  font-weight: 350;
  padding: 3rem 0 1rem 0;
`;

const StarWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 0;
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

export default ContentDetail;

/* eslint-disable */
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils/makeImagePath";
import {
  getMovieVideos,
  getSimilarMovies,
  getTvVideos,
  IGetMovieDetail,
  IGetVideos,
  IGetSimilarMovie,
  getSimilarTvs,
} from "../api";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import StarRate from "./StarRate";
import { Player } from "./Player";
import SimilarContents from "./SimilarContents";

interface IProps {
  children?: React.ReactNode;
  data: IGetMovieDetail;
  type: string;
}

function ContentDetail({ data, type }: IProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  const onOverlayClicked = () => {
    if (type === "movie") {
      navigate("/");
    } else {
      navigate("/tv");
    }
  };

  const movieMatch = useMatch("/movies/:movieId");
  const tvMatch = useMatch("/tv/:tvId");
  const contentId = movieMatch
    ? movieMatch.params.movieId
    : tvMatch?.params.tvId;
  const [similarData, setsimilarData] = useState<IGetSimilarMovie>();

  let params = useParams();
  let movieId = Number(params.movieId);
  let tvId = Number(params.tvId);

  // video
  const { data: movieVideos, isLoading: movieVideosIsLoading } =
    useQuery<IGetVideos>(
      ["movie_videos", movieId],
      () => getMovieVideos(movieId),
      {
        enabled: !!movieId,
      }
    );
  const { data: tvVideos, isLoading: tvVideosIsLoading } = useQuery<IGetVideos>(
    ["tv_videos", tvId],
    () => getTvVideos(tvId),
    {
      enabled: !!tvId,
    }
  );

  // 비슷한 컨텐츠
  const { data: similarMovieResults, isLoading: similarMovieIsLoading } =
    useQuery<IGetSimilarMovie>(
      ["similar_movies", movieId],
      () => getSimilarMovies(movieId),
      { enabled: !!movieId }
    );
  const { data: similarTvResults, isLoading: similarTvIsLoading } =
    useQuery<IGetSimilarMovie>(
      ["similar_tvs", tvId],
      () => getSimilarTvs(tvId),
      { enabled: !!tvId }
    );

  useEffect(() => {
    if (similarMovieResults) {
      if (similarMovieResults.results.length > 10) {
        let copy = similarMovieResults;
        copy.results.splice(9, similarMovieResults.results.length - 1);
        setsimilarData(copy);
      } else {
        setsimilarData(similarMovieResults);
      }
    }
  }, [similarMovieIsLoading]);

  useEffect(() => {
    if (similarTvResults) {
      if (similarTvResults.results.length > 10) {
        let copy = similarTvResults;
        copy.results.splice(9, similarTvResults.results.length - 1);
        setsimilarData(copy);
      } else {
        setsimilarData(similarTvResults);
      }
    }
  }, [similarTvIsLoading]);


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
                    {movieVideos &&
                      (movieVideos?.results.length > 0 ? (
                        <Player videos={movieVideos} />
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
                    {tvVideos &&
                      (tvVideos?.results.length > 0 ? (
                        <Player videos={tvVideos} />
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
                      <Title>{type === "movie" ? data.title : data.name}</Title>
                      <ContentWrapper>
                        <ContentLeft>
                          <Detail>
                            {type === "movie" ? (
                              <p> {data.release_date.split("-")[0]}</p>
                            ) : (
                              <p>
                                {data.first_air_date} ~ {data.last_air_date}
                              </p>
                            )}
                            {type === "movie" ? <p> {data.runtime} 분</p> : ""}
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
                        {similarData && (
                          <SimilarContents
                            similarData={similarData}
                            type={type}
                          />
                        )}
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

const ContentImage = styled.div`
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(3, 1fr);
  position: relative;
  width: 100%;
  margin-bottom: 4rem;
`;

const SubTitle = styled.p`
  font-size: 1.4rem;
  font-weight: 350;
  padding: 3rem 0 1rem 0;
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

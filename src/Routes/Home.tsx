import { useQueries, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getNowPlaying,
  getTopRated,
  getUpcoming,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils";
import MovieList from "../Components/MovieList";

const Wrapper = styled.div`
  /* background: ${(props) => props.theme.black.veryDark}; */
  background: ${(props) => props.theme.black.veryDark};
`;

const Loader = styled.div`
  height: 20vw;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 3.55rem;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
  mask-image: -webkit-gradient(
    linear,
    left center,
    left bottom,
    from(rgba(0, 0, 0, 1)),
    to(rgba(0, 0, 0, 0))
  );
`;

const Title = styled.h2`
  font-size: 4rem;
  margin-bottom: 1rem;
`;
const Overview = styled.p`
  font-size: 1.3rem;
  width: 50%;
  /* height: 50%; */
  padding-bottom: 3rem;
`;
const SlideWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: static;
`;
const Space = styled.div`
  margin: 5rem 0;
`;

function Home() {
  const {
    data: nowPlaying,
    isLoading: nowLoading,
    error: nowError,
  } = useQuery<IGetMoviesResult>(["movies", "now_playing"], getNowPlaying);

  const {
    data: upcoming,
    isLoading: comingLoading,
    error: comingError,
  } = useQuery<IGetMoviesResult>(
    ["movies", "up_coming"],
    async () => await getUpcoming()
  );
  const { data: topRated, isLoading: topRatedLoading } =
    useQuery<IGetMoviesResult>(
      ["movies", "top_rated"],
      async () => await getTopRated()
    );
  return (
    <Wrapper>
      {comingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(nowPlaying?.results[0].backdrop_path || "")}
          >
            <Title>{nowPlaying?.results[0].title}</Title>
            <Overview>{nowPlaying?.results[0].overview}</Overview>
          </Banner>
          <SlideWrapper>
            {nowPlaying ? (
              <MovieList {...nowPlaying} titleType="Now Playing" />
            ) : (
              ""
            )}
            <Space />
            {upcoming ? <MovieList {...upcoming} titleType="Up Coming" /> : ""}
            <Space />
            {topRated ? <MovieList {...topRated} titleType="Top Rated" /> : ""}
            <Space />
          </SlideWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Home;

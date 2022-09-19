import { useQueries, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getNowPlaying, getUpcoming, IGetMoviesResult } from "../api";
import Upcoming from "../Components/Upcoming";
import NowPlaying from "../Components/NowPlaying";
import { makeImagePath } from "../utils";
import MovieList from "../Components/MovieList";

const Wrapper = styled.div`
  /* background: ${(props) => props.theme.black.veryDark}; */
  background: ${(props) => props.theme.black.veryDark};
`;

const Loader = styled.div`
  height: 20vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  height: 50%;
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
const TitleType = styled.p`
  font-size: 1.4rem;
  padding-bottom: 0.3rem;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;
  margin: 3rem;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  margin-bottom: 3rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 12rem;
  border-radius: 5px;
  cursor: pointer;
  &:first-child {
    transform-origin: left center;
  }
  &:last-child {
    transform-origin: right center;
  }
  @media screen and (max-width: 1200px) {
    height: 7rem;
  }
`;

const BtnOverlay = styled(motion.div)`
  position: absolute;
  height: 100%;
  /* background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5)); */
  /* right: 0; */
  padding: 0px 20px;
  display: flex;
  align-items: center;
  height: 12rem;
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
  @media screen and (max-width: 1200px) {
    height: 7rem;
  }
`;

const BtnOverlayBack = styled(BtnOverlay)`
  background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  left: 0;
`;
const BtnOverlayForward = styled(BtnOverlay)`
  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  right: 0;
`;

const ArrowBtn = styled(motion.div)`
  color: ${(props) => props.theme.white.darker};
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  /* width: 100%; */
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

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
  background-color: ${(props) => props.theme.black.lighter};
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

const rowVariants = {
  hidden: {
    x: window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.outerWidth,
  },
};

const BackrowVariants = {
  hidden: {
    x: -window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth,
  },
};

const BoxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.3,
      type: "tween",
    },
  },
};

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

const BtnOverlayForwardVariants = {
  hover: {
    background:
      "linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))",
    transition: {
      type: "tween",
    },
  },
};
const BtnOverlayBackVariants = {
  hover: {
    background:
      "linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.9))",
    transition: {
      type: "tween",
    },
  },
  hidden: {
    x: -window.outerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: window.outerWidth,
  },
};
const BtnVariants = {
  hover: {
    scale: 1.2,
    transition: {
      type: "tween",
    },
  },
};

const offset = 6;

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
    ["movies", "upcoming"],
    async () => await getUpcoming()
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
            {/* <NowPlaying /> */}
            {nowPlaying ? (
              <MovieList {...nowPlaying} titleType="Now Playing" />
            ) : (
              ""
            )}
            <Space />
            {/* <Upcoming /> */}
            {upcoming ? <MovieList {...upcoming} titleType="Up Coming" /> : ""}
            <Space />
          </SlideWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Home;

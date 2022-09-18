import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getNowPlaying, IGetMoviesResult } from "../api";
import { makeImagePath } from "../utils";

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

function NowPlaying() {
  const navigate = useNavigate();
  // useNavigate : url을 이동할 수 있다.
  const bigMovieMatch = useMatch("/movies/:movieId");
  const { scrollY } = useScroll();
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies", "now_playing"],
    getNowPlaying
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  // 슬라이드 다음 버튼을 연속으로 눌렀을 때 animation이 반복되면서 발생하는 버그를 막는다.
  //   increaseIndex함수가 실행되면
  // leaving이 false로 들어와서 if문을 통과하고
  // 1. toggleLeaving함수가 실행된다.
  // 2.toggleLeaving함수는 setLeaving을 true로 바꾼다.
  // 3.setIndex를 +1시킨다.
  // 4.setIndex가 실행되면 animation이 실행된다.
  // 5.animation이 실행되고 exit가 끝나면 onExitCompete에 걸려있던 toggleLeaving이 한 번 더 실행되면서 false로 바뀐다.

  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totlaMovies = data.results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totlaMovies = data.results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const changeIndex = (arrow: string) => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totlaMovies = data.results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      if (arrow === "back") {
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else {
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  // function template({d:string}){

  //   return null
  // }

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/movies/${movieId}`);
  };

  const onOverlayClicked = () => navigate("/");
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find(
      (movie) => String(movie.id) === bigMovieMatch.params.movieId
    );

  return (
    <>
      <Slider>
        <TitleType>Now Playing</TitleType>
        {/* 컴포넌트가 처음 마운트 될 때 animation이 실행되지 않게 한다 */}
        <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
          <Row
            variants={rowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {data?.results
              .slice(1)
              .slice(offset * index, offset * index + offset)
              .map((movie) => (
                <Box
                  layoutId={movie.id + ""}
                  key={movie.id}
                  variants={BoxVariants}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                  onClick={() => onBoxClicked(movie.id)}
                >
                  <Info variants={InfoVariants}>
                    <h4>{movie.title}</h4>
                  </Info>
                </Box>

                // 부모 element에 variants를 가지고있으면 자식요소도 갖게된다.
              ))}
          </Row>
          <BtnOverlayBack
            key={index + 1}
            onClick={() => changeIndex("back")}
            // onClick={increaseIndex}
            variants={BtnOverlayBackVariants}
            whileHover="hover"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ArrowBtn
              className="material-icons"
              variants={BtnVariants}
              whileHover="hover"
            >
              arrow_back_ios
            </ArrowBtn>
          </BtnOverlayBack>
          <BtnOverlayForward
            key={index + 2}
            onClick={() => changeIndex("forward")}
            variants={BtnOverlayForwardVariants}
            whileHover="hover"
          >
            <ArrowBtn
              className="material-icons"
              variants={BtnVariants}
              whileHover="hover"
            >
              arrow_forward_ios
            </ArrowBtn>
          </BtnOverlayForward>
        </AnimatePresence>
      </Slider>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie
              style={{ top: scrollY.get() + 100 }}
              layoutId={bigMovieMatch.params.movieId}
            >
              {clickedMovie && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        clickedMovie.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{clickedMovie.title}</BigTitle>
                  <BigOverView>{clickedMovie.overview}</BigOverView>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
export default NowPlaying;

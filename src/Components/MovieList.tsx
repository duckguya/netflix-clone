/* eslint-disable */
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail, IMovie } from "../api";
import { makeImagePath } from "../utils/makeImagePath";
import MovieDetail from "./MovieDetail";
import StarRate from "./StarRate";
import Slider from "react-slick";

const TitleType = styled.p`
  font-size: 1.4rem;
  font-weight: 350;
  padding-bottom: 0.3rem;
`;

const Container = styled.div`
  position: relative;
  top: -100px;
  margin: 3rem;
`;

const Row = styled(motion.div)`
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 100%;
  margin-bottom: 4rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 9rem;
  border-radius: 5px;
  overflow: hidden;
  cursor: pointer;
  &:first-child {
    transform-origin: left center;
  }
  &:last-child {
    transform-origin: right center;
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
`;

const BtnOverlayBack = styled(BtnOverlay)`
  background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  left: 0;
  height: 9rem;
`;
const BtnOverlayForward = styled(BtnOverlay)`
  background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5));
  right: 0;
  height: 9rem;
`;

const ArrowBtn = styled(motion.div)`
  color: ${(props) => props.theme.white.darker};
  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.darker};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;

  h4 {
    text-align: left;
    font-size: 1rem;
  }
`;
const InfoWrapper = styled.div`
  width: 100%;
  display: flex;
  /* justify-content: space-around; */
  align-items: center;
  div {
    display: flex;
  }
`;

const MoreBtn = styled.div`
  padding-left: 3.5rem;

  &:hover {
    color: ${(props) => props.theme.black.lighter};
  }
`;

const rowVariants2 = {
  hidden: (direction: number) => ({
    x: direction > 0 ? window.outerWidth : -window.outerWidth,
  }),
  // hidden: {
  //   x: window.outerWidth,
  // },
  visible: {
    x: 0,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -window.outerWidth : window.outerWidth,
  }),
  // exit: {
  //   x: -window.outerWidth,
  // },
};

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

const rowVariants3 = {
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
    // transition: {
    //   type: "tween",
    // },
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

interface IProps {
  children?: React.ReactNode;
  results: IMovie[];
  titleType: string;
}

function MovieList({ results, titleType }: IProps) {
  const navigate = useNavigate();
  const [[index, direction], setIndex] = useState([0, 0]);
  // const [index, setIndex] = useState(0);
  // const [direction, setDirection] = useState(true);
  const [leaving, setLeaving] = useState(false);
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [movieId, setMovieId] = useState(
    Number(bigMovieMatch?.params.movieId) | 0
  );

  // useEffect(() => {
  //   const imgTest = document.getElementById("Box");
  //   imgTest.onload = () => {
  //     const isLoaded = imageTest.complete && imageTest.naturalHeight !== 0;
  //     console.log(isLoaded);
  //   };
  //   var img = document.querySelector("#test");
  //   img.addEventListener("load", function () {
  //     성공();
  //   });
  //   img.ad;
  // });

  const changeIndex = (newDirection: number) => {
    if (results) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      console.log(index, newDirection, maxIndex);
      if (newDirection === 1 && index === maxIndex) {
        setIndex([0, newDirection]);
      } else if (newDirection === -1 && index === 0) {
        setIndex([maxIndex, newDirection]);
      } else {
        setIndex([index + newDirection, newDirection]);
      }

      // if (arrow === "back") {
      //   setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      // } else {
      //   setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      // }
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = async (id: number) => {
    setMovieId(id);
    navigate(`/movies/${id}`);
  };

  return (
    <>
      <Container>
        <TitleType>{titleType}</TitleType>

        {/* 컴포넌트가 처음 마운트 될 때 animation이 실행되지 않게 한다 */}
        <AnimatePresence
          initial={false}
          onExitComplete={toggleLeaving}
          custom={direction}
        >
          {/* onExitComplete : exit이 끝나면 실행된다 */}
          <Row
            variants={direction === 1 ? rowVariants : rowVariants3}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 1 }}
            key={index}
          >
            {results &&
              results
                // .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    id="Box"
                    layoutId={movie.id + titleType}
                    key={movie.id + titleType}
                    variants={BoxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                    onClick={() => onBoxClicked(movie.id)}
                    // onMouseOver={() => onMouseOver(movie.id)}
                  >
                    <Info variants={InfoVariants}>
                      <h4>{movie.title}</h4>
                      <InfoWrapper>
                        <div>
                          <StarRate rate={movie.vote_average} />
                          <span>{String(movie.vote_average).slice(0, 3)}</span>
                        </div>
                        <MoreBtn className="material-icons">
                          expand_circle_down
                        </MoreBtn>
                      </InfoWrapper>
                    </Info>
                  </Box>

                  // 부모 element에 variants를 가지고있으면 자식요소도 갖게된다.
                ))}
          </Row>

          <BtnOverlayBack
            key={index + 1}
            onClick={() => changeIndex(-1)}
            // onClick={increaseIndex}
            variants={BtnOverlayBackVariants}
            whileHover="hover"
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween" }}
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
            onClick={() => changeIndex(1)}
            variants={BtnOverlayForwardVariants}
            whileHover="hover"
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween" }}
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
      </Container>
      {movieId !== 0 ? (
        <MovieDetail
          // result={detailData}
          titleType={titleType}
        />
      ) : (
        ""
      )}
    </>
  );
}
export default MovieList;

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetail,
  getNowPlaying,
  IGetMovieDetail,
  IGetMoviesResult,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import MovieDetail from "./MovieDetail";

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
  height: 12rem;
  border-radius: 5px;
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
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 18px;
  }
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

interface IProps {
  children?: React.ReactNode;
  results: IMovie[];
  titleType: string;
}

function MovieList({ results, titleType }: IProps) {
  const navigate = useNavigate();

  const [detailData, setDetailData] = useState<IGetMovieDetail>();
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const bigMovieMatch = useMatch("/movies/:movieId");
  const [movieId, setMovieId] = useState(
    Number(bigMovieMatch?.params.movieId) | 0
  );

  const increaseIndex = () => {
    if (results) {
      if (leaving) return;
      toggleLeaving();
      const totlaMovies = results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (results) {
      if (leaving) return;
      toggleLeaving();
      const totlaMovies = results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };

  const changeIndex = (arrow: string) => {
    if (results) {
      if (leaving) return;
      toggleLeaving();
      const totlaMovies = results.length - 1;
      const maxIndex = Math.floor(totlaMovies / offset) - 1;
      // Math.ceil : 올림처리를 하는 함수. <-> Math.floor()
      if (arrow === "back") {
        setIndex((prev) => (prev === 0 ? maxIndex : prev - 1));
      } else {
        setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
      }
    }
  };

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = async (id: number) => {
    console.log("movieId", id);
    setMovieId(id);
    navigate(`/movies/${id}`);

    // const { data, isLoading } = useQuery<IGetMovieDetail>(
    //   ["movies", "detail"],
    //   async () => await getMovieDetail(movieId)
    // );
    // console.log(data);
    // setDetailData(data);
  };

  return (
    <>
      <Slider>
        <TitleType>{titleType}</TitleType>
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
            {results &&
              results
                .slice(1)
                .slice(offset * index, offset * index + offset)
                .map((movie) => (
                  <Box
                    layoutId={movie.id + titleType}
                    key={movie.id + titleType}
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

/* eslint-disable */
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getNowPlaying, IGetMoviesResult, IMovie, ITv } from "../api";
import { makeImagePath } from "../utils";
import TvDetail from "./TvDetail";

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

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Detail = styled(motion.div)`
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

const DetailCover = styled.div`
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

interface IProps {
  children?: React.ReactNode;
  results: ITv[];
  titleType: string;
}

function TvList({ results, titleType }: IProps) {
  const navigate = useNavigate();

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const bigTvMatch = useMatch("/tv/:tvId");
  const [tvId, setTvId] = useState(Number(bigTvMatch?.params.tvId) | 0);

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

  const onBoxClicked = (tvId: number) => {
    setTvId(tvId);
    navigate(`/tv/${tvId}`);
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
                .map((tv) => (
                  <Box
                    layoutId={tv.id + titleType}
                    key={tv.id + titleType}
                    variants={BoxVariants}
                    initial="normal"
                    whileHover="hover"
                    transition={{ type: "tween" }}
                    bgphoto={makeImagePath(tv.backdrop_path, "w500")}
                    onClick={() => onBoxClicked(tv.id)}
                  >
                    <Info variants={InfoVariants}>
                      <h4>{tv.name}</h4>
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
      {tvId !== 0 ? <TvDetail titleType={titleType} tvId={tvId} /> : ""}
    </>
  );
}
export default TvList;

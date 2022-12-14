/* eslint-disable */
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence, useScroll } from "framer-motion";

import { IMovie, getMovieDetail, IContent, IGetMovieDetail } from "../api";
import { makeImagePath } from "../utils/makeImagePath";
import { useDetailMovie } from "../Query/Queries";
import ContentDetail from "./ContentDetail";
import StarRate from "./StarRate";

interface IProps {
  type: string;
  results: IContent[];
  onBoxClicked: (id: number) => void;
}

const SearchGridItems = ({ type, results, onBoxClicked }: IProps) => {
  return (
    <Wrapper>
      <TitleType>{type === "movie" ? "Movie" : "Tv"}</TitleType>
      {/* 컴포넌트가 처음 마운트 될 때 animation이 실행되지 않게 한다 */}
      <AnimatePresence initial={false} onExitComplete={() => {}}>
        <Row variants={rowVariants} key={0}>
          {results &&
            results
              .slice(1)
              // .slice(offset * index, offset * index + offset)
              .filter((m) => m.backdrop_path)
              .map((content) => (
                <Box
                  layoutId={content.id + ""}
                  key={content.id}
                  variants={BoxVariants}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(content.backdrop_path, "w500")}
                  onClick={() => onBoxClicked(content.id)}
                >
                  <Info variants={InfoVariants}>
                    {/* <h4>{content.name}</h4> */}
                    <h4>{type === "movie" ? content.title : content.name}</h4>
                    <InfoWrapper>
                      <div>
                        <StarRate rate={content.vote_average} />
                        <span>{String(content.vote_average).slice(0, 3)}</span>
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
      </AnimatePresence>
      {/* {movieData ? <ContentDetail data={movieData} type={"movie"} /> : ""} */}
      {/*
      <AnimatePresence>
        {movieId ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <BigMovie style={{ top: scrollY.get() - 200 }} layoutId={movieId}>
              {data && (
                <>
                  <BigCover
                    style={{
                      backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                        data.backdrop_path,
                        "w500"
                      )})`,
                    }}
                  />
                  <BigTitle>{data.title}</BigTitle>
                  <BigOverView>{data.overview}</BigOverView>
                </>
              )}
            </BigMovie>
          </>
        ) : null}
      </AnimatePresence>
                */}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
`;
const TitleType = styled.p`
  position: absolute;
  left: 2.3rem;
  top: -2rem;
  font-size: 1.5rem;
  /* padding-bottom: 0.3rem; */
`;
const Row = styled(motion.div).attrs({
  initial: "hidden",
  animate: "visible",
  exit: "exit",
  transition: { type: "tween", duration: 1 },
})`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  margin-left: 2.4rem;
`;

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center center;
  height: 10rem;
  width: 16rem;
  border-radius: 5px;
  margin: 0px 5px 4rem 0px;
  cursor: pointer;
  &:first-child {
    transform-origin: left center;
  }
  &:last-child {
    transform-origin: right center;
  }
  @media screen and (max-width: 1200px) {
    width: 13rem;
    height: 8rem;
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
  justify-content: space-around;
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
  width: 100%;
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

export default SearchGridItems;

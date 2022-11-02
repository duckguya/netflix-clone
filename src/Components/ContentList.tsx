/* eslint-disable */
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieDetail,
  getTvDetail,
  IGetMovieDetail,
  IGetTvDetail,
  IMovie,
} from "../api";
import { makeImagePath } from "../utils";
import MovieDetail from "./MovieDetail";
import StarRate from "./StarRate";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import TvDetail from "./TvDetail";
import ContentDetail from "./ContentDetail";
import { useQuery } from "@tanstack/react-query";

interface IProps {
  children?: React.ReactNode;
  results: IMovie[];
  titleType: string;
  type: string;
}

function ContentList({ results, titleType, type }: IProps) {
  const navigate = useNavigate();
  const movieMatch = useMatch("/movies/:movieId");
  const tvMatch = useMatch("/tv/:tvId");

  //   const [contentId, setContentId] = useState(
  //     movieMatch
  //       ? Number(movieMatch?.params.movieId)
  //       : tvMatch
  //       ? Number(tvMatch?.params.tvId)
  //       : 0
  //   );

  //   const [contentId, setContentId] = useState(
  //     Number(movieMatch?.params.movieId) | 0
  //   );

  const onBoxClicked = async (id: number) => {
    // setContentId(id);
    navigate(`${type === "movie" ? "/movies/" : "/tv/"}${id}`);
  };

  const settings = {
    dots: false,
    infinite: false,
    speed: 1000,
    slidesToShow: 6,
    slidesToScroll: 6,
  };

  // detail data
  const contentId = Number(
    movieMatch ? movieMatch?.params.movieId : tvMatch?.params.tvId
  );
  const { data: movieData, isLoading: movieIsLoading } =
    useQuery<IGetMovieDetail>(
      ["movies", contentId],
      async () => await getMovieDetail(contentId),
      { enabled: !!contentId }
    );
  const { data: tvData, isLoading: tvIsLoading } = useQuery<IGetTvDetail>(
    ["movies", contentId],
    async () => await getTvDetail(contentId),
    { enabled: !!contentId }
  );
  return (
    <>
      <Container>
        <TitleType>{titleType}</TitleType>
        <Slider {...settings}>
          {results &&
            results
              .slice(1)
              // .slice(offset * index, offset * index + offset)
              .map((content) => (
                <Box
                  id="Box"
                  layoutId={content.id + titleType}
                  key={content.id + titleType}
                  variants={BoxVariants}
                  initial="normal"
                  whileHover="hover"
                  transition={{ type: "tween" }}
                  bgphoto={makeImagePath(content.backdrop_path, "w500")}
                  onClick={() => onBoxClicked(content.id)}
                >
                  <Info variants={InfoVariants}>
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
              ))}
        </Slider>
      </Container>
      {type === "movie" ? (
        movieData ? (
          <ContentDetail data={movieData} type={"movie"} />
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </>
  );
}

const TitleType = styled.p`
  font-size: 1.4rem;
  font-weight: 350;
  padding-bottom: 0.3rem;
`;

const Container = styled.div`
  position: relative;
  top: -100px;
  margin: 3rem;
  .slick-list {
    overflow: visible;
  }
  .slick-next:before {
    position: absolute;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 5px;
    background: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    right: -23px;
    height: 9rem;
    top: -65px;
  }
  .slick-prev {
    z-index: 10;
    position: absolute;
    padding: 0px 20px;
    display: flex;
    align-items: center;
    overflow: hidden;
    border-radius: 5px;
    background: linear-gradient(to left, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    left: -48px;
    height: 9.2rem;
    top: 72px;
  }
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

export default ContentList;

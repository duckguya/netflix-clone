/* eslint-disable */
import { useQuery } from "@tanstack/react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getTvDetail, IGetMovieDetail, ITv } from "../api";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";

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
const Row = styled(motion.div)`
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
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  /* width: 100%; */
  bottom: 0;
  width: 100%;
  h4 {
    text-align: center;
    font-size: 18px;
  }
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const TvDetail = styled(motion.div)`
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

interface IProps {
  keyword: string;
  results: ITv[];
}

function SearchMovie({ keyword, results }: IProps) {
  const location = useLocation();
  const tvId = new URLSearchParams(location.search).get("tvId");
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/search/:tvId");
  const { scrollY } = useScroll();

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["search", tvId],
    async () => await getTvDetail(Number(tvId)),
    { enabled: !!tvId }
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (tvId: number) => {
    navigate(`/search?keyword=${keyword}&tvId=${tvId}`);
  };

  const onOverlayClicked = () => navigate(`/search?keyword=${keyword}`);
  const clickedTv =
    bigTvMatch?.params.tvId &&
    results?.find((tv) => String(tv.id) === bigTvMatch.params.tvId);

  return (
    <Wrapper>
      <TitleType>Tv</TitleType>
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
              // .slice(offset * index, offset * index + offset)
              .filter((m) => m.backdrop_path)
              .map((tv) => (
                <Box
                  layoutId={tv.id + ""}
                  key={tv.id}
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
      </AnimatePresence>
      <AnimatePresence>
        {tvId ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <TvDetail style={{ top: scrollY.get() - 200 }} layoutId={tvId}>
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
            </TvDetail>
          </>
        ) : null}
      </AnimatePresence>
    </Wrapper>
  );
}
export default SearchMovie;

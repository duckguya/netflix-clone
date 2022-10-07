/* eslint-disable */
import { AnimatePresence, motion, useScroll } from "framer-motion";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import { makeImagePath } from "../utils";
import { getMovieDetail, IGetMovieDetail } from "../api";
import { useQuery } from "@tanstack/react-query";

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
  width: 90vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.veryDark};
  letter-spacing: 0.5px;
  word-spacing: 0.1px;
  line-height: 20px;
  z-index: 10;
  @media screen and (min-width: 1200px) {
    width: 50vw;
  }
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

const ContentWrapper = styled.div`
  display: flex;
  padding: 20px;
`;
const ContentLeft = styled.p`
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
  width: 30vw;
  font-size: 13px;
  label {
    color: ${(props) => props.theme.black.lighter};
  }
`;
const ContentDetail = styled.div`
  display: flex;
  p {
    padding-right: 1rem;
  }
`;
const OverView = styled.p`
  padding-top: 2rem;
  font-size: 13px;
`;

interface IProps {
  // results: IMovie[];
  titleType: string;
  // movieId: number;
}

function MovieDetail({ titleType }: IProps) {
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const onOverlayClicked = () => navigate("/");

  const bigMovieMatch = useMatch("/movies/:movieId");

  let params = useParams();
  let id = Number(params.movieId);

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["movies", id],
    () => getMovieDetail(id),
    { enabled: !!id }
  );
  console.log(data);

  // const clickedMovie =
  //   bigMovieMatch?.params.movieId &&
  //   results.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);
  // const clickedMovie = results.find((movie) => movie.id === movieId);

  return (
    <>
      <AnimatePresence>
        {bigMovieMatch ? (
          <>
            <Overlay
              onClick={onOverlayClicked}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {
              <BigMovie
                style={{ top: scrollY.get() + 100 }}
                layoutId={bigMovieMatch.params.movieId + titleType}
              >
                {data && (
                  <>
                    <BigCover
                      style={{
                        backgroundImage: `linear-gradient(to top, #141414, transparent), url(${makeImagePath(
                          data.backdrop_path,
                          "w500"
                        )})`,
                      }}
                    />
                    <BigTitle>{data.title}</BigTitle>
                    <ContentWrapper>
                      <ContentLeft>
                        <ContentDetail>
                          <p>{data.release_date.split("-")[0]}</p>
                          <p>{data.runtime}분</p>
                          <p>{data.vote_average}별</p>
                        </ContentDetail>
                        <OverView>{data.overview}</OverView>
                      </ContentLeft>
                      <ContentRight>
                        <label>장르:</label>
                        <p>
                          {data.genres.map((d) =>
                            d.id === data.genres[data.genres.length - 1].id
                              ? d.name
                              : d.name + ", "
                          )}
                        </p>
                      </ContentRight>
                    </ContentWrapper>
                  </>
                )}
              </BigMovie>
            }
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

export default MovieDetail;

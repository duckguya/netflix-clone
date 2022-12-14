import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getNowPlaying,
  getTopRated,
  getUpcoming,
  IGetMoviesResult,
} from "../api";
import { makeImagePath } from "../utils/makeImagePath";
import ContentList from "../Components/ContentList";
import { ContentSkeleton } from "../Components/ContentSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

function Home() {
  const queryClient = useQueryClient();

  const {
    data: nowPlaying,
    isLoading: isLoadingNow,
    isError: isErrorNow,
  } = useQuery<IGetMoviesResult>(["movies", "now_playing"], getNowPlaying);
  const {
    data: upcoming,
    isLoading: isLoadingComing,
    error: isErrorComing,
  } = useQuery<IGetMoviesResult>(
    ["movies", "up_coming"],
    async () => await getUpcoming()
  );

  const {
    data: topRated,
    isLoading: isLoadingTopRated,
    isError: isErrorTopRated,
  } = useQuery<IGetMoviesResult>(
    ["movies", "top_rated"],
    async () => await getTopRated()
  );

  let state = "ok";
  if (isLoadingNow || isLoadingComing || isLoadingTopRated) {
    state = "loading";
  } else if (isErrorNow || isErrorComing || isErrorTopRated) {
    state = "error";
  }

  const onRetry = () => {
    queryClient.refetchQueries(["search"]);
  };

  return (
    <>
      <Helmet>
        <title>movies</title>
      </Helmet>
      <Wrapper state={state}>
        {state === "error" && (
          <Error>
            <FontAwesomeIcon icon={faCircleExclamation} size="10x" />
            <p>에러가 발생했습니다. 다시 시도할까요?</p>
            <button onClick={onRetry}>재시도</button>
          </Error>
        )}
        {state === "loading" && (
          <LoadingContainer>
            <ContentSkeleton />
          </LoadingContainer>
        )}

        {state === "ok" && (
          <>
            <Banner
              bgPhoto={makeImagePath(
                nowPlaying?.results[0].backdrop_path || ""
              )}
            >
              <Title>{nowPlaying?.results[0].title}</Title>
              <Overview>
                {nowPlaying?.results[0].overview &&
                nowPlaying?.results[0].overview.length > 100
                  ? nowPlaying.results[0].overview.slice(0, 200) + "..."
                  : nowPlaying?.results[0].overview}
              </Overview>
            </Banner>
            <SlideWrapper>
              {nowPlaying ? (
                <ContentList
                  {...nowPlaying}
                  titleType="현재 상영 중인 영화"
                  type="movie"
                />
              ) : (
                ""
              )}
              {topRated ? (
                <ContentList
                  {...topRated}
                  titleType="가장 인기있는 영화"
                  type="movie"
                />
              ) : (
                ""
              )}
              {upcoming ? (
                <ContentList
                  {...upcoming}
                  titleType="개봉 예정 영화"
                  type="movie"
                />
              ) : (
                ""
              )}
            </SlideWrapper>
          </>
        )}
      </Wrapper>
    </>
  );
}

const Wrapper = styled.div<{ state: string }>`
  /* background: ${(props) => props.theme.black.veryDark}; */
  background: ${(props) => props.theme.black.veryDark};
  height: ${(props) => (props.state === "error" ? "100vh" : 0)};
  display: ${(props) => (props.state === "error" ? "flex" : "block")};
  justify-content: ${(props) => (props.state === "error" ? "center" : "none")};
  align-items: ${(props) => (props.state === "error" ? "center" : "none")};
  text-align: ${(props) => (props.state === "error" ? "center" : "none")};
`;

const Loader = styled.div`
  height: 20vw;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 90vh;
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
  font-size: 3rem;
  font-weight: 400;
  margin-bottom: 1rem;
  color: white;
`;
const Overview = styled.p`
  font-size: 1rem;
  line-height: 20px;
  width: 50%;
  height: 30%;
  padding-bottom: 3rem;
  color: white;
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
const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0px 38px;
`;

const Error = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    /* font-size: 20px; */
    margin: 30px;
  }
  button {
    border-radius: 10px;
    border: 1px solid white;
    color: white;
    padding: 5px 10px;
    background-color: transparent;
    cursor: pointer;
    &:hover {
      color: tomato;
      border: 1px solid tomato;
    }
    &:active {
      color: gray;
      border: 1px solid gray;
    }
  }
`;

export default Home;

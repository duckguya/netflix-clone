import { useQuery, useQueryClient } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getTvAiringToday,
  getTvPopular,
  getTvTopRated,
  IGetTvResult,
} from "../api";
import { makeImagePath } from "../utils/makeImagePath";
import ContentList from "../Components/ContentList";
import { ContentSkeleton } from "../Components/ContentSkeleton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet-async";

function Tv() {
  const queryClient = useQueryClient();

  const {
    data: airingData,
    isLoading: isLoadingAiring,
    isError: isErrorAiringToday,
  } = useQuery<IGetTvResult>(
    ["tvs", "airing_today"],
    async () => await getTvAiringToday()
  );
  const {
    data: popularData,
    isLoading: isLoadingPopular,
    isError: isErrorPopular,
  } = useQuery<IGetTvResult>(
    ["tvs", "popular"],
    async () => await getTvPopular()
  );
  const {
    data: ratedData,
    isLoading: isLoadingRatedLoading,
    isError: isErrorRated,
  } = useQuery<IGetTvResult>(
    ["tvs", "top_rated"],
    async () => await getTvTopRated()
  );

  let state = "ok";
  if (isLoadingAiring || isLoadingPopular || isLoadingRatedLoading) {
    state = "loading";
  } else if (isErrorAiringToday || isErrorPopular || isErrorRated) {
    state = "error";
  }
  const onRetry = () => {
    queryClient.refetchQueries(["search"]);
  };

  return (
    <>
      <Helmet>
        <title>tv-shows</title>
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
              bgPhoto={makeImagePath(ratedData?.results[0].backdrop_path || "")}
            >
              <Title>{ratedData?.results[0].name}</Title>
              <Overview>
                {ratedData?.results[0].overview &&
                ratedData?.results[0].overview.length > 100
                  ? ratedData?.results[0].overview.slice(0, 200) + "..."
                  : ratedData?.results[0].overview}
              </Overview>
            </Banner>
            <SlideWrapper>
              {airingData ? (
                <ContentList
                  {...airingData}
                  titleType="방영 중인 TV 프로그램"
                  type="tv"
                />
              ) : (
                ""
              )}
              {popularData ? (
                <ContentList
                  {...popularData}
                  titleType="인기있는 TV 프로그램"
                  type="tv"
                />
              ) : (
                ""
              )}
              {ratedData ? (
                <ContentList
                  {...ratedData}
                  titleType="최고 시청률을 기록한 TV 프로그램"
                  type="tv"
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
  font-size: 1.3rem;
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
export default Tv;

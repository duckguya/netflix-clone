import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieSearch,
  getTvSearch,
  IGetMoviewSearch,
  IGetTvSearch,
} from "../api";
import { ContentSkeleton } from "../Components/ContentSkeleton";
import SearchContents from "../Components/SearchContents";

/*
const useMe = () => {
  const { data: me } = useQuery('/me', {
    refetchOnMount: false,
  });
  return me;
}
*/

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");
  const queryClient = useQueryClient();

  //  const me = useMe();

  const {
    data: movies,
    isLoading: moviesLoading,
    isError: isErrorMovie,
  } = useQuery<IGetMoviewSearch>(["search", "movies", keyword], () =>
    getMovieSearch(keyword || "")
  );
  const {
    data: tvs,
    isLoading: tvsLoading,
    isError: isErrorTv,
  } = useQuery<IGetTvSearch>(["search", "tvs", keyword], () =>
    getTvSearch(keyword || "")
  );

  let state = "ok";
  if (isErrorTv || isErrorMovie) {
    state = "error";
  } else if (tvsLoading || moviesLoading) {
    state = "loading";
  }

  const onRetry = () => {
    queryClient.refetchQueries(["search"]);
  };

  return (
    <Wrapper>
      <TitleType>'{keyword}'</TitleType>

      {state === "error" && (
        <div>
          에러가 발생했습니다. 다시 시도할까요?
          <button onClick={onRetry}>재시도</button>
        </div>
      )}

      {state === "loading" && (
        <LoadingContainer>
          <ContentSkeleton />
        </LoadingContainer>
      )}
      {state === "ok" && (
        <>
          {movies ? (
            <SearchContents
              {...movies}
              type={"movie"}
              keyword={keyword || ""}
            />
          ) : (
            ""
          )}
          <Space />
          {tvs ? (
            <SearchContents {...tvs} type={"tv"} keyword={keyword || ""} />
          ) : (
            ""
          )}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background: ${(props) => props.theme.black.veryDark};
  margin-top: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* position: relative; */
  /* top: -100px; */
  /* margin: 4.5rem; */
  width: 100%;
`;

const TitleType = styled.p`
  display: flex;
  justify-content: center;
  font-size: 3rem;
  padding-bottom: 5rem;
`;

const LoadingContainer = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  gap: 10px;

  padding: 0px 38px;
`;
const Space = styled.div`
  margin: 3rem 0;
`;

export default Search;

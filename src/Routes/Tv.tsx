import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import {
  getTvAiringToday,
  getTvPopular,
  getTvTopRated,
  IGetTvResult,
} from "../api";
import { makeImagePath } from "../utils";
import MovieList from "../Components/MovieList";
import TvList from "../Components/TvList";
import ContentList from "../Components/ContentList";

const Wrapper = styled.div`
  /* background: ${(props) => props.theme.black.veryDark}; */
  background: ${(props) => props.theme.black.veryDark};
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
  font-size: 4rem;
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

function Tv() {
  const { data: airingData, isLoading: airingLoading } = useQuery<IGetTvResult>(
    ["tvs", "airing_today"],
    async () => await getTvAiringToday()
  );
  const { data: popularData, isLoading: popularLoading } =
    useQuery<IGetTvResult>(
      ["tvs", "popular"],
      async () => await getTvPopular()
    );
  const { data: ratedData, isLoading: ratedLoading } = useQuery<IGetTvResult>(
    ["tvs", "top_rated"],
    async () => await getTvTopRated()
  );

  return (
    <Wrapper>
      {airingLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner
            bgPhoto={makeImagePath(airingData?.results[0].backdrop_path || "")}
          >
            <Title>{airingData?.results[0].name}</Title>
            <Overview>
              {airingData?.results[0].overview &&
              airingData?.results[0].overview.length > 100
                ? airingData?.results[0].overview.slice(0, 300) + "..."
                : airingData?.results[0].overview}
            </Overview>
          </Banner>
          <SlideWrapper>
            {airingData ? (
              <ContentList {...airingData} titleType="Airing Today" type="tv" />
            ) : (
              ""
            )}
            {popularData ? (
              <ContentList {...popularData} titleType="Popular" type="tv" />
            ) : (
              ""
            )}
            {ratedData ? (
              <ContentList {...ratedData} titleType="Top Rated" type="tv" />
            ) : (
              ""
            )}
          </SlideWrapper>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;

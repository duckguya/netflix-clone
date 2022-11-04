/* eslint-disable */
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useScroll } from "framer-motion";
import { IMovie } from "../api";
import SearchGridItems from "./SearchGridItems";
import ContentDetail from "./ContentDetail";
import { useDetailMovie, useDetailTv } from "../Query/Queries";

interface IProps {
  keyword: string;
  results: IMovie[];
}

function SearchMovie({ keyword, results }: IProps) {
  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get("movieId");
  const tvId = new URLSearchParams(location.search).get("tvId");
  // let params = useParams();
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/search/:movieId");
  const { scrollY } = useScroll();

  const onBoxClicked = (movieId: number) => {
    navigate(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  // detail data
  const { data: movieData, isLoading: movieIsLoading } = useDetailMovie(
    Number(movieId)
  );
  const { data: tvData, isLoading: tvIsLoading } = useDetailTv(Number(tvId));

  return (
    <>
      <SearchGridItems
        type="Movie"
        results={results}
        onBoxClicked={onBoxClicked}
      />
      {movieData ? (
        <ContentDetail data={movieData} type={"movie"} category={"search"} />
      ) : (
        ""
      )}
      {tvData ? (
        <ContentDetail data={tvData} type={"tv"} category={"search"} />
      ) : (
        ""
      )}
    </>
  );
}
export default SearchMovie;

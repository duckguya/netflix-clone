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
  type: string;
}

function SearchContents({ keyword, results, type }: IProps) {
  const location = useLocation();
  const typeName = type === "movie" ? "movieId" : "tvId";
  const contentId = new URLSearchParams(location.search).get(typeName);
  // let params = useParams();
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/search/:movieId");
  const { scrollY } = useScroll();

  const onBoxClicked = (id: number) => {
    navigate(`/search?keyword=${keyword}&${typeName}=${id}`);
  };

  // detail data
  const { data: movieData, isLoading: movieIsLoading } = useDetailMovie(
    Number(contentId)
  );
  const { data: tvData, isLoading: tvIsLoading } = useDetailTv(
    Number(contentId)
  );

  console.log("movieData", movieData);
  console.log("tvData", tvData);

  return (
    <>
      <SearchGridItems
        type={type}
        results={results}
        onBoxClicked={onBoxClicked}
      />
      {type === "movie" ? (
        movieData ? (
          <ContentDetail data={movieData} type={type} />
        ) : (
          ""
        )
      ) : (
        ""
      )}
      {type === "tv" ? (
        tvData ? (
          <ContentDetail data={tvData} type={type} />
        ) : (
          ""
        )
      ) : (
        ""
      )}
    </>
  );
}
export default SearchContents;

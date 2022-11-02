import { useQuery } from "@tanstack/react-query";

import { IGetMoviewSearch, getMovieSearch } from "../api";

/*
export const useSearchMovie = (keyword: string) => {
  return useQuery<IGetMoviewSearch>(["search", "movies", keyword, () =>
    getMovieSearch(keyword || "")
  );
};*/

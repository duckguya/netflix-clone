import { useQuery } from "@tanstack/react-query";

import {
  IGetMoviewSearch,
  getMovieSearch,
  IGetMovieDetail,
  getMovieDetail,
  IGetTvDetail,
  getTvDetail,
} from "../api";

/*
export const useSearchMovie = (keyword: string) => {
  return useQuery<IGetMoviewSearch>(["search", "movies", keyword, () =>
    getMovieSearch(keyword || "")
  );
};*/

export const useDetailMovie = (contentId: number) => {
  return useQuery<IGetMovieDetail>(
    ["movies", contentId],
    async () => await getMovieDetail(contentId),
    { enabled: !!contentId }
  );
};

export const useDetailTv = (contentId: number) => {
  return useQuery<IGetTvDetail>(
    ["tvs", contentId],
    async () => await getTvDetail(contentId),
    { enabled: !!contentId }
  );
};

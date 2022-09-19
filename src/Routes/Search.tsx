import { useQuery } from "@tanstack/react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import {
  getMovieSearch,
  getTvSearch,
  IGetMoviewSearch,
  IGetTvSearch,
} from "../api";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { getNowPlaying, IGetMoviesResult, IMovie } from "../api";
import { makeImagePath } from "../utils";
import SearchMovie from "../Components/SearchMovie";
import SearchTv from "../Components/SearchTv";
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

const Loader = styled.div`
  height: 20vw;
  font-size: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Space = styled.div`
  margin: 3rem 0;
`;

function Search() {
  const location = useLocation();
  const keyword = new URLSearchParams(location.search).get("keyword");

  const { data: movies, isLoading: moviesLoading } = useQuery<IGetMoviewSearch>(
    ["search", "movies"],
    () => getMovieSearch(keyword || "")
  );
  const { data: tvs, isLoading: tvsLoading } = useQuery<IGetTvSearch>(
    ["search", "tvs"],
    () => getTvSearch(keyword || "")
  );

  return (
    <Wrapper>
      {moviesLoading ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <TitleType>'{keyword}'</TitleType>
          {movies ? <SearchMovie {...movies} keyword={keyword || ""} /> : ""}
          <Space />
          {tvs ? <SearchTv {...tvs} keyword={keyword || ""} /> : ""}
        </>
      )}
    </Wrapper>
  );
}
export default Search;

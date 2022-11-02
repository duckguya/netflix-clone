/* eslint-disable */
import { useQuery } from "@tanstack/react-query";
import {
  useLocation,
  useMatch,
  useNavigate,
  useParams,
} from "react-router-dom";
import styled from "styled-components";
import { getMovieDetail, IGetMovieDetail } from "../api";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { IMovie } from "../api";
import { makeImagePath } from "../utils";
import SearchGridItems from "./SearchGridItems";

interface IProps {
  keyword: string;
  results: IMovie[];
}

function SearchMovie({ keyword, results }: IProps) {
  const location = useLocation();
  const movieId = new URLSearchParams(location.search).get("movieId");
  // let params = useParams();
  const navigate = useNavigate();
  const bigMovieMatch = useMatch("/search/:movieId");
  const { scrollY } = useScroll();

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["search", movieId],
    async () => await getMovieDetail(Number(movieId)),
    { enabled: !!movieId }
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (movieId: number) => {
    navigate(`/search?keyword=${keyword}&movieId=${movieId}`);
  };

  const onOverlayClicked = () => navigate(`/search?keyword=${keyword}`);
  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    results?.find((movie) => String(movie.id) === bigMovieMatch.params.movieId);

  return (
    <SearchGridItems
      title="Movie"
      results={results}
      onBoxClicked={onBoxClicked}
    />
  );
}
export default SearchMovie;

/* eslint-disable */
import { useQuery } from "@tanstack/react-query";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { getTvDetail, IGetMovieDetail, ITv } from "../api";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { useState } from "react";
import { makeImagePath } from "../utils";
import SearchGridItems from "./SearchGridItems";

interface IProps {
  keyword: string;
  results: ITv[];
}

function SearchMovie({ keyword, results }: IProps) {
  const location = useLocation();
  const tvId = new URLSearchParams(location.search).get("tvId");
  const navigate = useNavigate();
  const bigTvMatch = useMatch("/search/:tvId");
  const { scrollY } = useScroll();

  const { data, isLoading } = useQuery<IGetMovieDetail>(
    ["search", tvId],
    async () => await getTvDetail(Number(tvId)),
    { enabled: !!tvId }
  );

  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const toggleLeaving = () => {
    setLeaving((prev) => !prev);
  };

  const onBoxClicked = (tvId: number) => {
    navigate(`/search?keyword=${keyword}&tvId=${tvId}`);
  };

  const onOverlayClicked = () => navigate(`/search?keyword=${keyword}`);
  const clickedTv =
    bigTvMatch?.params.tvId &&
    results?.find((tv) => String(tv.id) === bigTvMatch.params.tvId);

  return (
    <SearchGridItems title="Tv" results={results} onBoxClicked={onBoxClicked} />
  );
}
export default SearchMovie;

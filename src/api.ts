import axios from "axios";

const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITv {
  id: number;
  poster_path: string;
  backdrop_path: string;
  name: string;
  overview: string;
}

export interface IGetTvResult {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

export interface IGetMoviewSearch {
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface IGetTvSearch {
  page: number;
  results: ITv[];
  total_pages: number;
  total_results: number;
}

interface IGenres {
  id: number;
  name: string;
}

export interface IGetMovieDetail {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: object;
  budget: number;
  genres: IGenres[];
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  // production_companies:object;
  // production_countries:object;
  release_date: string;
  revenue: number;
  runtime: number;
  // spoken_languages:object;
  status: string;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface ISeasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface IGetTvDetail {
  adult: boolean;
  backdrop_path: string;
  // created_by:object;
  episode_run_time: [];
  first_air_date: string;
  genres: object;
  homepage: IGenres[];
  id: number;
  in_production: boolean;
  // languages:object;
  last_air_date: string;
  // last_episode_to_air:object;
  name: string;
  // next_episode_to_air:object;
  // networks:object;
  number_of_episodes: number;
  number_of_seasons: number;
  // origin_country:object;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  // production_companies:object;
  // production_countries:object;
  seasons: ISeasons[];
  // spoken_languages:object;
  status: string;
  tagline: string;
  type: string;
  vote_average: number;
  vote_count: number;
}
export interface IGetSimilarMovie {
  dates: { maximum: string; minimum: string };
  page: number;
  results: ISimilarMovie[];
  total_pages: number;
  total_results: number;
}
export interface ISimilarMovie {
  adult: boolean;
  backdrop_path: string;
  genre_ids: object;
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

interface IVideos {
  iso_639_1: string;
  iso_3166_1: string;
  name: string;
  key: string;
  site: string;
  size: number;
  type: string;
  official: boolean;
  published_at: string;
  id: string;
}
export interface IGetMovieVideos {
  id: number;
  results: IVideos[];
}

// movie list
export async function getNowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

export function getTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

// tv list
export function getTvAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getTvPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}
export function getTvTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  ).then((response) => response.json());
}

// search
export function getMovieSearch(keyowrd: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${keyowrd}&language=ko-KR`
  ).then((response) => response.json());
}
export function getTvSearch(keyowrd: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${keyowrd}&language=ko-KR`
  ).then((response) => response.json());
}

// detail
export async function getMovieDetail(movieId: number) {
  const response = await axios.get(
    `${BASE_PATH}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
  // return fetch(
  //   `${BASE_PATH}/movie/${movieId}?api_key=${process.env.REACT_APP_API_KEY}`
  // ).then((response) => response.json());
}
export async function getTvDetail(tvId: number) {
  const response = await axios.get(
    `${BASE_PATH}/tv/${tvId}?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
}

// get similar
export async function getSimilarMovies(movieId: number) {
  const response = await axios.get(
    `${BASE_PATH}/movie/${movieId}/similar?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR&page=1`
  );
  return response.data;
}

// get videos
export async function getMovieVideos(id: number) {
  const response = await axios.get(
    `${BASE_PATH}/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
}

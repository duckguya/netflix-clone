import axios from "axios";

const BASE_PATH = "https://api.themoviedb.org/3";
const KEY = process.env.REACT_APP_API_KEY;

axios.defaults.baseURL = BASE_PATH;

export class IContent {
  id!: number;
  poster_path!: string;
  backdrop_path!: string;
  name!: string;
  overview!: string;
  vote_average!: number;
  title!: string;
  release_date!: string;
  adult!: boolean;
}

export class IMovie extends IContent {}
export class ITv extends IContent {}

export interface IGetMoviesResult {
  dates: { maximum: string; minimum: string };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
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

class IContentDetail {
  adult!: boolean;
  backdrop_path!: string;
  belongs_to_collection!: object;
  budget!: number;
  genres!: IGenres[];
  homepage!: string;
  id!: number;
  imdb_id!: string;
  original_language!: string;
  original_title!: string;
  overview!: string;
  popularity!: number;
  poster_path!: string;
  release_date!: string;
  revenue!: number;
  runtime!: number;
  status!: string;
  tagline!: string;
  title!: string;
  name!: string;
  video!: boolean;
  vote_average!: number;
  vote_count!: number;
  first_air_date!: string;
  last_air_date!: string;
}

export interface IGetMovieDetail extends IContentDetail {}

interface ISeasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}

export interface IGetTvDetail extends IContentDetail {
  episode_run_time: [];
  name: string;
  original_name: string;
  seasons: ISeasons[];
  type: string;
}
export interface IGetSimilarMovie {
  // dates: { maximum: string; minimum: string };
  page: number;
  results: ISimilarMovie[];
  total_pages: number;
  total_results: number;
}
export class ISimilarMovie {
  adult!: boolean;
  backdrop_path!: string;
  genre_ids!: object;
  id!: number;
  original_language!: string;
  original_title!: string;
  overview!: string;
  popularity!: number;
  poster_path!: string;
  release_date!: string;
  title!: string;
  name!: string;
  video!: boolean;
  vote_average!: number;
  vote_count!: number;
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
export interface IGetVideos {
  id: number;
  results: IVideos[];
}

// movie list
export async function getNowPlaying() {
  const response = await axios.get(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
}

export async function getUpcoming() {
  const response = await axios.get(
    `${BASE_PATH}/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
}

export async function getTopRated() {
  const response = await axios.get(
    `${BASE_PATH}/movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
}

// tv list
export async function getTvAiringToday() {
  const response = await axios.get(
    `${BASE_PATH}/tv/airing_today?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );

  return {
    ...response.data,
    results: response.data.results.filter((d: any) => d.backdrop_path !== null),
  };
}
export async function getTvPopular() {
  const response = await axios.get(
    `${BASE_PATH}/tv/popular?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return {
    ...response.data,
    results: response.data.results.filter((d: any) => d.backdrop_path !== null),
  };
}
export async function getTvTopRated() {
  const response = await axios.get(
    `${BASE_PATH}/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return {
    ...response.data,
    results: response.data.results.filter((d: any) => d.backdrop_path !== null),
  };
}

// search
export async function getMovieSearch(keyowrd: string) {
  const response = await axios.get(
    `${BASE_PATH}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${keyowrd}&language=ko-KR`
  );

  return {
    ...response.data,
    results: response.data.results.map((x: any) => ({
      ...x,
      name: x.title,
    })),
  };
}
export async function getTvSearch(keyowrd: string) {
  const response = await axios.get(
    `${BASE_PATH}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${keyowrd}&language=ko-KR`
  );
  return response.data;
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
export async function getSimilarTvs(movieId: number) {
  const response = await axios.get(
    `${BASE_PATH}/tv/${movieId}/similar?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR&page=1`
  );
  return response.data;
}

// get videos
export const getMovieVideos = async (id: number) => {
  const response = await axios.get(
    `${BASE_PATH}/movie/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
};
export const getTvVideos = async (id: number) => {
  const response = await axios.get(
    `${BASE_PATH}/tv/${id}/videos?api_key=${process.env.REACT_APP_API_KEY}&language=ko-KR`
  );
  return response.data;
};

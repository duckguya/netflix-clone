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

// movie
export function getNowPlaying() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}`
  ).then((response) => response.json());
}

export function getUpcoming() {
  return fetch(
    `${BASE_PATH}/movie/upcoming?api_key=${process.env.REACT_APP_API_KEY}`
  ).then((response) => response.json());
}

export function getTopRated() {
  return fetch(
    `${BASE_PATH}/movie/top_rated?api_key=${process.env.REACT_APP_API_KEY}`
  ).then((response) => response.json());
}

// tv
export function getTvAiringToday() {
  return fetch(
    `${BASE_PATH}/tv/airing_today?api_key=${process.env.REACT_APP_API_KEY}`
  ).then((response) => response.json());
}
export function getTvPopular() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${process.env.REACT_APP_API_KEY}`
  ).then((response) => response.json());
}
export function getTvTopRated() {
  return fetch(
    `${BASE_PATH}/tv/top_rated?api_key=${process.env.REACT_APP_API_KEY}`
  ).then((response) => response.json());
}

// search movie
export function getMovieSearch(keyowrd: string) {
  return fetch(
    `${BASE_PATH}/search/movie?api_key=${process.env.REACT_APP_API_KEY}&query=${keyowrd}`
  ).then((response) => response.json());
}
// search tv
export function getTvSearch(keyowrd: string) {
  return fetch(
    `${BASE_PATH}/search/tv?api_key=${process.env.REACT_APP_API_KEY}&query=${keyowrd}`
  ).then((response) => response.json());
}

const BASE = "https://api.themoviedb.org/3";
const KEY = import.meta.env.VITE_TMDB_KEY || "3fd2e1d0b17cbfd8a43f9a721a97d9e2";

export async function searchMovie(query) {
  const res = await fetch(`${BASE}/search/movie?api_key=${KEY}&query=${query}&language=id-ID`);
  const data = await res.json();
  return data.results;
}

export async function getPopularMovies() {
  const res = await fetch(`${BASE}/movie/popular?api_key=${KEY}&language=id-ID&limit=25`);
  const data = await res.json();
  return data.results;
}

export async function getTopRatedMovies() {
  const res = await fetch(`${BASE}/movie/top_rated?api_key=${KEY}&language=id-ID&limit=25`);
  const data = await res.json();
  return data.results;
}

export async function getTrendingMovies() {
  const res = await fetch(`${BASE}/trending/movie/week?api_key=${KEY}&language=id-ID`);
  const data = await res.json();
  return data.results;
}

export const IMG_BASE = "https://image.tmdb.org/t/p/w300";

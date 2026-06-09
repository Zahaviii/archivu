const BASE = "https://api.jikan.moe/v4";

export async function searchAnime(query) {
  const res = await fetch(`${BASE}/anime?q=${query}&limit=20`);
  const data = await res.json();
  return data.data;
}

export async function getTopAnime() {
  const res = await fetch(`${BASE}/top/anime?limit=25`);
  const data = await res.json();
  return data.data;
}

export async function getPopularAnime() {
  const res = await fetch(`${BASE}/top/anime?filter=bypopularity&limit=25`);
  const data = await res.json();
  return data.data;
}

export async function getAiringAnime() {
  const res = await fetch(`${BASE}/top/anime?filter=airing&limit=25`);
  const data = await res.json();
  return data.data;
}

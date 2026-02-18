const BASE_URL = "https://api.rawg.io/api";
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

async function request(endpoint) {
  if (!API_KEY) {
    throw new Error("Falta VITE_RAWG_KEY en el archivo .env");
  }

  const url = `${BASE_URL}${endpoint}${endpoint.includes("?") ? "&" : "?"}key=${API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Error API (${res.status})`);
  }

  return res.json();
}

export function getPopularGames(page = 1, pageSize = 20) {
  return request(`/games?ordering=-rating&page=${page}&page_size=${pageSize}`);
}

export function searchGames(query, page = 1, pageSize = 20) {
  return request(`/games?search=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`);
}

export function getGameDetail(id) {
  return request(`/games/${id}`);
}

export function getGameScreenshots(id, pageSize = 12) {
  return request(`/games/${id}/screenshots?page_size=${pageSize}`);
}

export function getGamesByTag(tagSlug, page = 1, pageSize = 20) {
  return request(
    `/games?tags=${encodeURIComponent(tagSlug)}&page=${page}&page_size=${pageSize}`
  );
}

export function getGamesByGenre(genreSlug, page = 1, pageSize = 20) {
  return request(
    `/games?genres=${encodeURIComponent(genreSlug)}&page=${page}&page_size=${pageSize}`
  );
}

export function getGenreDetail(id) {
  return request(`/genres/${id}`);
}

export function getPublishers(page = 1, pageSize = 20, search = "") {
  let endpoint = `/publishers?page=${page}&page_size=${pageSize}`;
  if (search) {
    endpoint += `&search=${encodeURIComponent(search)}`;
  }
  return request(endpoint);
}

export function getPublisherDetail(id) {
  return request(`/publishers/${id}`);
}

export function getPublisherGames(publisherId, page = 1, pageSize = 20) {
  return request(
    `/games?publishers=${publisherId}&page=${page}&page_size=${pageSize}`
  );
}

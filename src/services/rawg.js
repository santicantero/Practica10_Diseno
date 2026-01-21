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

// Juegos populares (ordenados por rating, puedes cambiarlo)
export function getPopularGames(pageSize = 10) {
  return request(`/games?ordering=-rating&page_size=${pageSize}`);
}

// Buscar juegos por nombre
export function searchGames(query, pageSize = 20) {
  return request(`/games?search=${encodeURIComponent(query)}&page_size=${pageSize}`);
}

// Detalle de un juego por ID
export function getGameDetail(id) {
  return request(`/games/${id}`);
}

// Screenshots de un juego
export function getGameScreenshots(id, pageSize = 12) {
  return request(`/games/${id}/screenshots?page_size=${pageSize}`);
}

// Juegos filtrados por TAG (slug)
export function getGamesByTag(tagSlug, page = 1, pageSize = 20) {
  return request(
    `/games?tags=${encodeURIComponent(tagSlug)}&page=${page}&page_size=${pageSize}`
  );
}

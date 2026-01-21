const KEY = "favorite_games_ids";

export function getFavoriteIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function isFavorite(id) {
  const favs = getFavoriteIds();
  return favs.includes(Number(id));
}

export function toggleFavorite(id) {
  const gameId = Number(id);
  const favs = getFavoriteIds();

  const updated = favs.includes(gameId)
    ? favs.filter((x) => x !== gameId)
    : [gameId, ...favs];

  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated; // devuelve el array actualizado (por si lo quieres usar)
}

/** Set para comprobaciones rápidas */
export function getFavoriteSet() {
  return new Set(getFavoriteIds().map(Number));
}

/**
 * Filtra una lista de juegos y devuelve SOLO los que están en favoritos.
 * Si pasas query, filtra además por name (y opcionalmente tags/genres si vienen en el objeto).
 */
export function filterFavoriteGames(
  games,
  query = "",
  options = { includeGenres: true, includeTags: true }
) {
  const favSet = getFavoriteSet();
  const q = query.trim().toLowerCase();

  let favGames = (games || []).filter((g) => favSet.has(Number(g.id)));
  if (!q) return favGames;

  return favGames.filter((g) => {
    const nameMatch = (g.name || "").toLowerCase().includes(q);

    const genreMatch =
      options.includeGenres &&
      Array.isArray(g.genres) &&
      g.genres.some((gen) => (gen.name || "").toLowerCase().includes(q));

    const tagMatch =
      options.includeTags &&
      Array.isArray(g.tags) &&
      g.tags.some((t) => (t.name || "").toLowerCase().includes(q));

    return nameMatch || genreMatch || tagMatch;
  });
}

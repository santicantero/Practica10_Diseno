import { getPopularGames, searchGames } from '../../services/rawg';

export const fetchGames = (page, query) => async (dispatch) => {
    dispatch({ type: 'FETCH_GAMES_REQUEST' });
    try {
        let data;
        if (query) {
            data = await searchGames(query, page, 24);
        } else {
            data = await getPopularGames(page, 20);
        }
        dispatch({ type: 'FETCH_GAMES_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'FETCH_GAMES_FAILURE', payload: error.message });
    }
};

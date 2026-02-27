const initialState = {
    favorites: JSON.parse(localStorage.getItem('favorite_games_ids')) || [],
    profile: {
        name: "Santi",
        avatar: "👤"
    }
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_FAVORITE':
            const gameId = Number(action.payload);
            const isFav = state.favorites.includes(gameId);
            const updatedFavs = isFav
                ? state.favorites.filter(id => id !== gameId)
                : [...state.favorites, gameId];

            localStorage.setItem('favorite_games_ids', JSON.stringify(updatedFavs));
            return { ...state, favorites: updatedFavs };
        default:
            return state;
    }
}

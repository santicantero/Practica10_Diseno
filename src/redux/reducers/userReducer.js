const initialState = {
    favorites: JSON.parse(localStorage.getItem('favorite_games_ids')) || [],
    userEvents: JSON.parse(localStorage.getItem('user_events_ids')) || [],
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

        case 'TOGGLE_EVENT_SIGNUP':
            const eventId = action.payload;
            const isSignedUp = state.userEvents.includes(eventId);
            const updatedEvents = isSignedUp
                ? state.userEvents.filter(id => id !== eventId)
                : [...state.userEvents, eventId];

            localStorage.setItem('user_events_ids', JSON.stringify(updatedEvents));
            return { ...state, userEvents: updatedEvents };

        default:
            return state;
    }
}

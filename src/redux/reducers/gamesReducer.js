const initialState = {
    list: [],
    loading: false,
    error: null,
    totalResults: 0
};

export default function gamesReducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_GAMES_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_GAMES_SUCCESS':
            return {
                ...state,
                loading: false,
                list: action.payload.results,
                totalResults: action.payload.count
            };
        case 'FETCH_GAMES_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}

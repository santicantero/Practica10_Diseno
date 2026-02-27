const initialState = {
    list: [],
    userEvents: JSON.parse(localStorage.getItem('user_events_ids')) || [],
    loading: false,
    error: null
};

export default function eventsReducer(state = initialState, action) {
    switch (action.type) {
        case 'FETCH_EVENTS_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_EVENTS_SUCCESS':
            return { ...state, loading: false, list: action.payload };
        case 'FETCH_EVENTS_FAILURE':
            return { ...state, loading: false, error: action.payload };
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

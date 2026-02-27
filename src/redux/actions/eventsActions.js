import { fetchEvents as fetchEventsAPI } from '../../services/eventsService';

export const loadEvents = () => async (dispatch) => {
    dispatch({ type: 'FETCH_EVENTS_REQUEST' });
    try {
        const data = await fetchEventsAPI();
        dispatch({ type: 'FETCH_EVENTS_SUCCESS', payload: data });
    } catch (error) {
        dispatch({ type: 'FETCH_EVENTS_FAILURE', payload: error.message });
    }
};

export const toggleEventSignup = (id) => ({
    type: 'TOGGLE_EVENT_SIGNUP',
    payload: id
});

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import gamesReducer from './reducers/gamesReducer';
import userReducer from './reducers/userReducer';
import eventsReducer from './reducers/eventsReducer';

const rootReducer = combineReducers({
  games: gamesReducer,
  user: userReducer,
  events: eventsReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;

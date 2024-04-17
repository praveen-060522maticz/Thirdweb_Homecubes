import { combineReducers,createStore } from "redux";
import wallet_reducer from './action.js';


const reducer = combineReducers({
    wallet_detail:wallet_reducer
})

export const store = createStore(reducer);

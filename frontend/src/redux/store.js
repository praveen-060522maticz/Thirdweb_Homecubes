import ImpactApp from "./reducers";
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from "redux-thunk";
const middleware = [thunk];
export const store = createStore(ImpactApp,
    compose(
        applyMiddleware(...middleware),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    ));
      
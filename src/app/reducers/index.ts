import { applyMiddleware, combineReducers, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import createSagaMiddleware from 'redux-saga';

import AsyncStorage from '@react-native-async-storage/async-storage';

import auth from '../reducers/auth';
import cart from '../reducers/cart';

const sagaMiddleware = createSagaMiddleware();
const rootPersistConfig = {
    key: 'root',
    storage: AsyncStorage,
    blacklist: ['auth', 'cart'],
};

const authPersistConfig = {
    key: 'auth',
    storage: AsyncStorage,
    // Never persist UI flags — avoids "Please wait..." stuck on Login after reload
    blacklist: ['isLoading', 'isError', 'error'],
};

const cartPersistConfig = {
    key: 'cart',
    storage: AsyncStorage,
    blacklist: [],
};

const rootReducer = combineReducers({
    auth: persistReducer(authPersistConfig, auth),
    cart: persistReducer(cartPersistConfig, cart),
});

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

import rootSaga from '../sagas';

export default () => {
    let store = createStore(persistedReducer, applyMiddleware(sagaMiddleware));
    let persistor = persistStore(store);
    sagaMiddleware.run(rootSaga);

    return { store, persistor };
};
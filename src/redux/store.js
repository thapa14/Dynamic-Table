import {configureStore} from '@reduxjs/toolkit';
import rootReducer from './rootReducer'

export const store = configureStore({
    // reducer: persistReducer(rootPersistConfig, rootReducer),
    reducer: rootReducer,
    // middleware: (getDefaultMiddleware) =>
    //     getDefaultMiddleware({
    //         thunk: true,
    //         serializableCheck: false,
    //         immutableCheck: false,
    //     }),
});
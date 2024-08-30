import {combineReducers} from "@reduxjs/toolkit";
import TableViewSlice from "./slices/TableViewSlice";

const appReducer = combineReducers({
    tableViewReducer: TableViewSlice,
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_ALL_STATE') {
        return appReducer(undefined, action);
    }
    return appReducer(state, action);
};

export default rootReducer;

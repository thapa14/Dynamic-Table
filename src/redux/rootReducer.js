import {combineReducers} from "@reduxjs/toolkit";
import TableViewSlice from "./slices/TableViewSlice";

const rootReducer = combineReducers({
    tableViewReducer: TableViewSlice,
});


export default rootReducer;

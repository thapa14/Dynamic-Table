import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    tableViews: [],
    selectedTableIndex: null,
    allColumns:  [
        {value: 'name', label: 'Name'},
        {value: 'email', label: 'email'},
        {value: 'phone', label: 'Phone'},
        {value: 'website', label: 'Website'},
    ],
    allColumnsLoading: false,
    tableData: [],
    tableDataLoading: false,
}

const TableViewSlice = createSlice({
    name: "table-view",
    initialState,
    reducers: {
        setTableViews: (state, action) => {
            state.tableViews = action.payload;
        },
        setAllColumns: (state, action) => {
            state.allColumns = action.payload;
        },
        setAllColumnsLoading: (state, action) => {
            state.allColumnsLoading = action.payload;
        },
        setTableData: (state, action) => {
            state.tableData = action.payload;
        },
        setTableDataLoading: (state, action) => {
            state.tableDataLoading = action.payload;
        },
    }
})

export const {setTableViews,setAllColumns, setAllColumnsLoading, setTableData, setTableDataLoading} = TableViewSlice.actions;
export default TableViewSlice.reducer;
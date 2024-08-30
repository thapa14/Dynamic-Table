import {setTableData, setTableDataLoading} from "../slices/TableViewSlice";
import axios from "axios";

export default class TableDataActions{

    static getTableData = () => (dispatch) => {
        dispatch(setTableDataLoading(true));
        axios("https://jsonplaceholder.typicode.com/users")
            .then((response) => {
                if(response.status === 200){
                    dispatch(setTableData(response.data))
                }
                dispatch(setTableDataLoading(false));
            })
            .catch((err) => {
                console.log(err);
                dispatch(setTableDataLoading(false));
            })

    }
}
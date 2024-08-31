import {setTableData, setTableDataLoading} from "../slices/TableViewSlice";
import axios from "axios";
import {enqueueSnackbar} from "notistack";

export default class TableDataActions {
    static getTableData = () => (dispatch) => {
        dispatch(setTableDataLoading(true));
        axios("https://jsonplaceholder.typicode.com/users")
            .then((response) => {
                if (response.status === 200) {
                    dispatch(setTableData(response.data))
                } else {
                    enqueueSnackbar("oops! Something went wrong.", {variant: "error"})
                }
                dispatch(setTableDataLoading(false));
            })
            .catch((err) => {
                console.log(err);
                dispatch(setTableDataLoading(false));
                enqueueSnackbar("oops! Something went wrong.", {variant: "error"})
            })

    }
}
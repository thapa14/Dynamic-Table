import DynamicTable from "./components/DynamicTable";
import {Provider} from "react-redux";
import {store} from "./redux/store"
import {SnackbarProvider} from "notistack";

function App() {
    return <SnackbarProvider autoHideDuration={2000}>
        <Provider store={store}>
            <DynamicTable/>
        </Provider>
    </SnackbarProvider>
}

export default App;



import DynamicTable from "./components/DynamicTable";
import {Provider} from "react-redux";
import {store} from "./redux/store"

function App() {
    return <Provider store={store}>
        <DynamicTable/>
    </Provider>
}

export default App;



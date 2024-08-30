import {useEffect, useState} from "react";
import {
    Autocomplete,
    Box,
    Button,
    Card,
    Container,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    TextField, Typography
} from "@mui/material";
import TableHeadCustom from "./Table/TableHeadCustom";
import useTable from "../hooks/useTable";
import {getComparator} from "./Table/utils";
import TableNoData from "./Table/TableNoData";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import TableDataActions from "../redux/actions/TableDataActions";
import ColumnConfigurationDialog from "./ColumnConfigurationDialog";

export default function DynamicTable() {
    const dispatch = useDispatch()
    const allColumns = useSelector((state) => state.tableViewReducer.allColumns);
    const tableData = useSelector((state) => state.tableViewReducer.tableData);
    const tableViews = useSelector((state) => state.tableViewReducer.tableViews);
    const derivedTableViews = [{name: "Default", columns: [...allColumns]}, ...tableViews]
    // const [view, setView] = useState({label: "Default", value: [...allColumns]})
    const [view, setView] = useState("Default")
    const [openModal, setOpenModal] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [columns, setColumns] = useState(derivedTableViews[0]?.columns);


    useEffect(() => {
        dispatch(TableDataActions.getTableData());
    }, []);

    const {
        page,
        rowsPerPage,
        order,
        orderBy,
        onSort,
        onChangePage,
        onChangeRowsPerPage
    } = useTable();

    const filteredData = applyFilter({
        tableData,
        comparator: getComparator(order, orderBy),
        filterValue
    })

    const columnConfiguratonModalHandler = () => {
        setOpenModal(true)
    }
    const handleClose = () => {
        setOpenModal(false)
    }

    const handleTableView = (e, newValue) => {
        setView(newValue);
        setColumns(newValue?.value)
    }

    return <Container maxWidth='md'>
        <Card sx={{my: 6, py: 4}}>
            <Stack direction="row" spacing={2} sx={{mb: 2}}>
                <Typography variant="subtitle1">Views:- </Typography>
                {derivedTableViews?.map((tableView, index) => (
                    <Button key={index} size="small"
                            onClick={() => {
                                setView(tableView?.name);
                                setColumns(tableView?.columns)
                            }}
                            variant={tableView?.name === view ? 'contained' : 'outlined'}>{tableView?.name}</Button>
                ))}
                <Button variant="outlined" onClick={columnConfiguratonModalHandler}>Configuration</Button>
            </Stack>
            <Box display="grid"
                 gridTemplateColumns={{
                     xs: "repeat(1, 1fr)",
                     md: "repeat(2, 1fr)"
                 }}
                 gap={2}
            >
                {/* <Autocomplete
                    options={derivedTableViews?.map((view) => ({label: view?.name, value: view?.columns}))}
                    renderInput={(props) => <TextField {...props} label="Views"/>}
                    value={view}
                    onChange={handleTableView}
                /> */}
                <TextField fullWidth label="search" value={filterValue}
                           onChange={(e) => setFilterValue(e.target.value)}/>


            </Box>
            <DragDropContext
                onDragEnd={(result) => {
                    if (!result.destination) return;
                    const reorderedColumns = Array.from(columns);
                    const [removed] = reorderedColumns.splice(result.source.index, 1);
                    reorderedColumns.splice(result.destination.index, 0, removed);
                    if (result.source.index !== result.destination.index) {
                        setColumns(reorderedColumns);
                    }
                }}
            >
                <Droppable droppableId="droppable" direction="horizontal" isCombineEnabled>
                    {(provided) => (
                        <TableContainer sx={{position: 'relative', my: 1}} {...provided.droppableProps}
                                        ref={provided.innerRef}>
                            <Table>
                                <TableHeadCustom
                                    order={order}
                                    orderBy={orderBy}
                                    headLabel={columns}
                                    onSort={onSort}
                                />
                                <TableBody>
                                    {filteredData
                                        ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        ?.map((row) =>
                                            <TableRow key={row.value}>
                                                {columns?.map((column) => <TableCell
                                                    key={column.value}>{row[column.value]}</TableCell>)}
                                            </TableRow>)}
                                    <TableNoData isNotFound={!filteredData?.length}/>
                                </TableBody>
                                {provided.placeholder}
                            </Table>
                        </TableContainer>
                    )}
                </Droppable>
                <TablePagination
                    rowsPerPageOptions={[25, 50, 100, 150, 200]}
                    component="div"
                    count={filteredData?.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={onChangePage}
                    onRowsPerPageChange={onChangeRowsPerPage}
                />
            </DragDropContext>
        </Card>

        {openModal && <ColumnConfigurationDialog open={openModal} handleClose={handleClose}/>}
    </Container>
}

function applyFilter({tableData, comparator, filterValue}) {
    const stabilizedThis = tableData.map((el, index) => [el, index]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });

    tableData = stabilizedThis.map((el) => el[0]);

    if (filterValue) {
        tableData = tableData?.filter((data) =>
            data.name?.toLowerCase().includes(filterValue?.toLowerCase()?.trim()) ||
            data.email?.toLowerCase().includes(filterValue?.toLowerCase()?.trim()) ||
            data.phone?.toLowerCase().includes(filterValue?.toLowerCase()?.trim()) ||
            data.website?.toLowerCase().includes(filterValue?.toLowerCase()?.trim())
        )
    }

    return tableData;
}
import {useEffect, useState} from "react";
import {
    Button,
    Card,
    Container,
    IconButton, MenuItem, Popover,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TablePagination,
    TableRow,
    TextField,
    Typography,
    Checkbox
} from "@mui/material";
import TableHeadCustom from "./Table/TableHeadCustom";
import useTable from "../hooks/useTable";
import {getComparator} from "./Table/utils";
import TableNoData from "./Table/TableNoData";
import {DragDropContext, Droppable} from "react-beautiful-dnd";
import {useDispatch, useSelector} from "react-redux";
import TableDataActions from "../redux/actions/TableDataActions";
import ColumnConfigurationDialog from "./ColumnConfigurationDialog";
import {Close, TableView, ViewColumn} from "@mui/icons-material";

export default function DynamicTable() {
    const dispatch = useDispatch()
    const allColumns = useSelector((state) => state.tableViewReducer.allColumns);
    const tableData = useSelector((state) => state.tableViewReducer.tableData);
    const tableViews = useSelector((state) => state.tableViewReducer.tableViews);
    const derivedTableViews = [{name: "All", columns: [...allColumns]}, ...tableViews]
    const [view, setView] = useState("All")
    const [openModal, setOpenModal] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [columns, setColumns] = useState(derivedTableViews[0]?.columns);
    const [openMenu, setOpenMenu] = useState(null)


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

    const configurationHandler = () => {
        setOpenModal(true)
    }
    const handleClose = () => {
        setOpenModal(false)
    }

    const handleTableView = (data) => {
        setView(data?.name);
        setColumns(data?.columns)
    }

    const handleOpenMenu = (e) => {
        setOpenMenu(e.currentTarget)
    }

    const handleCloseMenu = () => {
        setOpenMenu(null)
    }

    const handleColumnVisiblity = (col) => {
        setView(null)
        setColumns((prev) => {
            const copy = Array.from(prev);
            const selectedColumnIndex = prev.findIndex((val) => val.value === col.value);
            if (selectedColumnIndex >= 0) {
                copy.splice(selectedColumnIndex, 1);
            } else {
                copy?.push((col))
            }
            return copy
        })
    }

    return <Container maxWidth='md'>
        <Card sx={{my: 6, py: 4}}>
            <Stack direction="row" spacing={2} sx={{mb: 2}} alignItems="center">
                <Typography variant="subtitle1">Views:- </Typography>
                {derivedTableViews?.map((tableView, index) => (
                    <Button key={index} size="small"
                            onClick={() => handleTableView(tableView)}
                            variant={tableView?.name === view ? 'contained' : 'outlined'}>{tableView?.name}</Button>
                ))}
                <IconButton color="secondary" aria-label="table configuration"
                            onClick={configurationHandler}><TableView/></IconButton>
                <IconButton
                    id="basic-button"
                    aria-controls={openMenu ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={openMenu ? 'true' : undefined} onClick={handleOpenMenu}>
                    <ViewColumn/>
                </IconButton>
                <Popover
                    open={Boolean(openMenu)}
                    anchorEl={openMenu}
                    onClose={handleCloseMenu}
                    anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                    transformOrigin={{vertical: 'top', horizontal: 'center'}}
                    PaperProps={{
                        sx: {
                            p: 1,
                            width: 'auto',
                            overflow: 'inherit',
                            '& .MuiMenuItem-root': {
                                px: 1,
                                typography: 'body2',
                                borderRadius: 0.75,
                                '& svg': {mr: 2, width: 20, height: 20, flexShrink: 0},
                            },
                        },
                    }}
                >
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body1">Show Columns</Typography>
                        <IconButton onClick={handleCloseMenu}>
                            <Close/>
                        </IconButton>
                    </Stack>
                    {allColumns?.map((column, index) => (
                        <MenuItem key={index} onClick={() => handleColumnVisiblity(column)}>
                            <Checkbox inputProps={{'aria-label': column.label}} checked={columns.find(col => col.value === column.value)}/> {column?.label}
                        </MenuItem>))}
                </Popover>

            </Stack>
            <Stack>
                <TextField fullWidth label="search" value={filterValue}
                           onChange={(e) => setFilterValue(e.target.value)}/>
            </Stack>
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

        {
            openModal && <ColumnConfigurationDialog open={openModal} handleClose={handleClose}/>
        }
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
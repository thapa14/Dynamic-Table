import {useEffect, useState} from "react";
import {
    Card,
    CardHeader,
    Checkbox,
    Container,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Popover,
    Stack,
    styled,
    Tab,
    Table,
    TableBody,
    TableCell,
    tableCellClasses,
    TableContainer,
    TablePagination,
    TableRow,
    Tabs,
    TextField,
    Typography
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

const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

export default function DynamicTable() {
    const dispatch = useDispatch()
    const allColumns = useSelector((state) => state.tableViewReducer.allColumns);
    const tableData = useSelector((state) => state.tableViewReducer.tableData);
    const tableViews = useSelector((state) => state.tableViewReducer.tableViews);
    const derivedTableViews = [{name: "All", columns: [...allColumns]}, ...tableViews]
    const [openModal, setOpenModal] = useState(false);
    const [filterValue, setFilterValue] = useState("");
    const [columns, setColumns] = useState(derivedTableViews[0]?.columns);
    const [openMenu, setOpenMenu] = useState(null)
    const [value, setValue] = useState('All');

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const selectedViewColumns = derivedTableViews?.find((view) => view?.name === newValue);
        setColumns(selectedViewColumns?.columns)
    };

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

    const handleOpenMenu = (e) => {
        setOpenMenu(e.currentTarget)
    }

    const handleCloseMenu = () => {
        setOpenMenu(null)
    }

    const handleColumnVisibility = (col) => {
        setValue(null)
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
        <Typography variant="h6" textAlign="center" sx={{my: 1}}>Dynamic view table</Typography>
        <Card sx={{p: 2}} variant="outlined">
            <Stack gap={2} sx={{mb: 2}}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={10}>
                        <Tabs
                            value={value}
                            onChange={handleChange}
                            variant="scrollable"
                            scrollButtons="auto"
                            aria-label="View Tabs"
                        >
                            {derivedTableViews?.map((view) => <Tab
                                key={view?.name}
                                value={view?.name}
                                label={view?.name}
                                wrapped
                                sx={{p: 1}}
                            />)}
                        </Tabs>
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Stack direction="row" justifyContent="flex-end" alignItems="center">
                            <IconButton color="primary" aria-label="table configuration"
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
                                    <MenuItem key={index} onClick={() => handleColumnVisibility(column)}>
                                        <Checkbox inputProps={{'aria-label': column.label}}
                                                  checked={columns.find(col => col.value === column.value)}/> {column?.label}
                                    </MenuItem>))}
                            </Popover>
                        </Stack>
                    </Grid>
                </Grid>
                <Stack>
                    <TextField fullWidth label="search" value={filterValue}
                               onChange={(e) => setFilterValue(e.target.value)}/>
                </Stack>
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
                            <Table aria-label="table">
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
                                            <StyledTableRow key={row.value}>
                                                {columns?.map((column) => <StyledTableCell
                                                    key={column.value}>{row[column.value]}</StyledTableCell>)}
                                            </StyledTableRow>)}
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
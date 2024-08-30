import {
    Autocomplete,
    Box,
    Button,
    Card,
    Checkbox,
    Chip,
    Dialog,
    Grid,
    IconButton,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {CheckBox, CheckBoxOutlineBlank, Close, Delete, Edit} from "@mui/icons-material";
import {useDispatch, useSelector} from "react-redux";
import {useState} from "react";
import {setTableViews} from "../redux/slices/TableViewSlice";

const icon = <CheckBoxOutlineBlank fontSize="small"/>;
const checkedIcon = <CheckBox fontSize="small"/>;


export default function ColumnConfigurationDialog({handleClose, open}) {
    const dispatch = useDispatch()
    const [selectedColumns, setSelectedColumns] = useState([])
    const [tableName, setTableName] = useState("")
    const [editableIndex, setEditableIndex] = useState(null)
    const allColumns = useSelector((state) => state.tableViewReducer.allColumns);
    const tableViews = useSelector((state) => state.tableViewReducer.tableViews);

    const handleChange = (e, newValue) => {
        setSelectedColumns(newValue)
    }
    const handleTableName = (e) => {
        setTableName(e.target.value)
    }

    const resetTableHandler = () => {
        setTableName("");
        setEditableIndex(null)
        setSelectedColumns([])
    }

    const saveTableHandler = () => {
        if (tableName && selectedColumns?.length > 0) {
            const dataForView = {name: tableName, columns: selectedColumns};
            if (editableIndex != null) {
                dispatch(setTableViews(tableViews?.with(editableIndex, dataForView)))
            } else {
                const selectedIndex = tableViews?.findIndex((list) => list.name === tableName)
                if (selectedIndex >= 0) {
                    dispatch(setTableViews(tableViews?.with(selectedIndex, dataForView)))
                } else {
                    dispatch(setTableViews([...tableViews, dataForView]))
                }
            }
        }
        resetTableHandler()
    }

    const handleDelete = (tableName) => {
        const copyList = [...tableViews];
        const deletableIndex = copyList?.findIndex((list) => list.name === tableName)
        copyList?.splice(deletableIndex, 1);
        dispatch(setTableViews(copyList))
    }
    const handleEdit = (index) => {
        setTableName(tableViews[index]?.name)
        setSelectedColumns(tableViews[index]?.columns)
        setEditableIndex(index)
    }

    const cancelEdit = () => {
        setSelectedColumns([])
        setTableName("")
        setEditableIndex(null)
    }

    return <Dialog onClose={handleClose} open={open} fullWidth maxWidth="lg" sx={{p: 2}}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{p: 3}}>
            <Typography>Column Configurations</Typography>
            <IconButton onClick={handleClose}><Close/></IconButton>
        </Stack>
        <Grid container spacing={2} sx={{p: 3}}>
            <Grid item xs={12} md={6} sx={{display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <Box display="grid"
                     gap={2}
                     gridTemplateColumns={{
                         xs: "repeat(1, 1fr)",
                         sm: "repeat(2, 1fr)"
                     }}
                >
                    <TextField
                        label="Table Name"
                        // ref={tableNameRef}
                        value={tableName}
                        onChange={handleTableName}
                    />
                    <Autocomplete
                        autoHighlight
                        openOnFocus
                        autoComplete
                        multiple
                        fullWidth
                        disableCloseOnSelect
                        options={allColumns}
                        limitTags={1}
                        value={selectedColumns}
                        onChange={handleChange}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) => option.label === value.label}
                        renderInput={(params) => (
                            <TextField {...params}
                                       label="Columns"
                            />)}

                        renderOption={(props, option, state,) => <li {...props}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{marginRight: 8}}
                                checked={state.selected}
                            />
                            {option.label}
                        </li>
                        }
                        renderTags={(values, getTagProps) =>
                            values.map((value, index) => (
                                <Chip
                                    {...getTagProps({index})}
                                    key={value.label}
                                    label={value.label}
                                />
                            ))
                        }

                    />
                </Box>
                {(selectedColumns?.length > 0 && tableName) &&
                    <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2} sx={{mt: 2}}>
                        {editableIndex != null ?
                            <Button variant="outlined" onClick={cancelEdit}>Cancel</Button> :
                            <Button variant="outlined" onClick={resetTableHandler}>Reset</Button>
                        }
                        <Button variant="contained" onClick={saveTableHandler}>Save</Button>
                    </Stack>
                }
            </Grid>
            <Grid item xs={12} md={6}>
                <Stack gap={2}>
                    {tableViews?.map((view, index) => <Card key={view?.name} sx={{p: 2}}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography>{view?.name}</Typography>
                            <Stack direction="row">
                                <IconButton onClick={() => handleDelete(view.name)}><Delete/></IconButton>
                                <IconButton onClick={() => handleEdit(index)}><Edit/></IconButton>
                            </Stack>
                        </Stack>
                    </Card>)}
                </Stack>
            </Grid>
        </Grid>
    </Dialog>
}
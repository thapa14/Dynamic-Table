import {Box, Checkbox, TableCell, TableHead, TableRow, TableSortLabel} from "@mui/material";
import {Draggable} from "react-beautiful-dnd";

const visuallyHidden = {
    border: 0,
    margin: -1,
    padding: 0,
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'noWrap',
    clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

export default function TableHeadCustom({
                                            order,
                                            orderBy,
                                            headLabel,
                                            onSort,
                                            sx,
                                        }) {
    return (
        <TableHead sx={sx}>
            <TableRow>
                {headLabel?.map((headCell, index) => (
                    <Draggable key={headCell.value} draggableId={headCell.value} index={index}>
                        {(provided) => (
                            <TableCell
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                key={headCell.value}
                                align={headCell.align || 'left'}
                                sortDirection={orderBy === headCell.value ? order : false}
                                sx={{
                                    width: headCell.width,
                                    minWidth: headCell.minWidth,
                                    bgcolor: headCell.label === "Select all" ? sx.bgcolor : ""
                                }}
                            >
                                {onSort ? (
                                    <TableSortLabel
                                        hideSortIcon
                                        active={orderBy === headCell.value}
                                        direction={orderBy === headCell.value ? order : 'asc'}
                                        onClick={() => onSort(headCell.value)}
                                        sx={{textTransform: 'capitalize'}}
                                    >
                                        {headCell.label}

                                        {orderBy === headCell.value ? (
                                            <Box sx={{...visuallyHidden}}>
                                                {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                            </Box>
                                        ) : null}
                                    </TableSortLabel>
                                ) : (
                                    headCell.label
                                )}
                            </TableCell>
                        )}
                    </Draggable>
                ))}
            </TableRow>
        </TableHead>
    );
}

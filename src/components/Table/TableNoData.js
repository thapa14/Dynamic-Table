import {TableCell, TableRow, Typography} from "@mui/material";

export default function TableNoData({isNotFound}) {

    return (
        <TableRow>
            {isNotFound ? (
                <TableCell colSpan={12}>
                    <Typography variant="subtitle2" textAlign="center">No Data</Typography>
                </TableCell>
            ) : (
                <TableCell colSpan={12} sx={{p: 0}}/>
            )}
        </TableRow>
    );
}

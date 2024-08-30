import {CircularProgress, Stack} from "@mui/material";

export default function Loader({isLoading, children, ...other}) {
    return isLoading ?
        <Stack alignItems="center" width="100%" my={10} {...other}>
            <CircularProgress disableShrink/>
        </Stack> : <>{children}</>
}
import {alpha, Autocomplete, Card, CardHeader, Dialog, IconButton, useTheme} from "@mui/material";
import {Close} from "@mui/icons-material";

export default function ColumnSettingsModal({open, handleClose}) {
    const theme = useTheme()

    return <Dialog maxwidth="md" open={open} onClose={handleClose} fullWidth>
        <Card>
            <CardHeader
                title="Choose which column you see"
                sx={{p: 3, backgroundColor: alpha(theme.palette.primary.main, 0.08)}}
                action={
                    <IconButton onClick={handleClose}>
                        <Close/>
                    </IconButton>
                }
            />
        </Card>
    </Dialog>
}
{/* <IconButton
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
                    <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
                    <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
                </Popover> */}

{/* <ColumnSettingsModal open={openMenu} handleClose={() => setOpenMenu(false)}/> */}
{/* <Autocomplete
                    variant="outlined"
                    multiple
                    fullWidth
                    margin="normal"
                    value={columns}
                    options={TABLE_HEAD}
                    getOptionLabel={(option) => option.label}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    onChange={(e, newValue) => setColumns(newValue)}
                    renderInput={props => <TextField {...props} label="Filter"/>}/> */}


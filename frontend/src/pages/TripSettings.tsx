import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import GroupAddIcon from '@mui/icons-material/GroupAdd';

const TripSettings = () => {
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const { id } = useParams()
    const navigate = useNavigate()

    const handleDeleteClose = () => {
        setOpenDelete(false)
    }

    const deleteTrip = (tripId: string) => {
        fetch(`${import.meta.env.VITE_API_URL}/trips/${tripId}`, {
            method: 'DELETE'
        })
            .then(() => {
                handleDeleteClose()
                navigate('/trips', { replace: true })
            })
    }

    return (
        <div className="flex flex-col gap-4 mt-4">
            <h2 className="text-2xl font-bold">Settings</h2>
            <Box sx={{ display: "flex", justifyContent: "space-between"}}>
                <Typography
                    variant="h3"
                    component="h2"
                >
                    People
                </Typography>
                <Button
                    variant="contained"
                >
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Typography>
                            Add
                        </Typography>
                        <GroupAddIcon />
                    </Box>
                </Button>
            </Box>
            <Dialog
                open={openDelete}
                onClose={handleDeleteClose}
            >
                <DialogTitle>Delete Trip</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                    Are you sure you want to delete this trip?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteClose}>No</Button>
                    <Button onClick={() => deleteTrip(id as string)}>Yes</Button>
                </DialogActions>
            </Dialog>
            <Button
                variant="contained"
                color="error"
                onClick={() => setOpenDelete(true)}
            >
                Delete Trip
            </Button>
        </div>
  )
}

export default TripSettings
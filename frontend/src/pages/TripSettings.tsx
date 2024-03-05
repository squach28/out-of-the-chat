import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, InputAdornment, List, ListItem, TextField, Typography } from "@mui/material"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import GroupAddIcon from '@mui/icons-material/GroupAdd'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import validator from "validator"

const TripSettings = () => {
    const [openDelete, setOpenDelete] = useState<boolean>(false)
    const [openAddPeople, setOpenAddPeople] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<string>('')
    const [addPeople, setAddPeople] = useState<string[]>([])
    const { id } = useParams()
    const navigate = useNavigate()
    
    const handleAddPeopleClose = () => {
        setOpenAddPeople(false)
    }

    const handleDeleteClose = () => {
        setOpenDelete(false)
    }

    const addPerson = (email: string) => {
        if(!validator.isEmail(email)) {
            setEmailError('Not a valid email')
        } else {
            setAddPeople([...addPeople, email])
            setEmailError('')
            setEmail('')
        }
    }

    const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if(e.code === 'Enter') {
            addPerson(email)
        }
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
                    onClick={() => setOpenAddPeople(true)}
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
                open={openAddPeople}
                onClose={handleAddPeopleClose}
            >
                <DialogTitle>Add People</DialogTitle>
                <DialogContent>
                    <TextField 
                        fullWidth
                        id="email"
                        name="email"
                        label="Email"
                        variant="standard"
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={handleOnKeyDown}
                        value={email}
                        InputProps={{
                            endAdornment: 
                                <InputAdornment position='end'>
                                    <IconButton onClick={() => addPerson(email)}>
                                        <PersonAddIcon />
                                    </IconButton>
                                </InputAdornment> 
                        }}
                        error={emailError !== ''}
                        helperText={emailError}
                    />
                    <List>
                        {addPeople.map(email => (
                            <ListItem key={email}>
                                {email}
                            </ListItem>
                        ))}
                    </List>
                    <DialogActions>
                        <Button onClick={handleAddPeopleClose}>Cancel</Button>
                        <Button onClick={handleAddPeopleClose}>Add</Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>

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
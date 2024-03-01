import { Link, useParams } from "react-router-dom"
import { Attraction } from "../types/Attraction"
import { useEffect, useState } from "react"
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { AttachMoneyOutlined } from "@mui/icons-material"


type AttractionCardProps = {
    attraction: Attraction
    toggleEditModal: (attraction: Attraction) => void
    toggleDeleteModal: (attraction: Attraction) => void
}

const AttractionCard = (attractionCardProps: AttractionCardProps) => {

    return(
        <Card className={`flex flex-col border p-3 shadow-md max-w-xlg rounded-md`}>
            <CardHeader
                action={
                    <Box>
                        <IconButton onClick={() => attractionCardProps.toggleEditModal(attractionCardProps.attraction)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => attractionCardProps.toggleDeleteModal(attractionCardProps.attraction)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                }
                title={attractionCardProps.attraction.name}
            >
            </CardHeader>
            <CardContent>
                <Typography
                    variant="body1"
                    component="p"
                >
                    {attractionCardProps.attraction.description}
                </Typography>
                {attractionCardProps.attraction.url ? 
                    <Box sx={{ display: "flex", gap: 1}}>
                        <Typography
                            variant="body1"
                            component="span"
                        >
                            URL:
                        </Typography>
                        <Link className="underline text-blue-500" target="_blank" to={attractionCardProps.attraction.url}>{attractionCardProps.attraction.url}</Link>
                    </Box>
                : 
                    null
                }
                <Typography
                    variant="body1"
                    component="p"
                >
                    Price: ${attractionCardProps.attraction.price}
                </Typography>

            </CardContent>
        </Card>
    )
}

type EditAttractionFormProps = {
    prevAttraction: Attraction
    handleClose: () => void
    updateAttraction: (attraction: Attraction) => void
}

const EditAttractionForm = (editAttractionFormProps: EditAttractionFormProps) => {
    const [attraction, setAttraction] = useState<Attraction>(editAttractionFormProps.prevAttraction)
    const [checked, setChecked] = useState<boolean>(false)
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const targetName = e.target.name
        if(targetName === 'price') {
            setAttraction({
                ...attraction,
                [e.target.name]: parseInt(e.target.value)
            })
        } else {
            setAttraction({
                ...attraction,
                [e.target.name]: e.target.value
            })
        }

    }

    const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch(e.target.name) {
            case 'free':
                setChecked(false)
                setAttraction(prev => {
                    return {
                        ...prev,
                        price: parseInt(e.target.value)
                    }
                })
                return 
            case 'notFree':
                setChecked(true)
                setAttraction(prev => {
                    return {
                        ...prev,
                        price: Number(e.target.value)
                    }
                })
                return
        }
    }

    return(
        <Dialog
            open={Boolean(editAttractionFormProps.prevAttraction)}
            onClose={editAttractionFormProps.handleClose}
            sx={{ minWidth: 400 }}
        >
            <DialogTitle>Edit Attraction</DialogTitle>
            <DialogContent>
            <form className="min-w-96 flex mt-4 p-2 flex-col gap-4">
            <TextField 
                id="name"
                name="name"
                label="Name"
                type="text"
                required
                onChange={onInputChange}
                value={attraction.name}
            />
            <TextField 
                id="description"
                name="description"
                label="Description"
                type="text"
                onChange={onInputChange}
                value={attraction.description}
                multiline
                rows={2}
                error={attraction.description.length >= 150}
                helperText={`${attraction.description.length} / 150 characters used`}
            />
            <TextField 
                id="url"
                name="url"
                label="URL"
                type="url"
                onChange={onInputChange}
                value={attraction.url}
            />
            <FormControl>
                <FormLabel>
                    Price
                </FormLabel>
                <RadioGroup
                    value={attraction.price}
                    onChange={onRadioChange}
                >
                    <FormControlLabel
                        name="free"
                        checked={!checked}
                        value={0}
                        control={<Radio />}
                        label="Free"
                    />
                    <FormControlLabel
                        name="notFree"
                        checked={checked}
                        control={<Radio />}
                        label={
                            <TextField 
                                id="price" 
                                name="price" 
                                type="number" 
                                onChange={onInputChange}
                                value={attraction.price}
                                disabled={!checked}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AttachMoneyOutlined />
                                        </InputAdornment>
                                    )
                                }}
                            />
                        }
                    />   
                    </RadioGroup>
                </FormControl>
            </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={editAttractionFormProps.handleClose}>Cancel</Button>
                <Button onClick={() => editAttractionFormProps.updateAttraction(attraction)}>Save Changes</Button>
            </DialogActions>
        </Dialog>

    )
}

const Attractions = () => {
    const { id } = useParams()
    const [attractions, setAttractions] = useState<Attraction[]>([])
    const [editAttraction, setEditAttraction] = useState<Attraction | null>(null)
    const [deleteAttraction, setDeleteAttraction] = useState<Attraction | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/attractions/${id}`)
            .then(res => res.json())
            .then(data => setAttractions(data))
    }, [id, loading])

    const toggleEditModal = (attraction?: Attraction) => {
        if(attraction) {
            setEditAttraction(attraction)
        } else {
            setEditAttraction(null)
        }
    }

    const toggleDeleteModal = (attraction?: Attraction) => {
        if(attraction) {
            setDeleteAttraction(attraction)
        } else {
            setDeleteAttraction(null)
        }
    }
    
    const handleClose = () => {
        setEditAttraction(null)
    }

    const handleDeleteAttractionClose = () => {
        setDeleteAttraction(null)
    }

    const updateAttraction = (attraction: Attraction) => {
        setLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/attractions/${attraction.id}?tripId=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attraction)
        })
            .then(res => res.json())
            .then(() => handleClose())
            .finally(() => {
                setLoading(false)
            })
    }

    const handleDeleteAttraction = (attraction: Attraction) => {
        setLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/attractions/${attraction.id}?tripId=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                handleDeleteAttractionClose()
            })
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    

    return (
        <div className={`w-full min-h-screen relative`}>
            <div className={`flex justify-between items-center mt-6 ${editAttraction !== null ? 'filter blur-sm opacity-55 ' : ''}`}>
                <h1 className="text-2xl font-bold">Attractions</h1>
                    <Button
                    variant="contained"
                    color="secondary"
                    sx={{ display: "flex", gap: 1}}
                    >
                        <Link to={`/trips/${id}/attractions/addAttraction`}>Add Attraction</Link>
                        <AddIcon />
                    </Button>                
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2 ${editAttraction !== null ? 'filter blur-sm' : ''}`}>
                {attractions.map(attraction => <AttractionCard key={attraction.id} attraction={attraction} toggleEditModal={toggleEditModal} toggleDeleteModal={toggleDeleteModal} />)}
            </div>
            {editAttraction ? 
                <EditAttractionForm prevAttraction={editAttraction} handleClose={handleClose} updateAttraction={updateAttraction} />
            :
                null
            }
            {
                deleteAttraction ? 
                <Dialog
                    open={Boolean(deleteAttraction)}
                    onClose={handleDeleteAttractionClose}
                >
                    <DialogTitle>Delete Attraction</DialogTitle>
                    <DialogContent>Are you sure you want to delete {deleteAttraction.name}?</DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteAttractionClose}>No</Button>
                        <Button onClick={() => handleDeleteAttraction(deleteAttraction)}>Yes</Button>
                    </DialogActions>
                </Dialog>
            :
                null
            }
            <h2 className={`${editAttraction !== null ? 'filter blur-sm' : ''}`}>Suggested Attractions</h2>
        </div>
    )
}

export default Attractions
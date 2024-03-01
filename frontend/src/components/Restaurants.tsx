import { Link, useParams } from "react-router-dom"
import { Restaurant } from "../types/Restuarant"
import { useEffect, useState } from "react"
import { Box, Button, Card, CardContent, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormLabel, IconButton, InputAdornment, Radio, RadioGroup, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import { AttachMoneyOutlined } from "@mui/icons-material"


type RestaurantCardProps = {
    restaurant: Restaurant
    toggleEditModal: (restaurant: Restaurant) => void
    toggleDeleteModal: (restaurant: Restaurant) => void
}

const RestaurantCard = (restaurantCardProps: RestaurantCardProps) => {

    return(
        <Card className={`flex flex-col border p-3 shadow-md max-w-xlg rounded-md`}>
            <CardHeader
                action={
                    <Box>
                        <IconButton onClick={() => restaurantCardProps.toggleEditModal(restaurantCardProps.restaurant)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton onClick={() => restaurantCardProps.toggleDeleteModal(restaurantCardProps.restaurant)}>
                            <DeleteIcon />
                        </IconButton>
                    </Box>

                }
                title={restaurantCardProps.restaurant.name}
            >
            </CardHeader>
            <CardContent>
                <Typography
                    variant="body1"
                    component="p"
                >
                    {restaurantCardProps.restaurant.description}
                </Typography>
                {restaurantCardProps.restaurant.url ? 
                    <Box sx={{ display: "flex", gap: 1}}>
                        <Typography
                            variant="body1"
                            component="span"
                        >
                            URL:
                        </Typography>
                        <Link className="underline text-blue-500" target="_blank" to={restaurantCardProps.restaurant.url}>{restaurantCardProps.restaurant.url}</Link>
                    </Box>
                : 
                    null
                }
                <Typography
                    variant="body1"
                    component="p"
                >
                    Price: ${restaurantCardProps.restaurant.price}
                </Typography>

            </CardContent>
        </Card>
    )
}

type EditRestaurantFormProps = {
    prevRestaurant: Restaurant
    handleClose: () => void
    updateRestaurant: (Restaurant: Restaurant) => void
}

const EditRestaurantForm = (editRestaurantFormProps: EditRestaurantFormProps) => {
    const [Restaurant, setRestaurant] = useState<Restaurant>(editRestaurantFormProps.prevRestaurant)
    const [checked, setChecked] = useState<boolean>(false)
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        const targetName = e.target.name
        if(targetName === 'price') {
            setRestaurant({
                ...Restaurant,
                [e.target.name]: parseInt(e.target.value)
            })
        } else {
            setRestaurant({
                ...Restaurant,
                [e.target.name]: e.target.value
            })
        }

    }

    const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        switch(e.target.name) {
            case 'free':
                setChecked(false)
                setRestaurant(prev => {
                    return {
                        ...prev,
                        price: parseInt(e.target.value)
                    }
                })
                return 
            case 'notFree':
                setChecked(true)
                setRestaurant(prev => {
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
            open={Boolean(editRestaurantFormProps.prevRestaurant)}
            onClose={editRestaurantFormProps.handleClose}
            sx={{ minWidth: 400 }}
        >
            <DialogTitle>Edit Restaurant</DialogTitle>
            <DialogContent>
            <form className="min-w-96 flex mt-4 p-2 flex-col gap-4">
            <TextField 
                id="name"
                name="name"
                label="Name"
                type="text"
                required
                onChange={onInputChange}
                value={Restaurant.name}
            />
            <TextField 
                id="description"
                name="description"
                label="Description"
                type="text"
                onChange={onInputChange}
                value={Restaurant.description}
                multiline
                rows={2}
                error={Restaurant.description.length >= 150}
                helperText={`${Restaurant.description.length} / 150 characters used`}
            />
            <TextField 
                id="url"
                name="url"
                label="URL"
                type="url"
                onChange={onInputChange}
                value={Restaurant.url}
            />
            <FormControl>
                <FormLabel>
                    Price
                </FormLabel>
                <RadioGroup
                    value={Restaurant.price}
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
                                value={Restaurant.price}
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
                <Button onClick={editRestaurantFormProps.handleClose}>Cancel</Button>
                <Button onClick={() => editRestaurantFormProps.updateRestaurant(Restaurant)}>Save Changes</Button>
            </DialogActions>
        </Dialog>

    )
}

const Restaurants = () => {
    const { id } = useParams()
    const [Restaurants, setRestaurants] = useState<Restaurant[]>([])
    const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null)
    const [deleteRestaurant, setDeleteRestaurant] = useState<Restaurant | null>(null)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/Restaurants/${id}`)
            .then(res => res.json())
            .then(data => setRestaurants(data))
    }, [id, loading])

    const toggleEditModal = (Restaurant?: Restaurant) => {
        if(Restaurant) {
            setEditRestaurant(Restaurant)
        } else {
            setEditRestaurant(null)
        }
    }

    const toggleDeleteModal = (Restaurant?: Restaurant) => {
        if(Restaurant) {
            setDeleteRestaurant(Restaurant)
        } else {
            setDeleteRestaurant(null)
        }
    }
    
    const handleClose = () => {
        setEditRestaurant(null)
    }

    const handleDeleteRestaurantClose = () => {
        setDeleteRestaurant(null)
    }

    const updateRestaurant = (Restaurant: Restaurant) => {
        setLoading(true)
        const updatedRestaurant = {
            ...Restaurant,
            timestamp: new Date()
        }

        fetch(`${import.meta.env.VITE_API_URL}/restaurants/${Restaurant.id}?tripId=${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedRestaurant)
        })
            .then(res => res.json())
            .then(() => handleClose())
            .finally(() => {
                setLoading(false)
            })
    }

    const handleDeleteRestaurant = (Restaurant: Restaurant) => {
        setLoading(true)
        fetch(`${import.meta.env.VITE_API_URL}/restaurants/${Restaurant.id}?tripId=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(() => {
                handleDeleteRestaurantClose()
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
            <div className={`flex justify-between items-center mt-6 ${editRestaurant !== null ? 'filter blur-sm opacity-55 ' : ''}`}>
                <h1 className="text-2xl font-bold">Restaurants</h1>
                    <Button
                    variant="contained"
                    color="secondary"
                    sx={{ display: "flex", gap: 1}}
                    >
                        <Link to={`/trips/${id}/Restaurants/addRestaurant`}>Add Restaurant</Link>
                        <AddIcon />
                    </Button>                
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2 ${editRestaurant !== null ? 'filter blur-sm' : ''}`}>
                {Restaurants.map(Restaurant => <RestaurantCard key={Restaurant.id} restaurant={Restaurant} toggleEditModal={toggleEditModal} toggleDeleteModal={toggleDeleteModal} />)}
            </div>
            {editRestaurant ? 
                <EditRestaurantForm prevRestaurant={editRestaurant} handleClose={handleClose} updateRestaurant={updateRestaurant} />
            :
                null
            }
            {
                deleteRestaurant ? 
                <Dialog
                    open={Boolean(deleteRestaurant)}
                    onClose={handleDeleteRestaurantClose}
                >
                    <DialogTitle>Delete Restaurant</DialogTitle>
                    <DialogContent>Are you sure you want to delete {deleteRestaurant.name}?</DialogContent>
                    <DialogActions>
                        <Button onClick={handleDeleteRestaurantClose}>No</Button>
                        <Button onClick={() => handleDeleteRestaurant(deleteRestaurant)}>Yes</Button>
                    </DialogActions>
                </Dialog>
            :
                null
            }
            <h2 className={`${editRestaurant !== null ? 'filter blur-sm' : ''}`}>Suggested Restaurants</h2>
        </div>
    )
}

export default Restaurants
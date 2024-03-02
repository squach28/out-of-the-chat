import { Avatar, Box, CircularProgress, List, ListItemAvatar, ListItemButton, ListItemText, Rating, TextField } from "@mui/material"
import { useEffect, useState } from "react"
import { useDebounce } from "../hooks/useDebounce"
import { Business, BusinessResponse } from "../types/Business"
import Map from "../components/Map"

type RestaurantItemProps = {
    restaurant: Business
    onListItemClick: (business: Business) => void
}

const RestaurantItem = (restaurantItemProps: RestaurantItemProps) => {
    return(
        <ListItemButton onClick={() => restaurantItemProps.onListItemClick(restaurantItemProps.restaurant)}>
            <ListItemAvatar>
                <Avatar
                    variant="square"
                    src={restaurantItemProps.restaurant.image_url}
                    sx={{ width: 80, height: 80 }}
                />
            </ListItemAvatar>
            <ListItemText
                primary={restaurantItemProps.restaurant.name}
                secondary=
                <Rating
                    readOnly
                    size="small"
                    precision={0.5}
                    value={restaurantItemProps.restaurant.rating}
                />
            >
                
            </ListItemText>

        </ListItemButton>
    )
}

const AddRestaurant = () => {
    const [search, setSearch] = useState<string>('')
    const [restaurants, setRestaurants] = useState<Business[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [currRestaurant, setCurrRestaurant] = useState<Business | null>(null)
    const debouncedSearch = useDebounce(search)

    useEffect(() => {
        const fetchRestaurantsByLocation = async (location: string): Promise<BusinessResponse | null> => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/restaurants?location=${location}`)
                const restaurants = await res.json()
                return restaurants
            } catch(e) {
                console.log(e)
                return null
            }
        }

        const fetchRestaurants = () => {
            setLoading(true)
            fetchRestaurantsByLocation(debouncedSearch)
                .then(data => {
                    if(data !== null) {
                        setRestaurants(data.businesses)
                    }
                })
                .finally(() => {
                    setLoading(false)
                })
        }

        if(debouncedSearch !== '') {
            fetchRestaurants()
        } else {
            setRestaurants([])
        }

    }, [debouncedSearch])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    const onListItemClick = (business: Business) => {
        setCurrRestaurant(business)
    }

    console.log(currRestaurant)

    return (
        <div className="mt-6">
            <h1 className="text-4xl font-bold my-4">Add Restaurant</h1>
            <TextField 
                fullWidth
                label="Location"
                value={search}
                onChange={handleSearchChange}
            />  
            {restaurants.length > 0 && !loading ? 
                <Box sx={{
                    display: "flex"
                }}>
                    <List sx={{
                        maxHeight: 500,
                        overflowY: "scroll"

                    }}>
                        {restaurants.map(restaurant => (
                        <RestaurantItem key={restaurant.id} restaurant={restaurant} onListItemClick={onListItemClick} />
                    )
                    )}
                    </List>
                    <Map query={`place=${currRestaurant?.location.address1 || search}`}/>
                </Box>

            :
                loading ? 
                        <CircularProgress size={50} sx={{ marginX: "auto", marginY: 2, display: "block" }} />
                :
                        null
            }
        </div>
    )
}

export default AddRestaurant
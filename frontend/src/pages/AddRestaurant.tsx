import { Avatar, CircularProgress, Divider, List, ListItem, ListItemAvatar, ListItemText, Rating, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDebounce } from "../hooks/useDebounce"
import { Business, BusinessResponse } from "../types/Business"

type RestaurantItemProps = {
    restaurant: Business
}

const RestaurantItem = (restaurantItemProps: RestaurantItemProps) => {
    return(
        <ListItem>
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

        </ListItem>
    )
}

const AddRestaurant = () => {
    const [search, setSearch] = useState<string>('')
    const [restaurants, setRestaurants] = useState<Business[]>([])
    const [loading, setLoading] = useState<boolean>(false)
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

    return (
        <div>
            <TextField 
                fullWidth
                label="Location"
                value={search}
                onChange={handleSearchChange}
            />  
            {restaurants.length > 0 && !loading ? 
                <List>
                    {restaurants.map(restaurant => (
                    <RestaurantItem key={restaurant.id} restaurant={restaurant} />
                )
                )}
                </List>

            :
                loading ? 
                        <CircularProgress size={50} sx={{ marginX: "auto", marginY: 2, display: "block" }} />
                :
                        null
            }
            <Divider />
            <Typography>
                Or add one
            </Typography>
        </div>
    )
}

export default AddRestaurant
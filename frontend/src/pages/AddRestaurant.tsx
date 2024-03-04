import { Avatar, Box, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, Rating, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDebounce } from "../hooks/useDebounce"
import { Business, BusinessResponse } from "../types/Business"
import Map from "../components/Map"

type RestaurantItemProps = {
    restaurant: Business
    onListItemClick: (business: Business) => void
    index: number
}

const RestaurantItem = (restaurantItemProps: RestaurantItemProps) => {
    return(
        <ListItem
            className="w-full flex flex-col justify-start gap-2 p-2 md:flex-row hover:cursor-pointer border shadow-sm hover:shadow-md rounded-md"
            onClick={() => restaurantItemProps.onListItemClick(restaurantItemProps.restaurant)}>
            <ListItemAvatar>
                <Avatar
                    variant="square"
                    src={restaurantItemProps.restaurant.image_url}
                    sx={{ width: 80, height: 80 }}
                />
            </ListItemAvatar>
            <ListItemText
                className=""
                primary={
                    <Box>
                        <Typography
                            variant="body1"
                            component="span"
                        >
                            {restaurantItemProps.index + 1}. 
                        </Typography>
                        <Typography
                            variant="body1"
                            component="span"
                        >
                            {restaurantItemProps.restaurant.name}
                        </Typography>
                    </Box>
                }
                secondary=
                {<Rating
                    readOnly
                    size="small"
                    precision={0.5}
                    value={restaurantItemProps.restaurant.rating}
                />}
                
            >
            </ListItemText>
        </ListItem>
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
                .then((data: BusinessResponse | null) => {
                    if(data !== null) {
                        if(data.businesses === undefined) {
                            setRestaurants([])
                        } else {
                            setRestaurants(data.businesses)
                        }
                    } else {
                        setRestaurants([])
                    }
                })
                .catch(e => {
                    console.log(e)
                    setRestaurants([])
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
                <Box className="w-full flex flex-col-reverse md:flex-row">
                    <List 
                        className="w-full flex gap-4 overflow-x-scroll md:flex-col md:max-w-md md:max-h-[500px] md:overflow-y-scroll md:overflow-x-hidden"

                    >
                        {restaurants.map((restaurant, index) => (
                        <RestaurantItem key={restaurant.id} restaurant={restaurant} onListItemClick={onListItemClick} index={index} />
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
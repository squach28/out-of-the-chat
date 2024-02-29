import { Link, useOutletContext, useParams } from "react-router-dom"
import { Trip } from "../types/Trip"
import { Attraction } from "../types/Attraction"
import { useState } from "react"
import { Box, Button, Card, CardContent, CardHeader, IconButton, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'


type AttractionCardProps = {
    attraction: Attraction
    toggleEditModal: (attraction: Attraction) => void
}

const AttractionCard = (attractionCardProps: AttractionCardProps) => {

    return(
        <Card className={`flex flex-col border p-3 shadow-md max-w-xlg rounded-md`}>
            <CardHeader
                action={
                    <Box>
                        <IconButton>
                            <EditIcon />
                        </IconButton>
                        <IconButton>
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
                        <Link className="underline text-blue-500" to={attractionCardProps.attraction.url}>{attractionCardProps.attraction.url}</Link>
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

const Attractions = () => {
    const { id } = useParams()
    const trip: Trip = useOutletContext()
    const [editAttraction, setEditAttraction] = useState<Attraction | null>(null)

    const toggleEditModal = (attraction?: Attraction) => {
        if(attraction) {
            setEditAttraction(attraction)
        } else {
            setEditAttraction(null)
        }
    }

    return (
        <div className={`w-full min-h-screen relative`}>
            <div className={`flex justify-between items-center mt-6 ${editAttraction !== null ? 'filter blur-sm opacity-55 ' : ''}`}>
                <h1 className="text-2xl font-bold">Attractions</h1>
               {editAttraction === null ? 
                    <Button
                    variant="contained"
                    color="secondary"
                    sx={{ display: "flex", gap: 1}}
                    >
                        <Link to={`/trips/${id}/attractions/addAttraction`}>Add Attraction</Link>
                        <AddIcon />
                    </Button>                
                :
                    null
                }
            </div>
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2 ${editAttraction !== null ? 'filter blur-sm' : ''}`}>
                {trip.attractions.map(attraction => <AttractionCard key={attraction.id} attraction={attraction} toggleEditModal={toggleEditModal} />)}
            </div>
            
            <h2 className={`${editAttraction !== null ? 'filter blur-sm' : ''}`}>Suggested Attractions</h2>
        </div>
    )
}

export default Attractions
import { Link, useOutletContext, useParams } from "react-router-dom"
import { Trip } from "../types/Trip"
import { Attraction } from "../types/Attraction"
import trashIcon from '../assets/icons/trash-solid.svg'
import editIcon from '../assets/icons/pen-to-square-solid.svg'
import exitIcon from '../assets/icons/xmark-solid.svg'
import { useRef, useState } from "react"
import { Button } from "@mui/material"
import AddIcon from '@mui/icons-material/Add'


type AttractionCardProps = {
    attraction: Attraction
    toggleEditModal: (attraction: Attraction) => void
}

const AttractionCard = (attractionCardProps: AttractionCardProps) => {

    return(
        <div className={`flex flex-col border p-3 shadow-md max-w-xlg rounded-md`}>
            <div className="flex justify-between">
                <p className="text-2xl">{attractionCardProps.attraction.name}</p>
                <div className="flex gap-4">
                    <img className="w-6 h-6 hover:cursor-pointer" src={editIcon} alt="edit" onClick={() => attractionCardProps.toggleEditModal(attractionCardProps.attraction)} />
                    <img className="w-6 h-6 hover:cursor-pointer " src={trashIcon} alt="" />
                </div>
            </div>
            <p>{attractionCardProps.attraction.description}</p>
            {attractionCardProps.attraction.url ? 
                <div className="flex gap-1">
                    <a className="text-blue-500 underline" href={attractionCardProps.attraction.url}>External Link</a>
                </div>
                :
                null
            }
            <p>Price: <span>{attractionCardProps.attraction.price === 0 ? 'Free' : attractionCardProps.attraction.price}</span></p>
            <button className="ml-auto mt-auto rounded-md shadow-md px-2 py-3 my-2 bg-button-light text-button-text-light">Add to Itinerary</button>
        </div>
    )
}

type EditAttractionModal = {
    attraction: Attraction
    toggleEditModal: (attraction?: Attraction) => void
}

const EditAttractionModal = (editAttractionModal: EditAttractionModal) => {

    const [attraction, setAttraction] = useState<Attraction>(editAttractionModal.attraction)
    const ref = useRef<HTMLInputElement | null>(null)

    // TODO: save changes instead of overwriting
    const onSaveChangesClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setAttraction(prev => {
            return {
                ...prev,
                timestamp: new Date().toISOString()
            }
        })
        fetch(`${import.meta.env.VITE_API_URL}/attractions?tripId=${editAttractionModal.attraction.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attraction)
        })
            .then(res => res.json())
            .then(data => console.log(data))
    }

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

    const onPriceChange = () => {
        if(ref.current) {
            setAttraction({
                ...attraction,
                price: 1
            })
        }
    }

    const onFreeChange = () => {
        setAttraction({
            ...attraction,
            price: 0
        })
    }

    return(
        <form className="w-full md:w-1/2 flex flex-col gap-3 absolute transition-opacity bottom-[70%] left-[50%] translate-x-[-50%] translate-y-[50%] z-10 bg-gray-200 rounded-md shadow-lg p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl">Edit Attraction</h1>
                <img className="w-6 h-6 hover:cursor-pointer" src={exitIcon} alt="exit icon" onClick={() => editAttractionModal.toggleEditModal(undefined)} />
            </div>
            <label htmlFor="name">Name</label>
            <input id="name" name="name" className="p-1" type="text" onChange={onInputChange} value={editAttractionModal.attraction.name} placeholder="Name" />
            <label htmlFor="name">Description</label>
            <textarea id="description" name="description" className="p-1 resize-none" onChange={onInputChange} value={editAttractionModal.attraction.description} placeholder="Description" />
            <label htmlFor="name">URL</label>
            <input id="url" name="url" className="p-1" type="url" onChange={onInputChange} value={editAttractionModal.attraction.url ?? ''} placeholder="URL" />
            <label htmlFor="price">Price</label>
            <div className="flex gap-2 items-center">
                    <input name="price-group" type="radio" onChange={onPriceChange} value={attraction.price} checked={attraction.price > 0} />
                    <p>$</p>
                    <input ref={ref} name="price" className="border p-1" type="number" onChange={onInputChange} value={attraction.price} placeholder="Price" />
                </div>
                <div className="flex gap-2">
                    <input id="free" name="price-group" type="radio" checked={attraction.price === 0} onChange={onFreeChange} value={0}/>
                    <label htmlFor="free">Free</label>
                </div>
            <button className="mt-auto font-bold rounded-md shadow-md px-2 py-3 my-2 bg-orange-400 text-button-text-light" onClick={onSaveChangesClicked}>Save Changes</button>
        </form>
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
            {editAttraction ? <EditAttractionModal attraction={editAttraction} toggleEditModal={toggleEditModal} /> : null}
            <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 my-2 ${editAttraction !== null ? 'filter blur-sm' : ''}`}>
                {trip.attractions.map(attraction => <AttractionCard key={attraction.id} attraction={attraction} toggleEditModal={toggleEditModal} />)}
            </div>
            
            <h2 className={`${editAttraction !== null ? 'filter blur-sm' : ''}`}>Suggested Attractions</h2>
        </div>
    )
}

export default Attractions
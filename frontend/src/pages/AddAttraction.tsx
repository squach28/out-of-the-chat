import { useState } from "react"
import { Attraction } from "../types/Attraction"
import {v4 as uuidv4 } from 'uuid'
import { useNavigate, useParams } from "react-router-dom"
import { getAuth } from "firebase/auth"
import { FormControl, FormControlLabel, FormLabel, InputAdornment, Radio, RadioGroup, TextField } from "@mui/material"
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const AddAttraction = () => {
    const { id } = useParams()
    const auth = getAuth()
    const [attraction, setAttraction] = useState<Attraction>({
        id: uuidv4(),
        name: '',
        description: '',
        url: '',
        price: 0,
        createdBy: auth.currentUser?.uid ?? ''
    })
    const [checked, setChecked] = useState<boolean>(false)
    const navigate = useNavigate()

    const onAddAttractionClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const attractionToAdd = {
            ...attraction,
            timestamp: new Date()
        }
        fetch(`${import.meta.env.VITE_API_URL}/attractions?tripId=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(attractionToAdd)
        })
            .then(res => res.json())
            .then(() => navigate(`/trips/${id}/attractions`))
            .catch(e => console.log(e))
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

    return (
        <div className="mt-6">
            <h1 className="text-4xl font-bold">Add Attraction</h1>
            <form className="flex mt-4 flex-col gap-4">
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
                                                <AttachMoneyIcon />
                                            </InputAdornment>
                                        )
                                    }}
                                />
                            }
                        />   
                    </RadioGroup>
                </FormControl>
                <button className="bg-button-light text-button-text-light px-1 py-2 my-2 rounded-md" onClick={onAddAttractionClicked}>Add Attraction</button>
            </form>
        </div>
    )
}

export default AddAttraction
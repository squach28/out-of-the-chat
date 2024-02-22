import { useState } from "react"
import { Attraction } from "../types/Attraction"
import {v4 as uuidv4 } from 'uuid'
import { useParams } from "react-router-dom"
import { getAuth } from "firebase/auth"

const AddAttraction = () => {
    const { id } = useParams()
    const auth = getAuth()
    const [attraction, setAttraction] = useState<Attraction>({
        id: uuidv4(),
        name: '',
        description: '',
        price: 0,
        createdBy: auth.currentUser?.uid ?? ''
    })

    const onAddAttractionClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setAttraction(prev => {
            return {
                ...prev,
                timestamp: new Date().toISOString()
            }
        })
        fetch(`${import.meta.env.VITE_API_URL}/attractions?tripId=${id}`, {
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

    const onFreeClick = (e: React.MouseEvent<HTMLInputElement>) => {
        console.log(e)
        setAttraction({
            ...attraction,
            price: 0
        })
    }

    return (
        <div>
            <h1 className="text-4xl font-bold">Add Attraction</h1>
            <form className="flex flex-col gap-2">
                <label htmlFor="">Name</label>
                <input name="name" className="border p-1" type="text" placeholder="Name" onChange={onInputChange}/>
                <label htmlFor="">Description</label>
                <textarea name="description" className="border resize-none p-1" placeholder="Description" onChange={onInputChange}></textarea>
                <label htmlFor="">URL</label>
                <input name="url" className="border p-1" type="text" placeholder="URL" onChange={onInputChange}/>
                <label htmlFor="">Price</label>
                <div className="flex gap-2 items-center">
                    <input name="price-group" type="radio" />
                    <p>$</p>
                    <input name="price" className="border p-1" type="number" placeholder="Price" onChange={onInputChange} />
                </div>
                <div className="flex gap-2">
                    <input id="free" name="price-group" type="radio" value={0} onClick={onFreeClick}/>
                    <label htmlFor="free" >Free</label>
                </div>
                <button className="bg-button-light text-button-text-light px-1 py-2 my-2 rounded-md" onClick={onAddAttractionClicked}>Add Attraction</button>
            </form>
        </div>
    )
}

export default AddAttraction
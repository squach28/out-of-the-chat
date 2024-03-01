import { useEffect, useState } from "react"
import { Autocomplete, Button, CircularProgress, TextField } from "@mui/material"
import { useDebounce } from "../hooks/useDebounce"
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { getAuth, onAuthStateChanged } from "firebase/auth"
import dayjs from "dayjs"
import { useNavigate } from "react-router-dom"
import { Trip } from "../types/Trip"

const CreateTripForm = () => {
    const date = new Date().setDate(new Date().getDate() + 7)
    const [trip, setTrip] = useState<Trip>({
        name: '',
        location: '',
        startDate: new Date(),
        endDate: new Date(date),
        author: {
            uid: '',
            displayName: '',
            photoURL: ''
        }
    })
    const [errors, setErrors] = useState({
        name: '',
        location: '',
        startDate: '',
        endDate: ''
    })

    const navigate = useNavigate()
    const [suggested, setSuggested] = useState<string[]>([])
    const [suggestedLoading, setSuggestedLoading] = useState<boolean>(false)
    const [autocomplete,] = useState<boolean>(true)
    const debouncedSearch = useDebounce(trip.location)
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        const auth = getAuth()

        onAuthStateChanged(auth, (user) => {
            if(user !== null) {
                setTrip(prev => {
                    return {
                        ...prev,
                        author: {
                            uid: auth.currentUser?.uid ?? '',
                            displayName: auth.currentUser?.displayName ?? '',
                            photoURL: auth.currentUser?.photoURL ?? ''
                        }
                    }
                })
            }
        })
        const fetchPlacesByName = async (text: string): Promise<string[]> => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/places?text=${text}`)
                const places = await res.json()
                return places

            } catch(e) {
                console.log(e)
                return []
            }
        }
        
        const fetchPlaces = () => {
            setSuggestedLoading(true)
            fetchPlacesByName(debouncedSearch)
                .then(data => {
                    setSuggested(data)
                })
                .finally(() => {
                    setSuggestedLoading(false)
                })
        }

        if(debouncedSearch !== '' && autocomplete) {
            fetchPlaces()
        } else {
            setSuggested([])
        }
    }, [debouncedSearch, autocomplete])

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTrip(prev => {
            return {
                ...prev,
                [e.target.name]: e.target.value
            }
        })
        setErrors(prev => {
            return {
                ...prev,
                [e.target.name]: ''
            }
        })
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if(e.target.value === '' || e.target.value === null) {
            setErrors(prev => {
                return {
                    ...prev,
                    [e.target.name]: `${e.target.name[0].toUpperCase() + e.target.name.slice(1)} cannot be empty`
                }
            })
        }
    }

    const validateForm = () => {
        for(const [key, value] of Object.entries(trip)) {
            if(value === '' || value === null) {
                setErrors(prev => {
                    return {
                        ...prev,
                        [key]: `${key[0].toUpperCase() + key.slice(1)} cannot be empty`
                    }
                })
            }
        }

        if(trip.startDate && trip.endDate && dayjs(trip.endDate).isBefore(trip.startDate)) {
            setErrors(prev => {
                return {
                    ...prev,
                    endDate: 'End date must be after start'
                }
            })
        }

    }

    const createTrip = async (tripCreation: Trip) => {
        try {
            setLoading(true)
            const res = await fetch(`${import.meta.env.VITE_API_URL}/trips`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(tripCreation)
            })
            const createdTrip = await res.json()
            return createdTrip
        } catch(e) {
            console.log(e)
            return null
        }

    }

    const onCreateTripClick = () => {
        validateForm()
        console.log(errors)
        const errs = Object.values(errors)
        for(const value of errs) {
            if(value !== '') {
                return
            }
        }
        createTrip(trip)
            .then((res: { id: string, name: string }) => {
                const id = res.id
                navigate(`/trips/${id}/feed`, { replace: true })
            })
            .catch(e => {
                console.log(e)
            })

    }

    return(
        <form className="flex flex-col gap-5">
            <TextField 
                fullWidth
                id="name"
                name="name"
                label="Trip Name"
                type="text"
                onChange={onInputChange}
                onBlur={onInputBlur}
                error={errors.name !== ''}
                helperText={errors.name}
            />  
            <Autocomplete
                fullWidth
                id="location"
                options={suggested}
                value={trip.location}
                onChange={(_, newValue: string | null) => {
                    if(newValue !== null) {
                        setTrip(prev => {
                            return {
                                ...prev,
                                location: newValue
                            }
                        })
                    }
                }}
                inputValue={trip.location}
                onInputChange={(_, newInputValue: string) => {
                    setTrip(prev => {
                        return {
                            ...prev,
                            location: newInputValue
                        }
                    })
                }}  
                onBlur={onInputBlur}
                freeSolo
                renderInput={(params) => <TextField 
                                            {...params} 
                                            name="location" 

                                            label="Location"
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {suggestedLoading ? <CircularProgress size={20} /> : null}
                                                        {params.InputProps.endAdornment}
                                                    </>
                                                )
                                            }}
                                            error={errors.location !== ''}
                                            helperText={errors.location}
                                        />}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Start Date"
                    onChange={
                        (newValue) => { 
                            setErrors(prev => {
                                return {
                                    ...prev,
                                    startDate: ''
                                }

                            })
                            setTrip(prev => { 
                                return { 
                                    ...prev, 
                                    startDate: newValue ? new Date(newValue.toISOString()) : null
                                }
                            })
                        }}
                    value={dayjs(trip.startDate)}
                    slotProps={{
                        textField: {
                            error: errors.startDate !== '',
                            helperText: errors.startDate
                        }
                    }}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker 
                    label="End Date"
                    name="endDate"
                    onChange={
                        (newValue) => { 
                            setErrors(prev => {
                                return {
                                    ...prev,
                                    endDate: ''
                                }

                            })
                            setTrip(prev => { 
                                return { 
                                    ...prev, 
                                    endDate: newValue ? new Date(newValue.toISOString()) : null
                                }
                            })
                        }}
                    value={dayjs(trip.endDate)}
                    slotProps={{
                        textField: {
                            error: errors.endDate !== '',
                            helperText: errors.endDate
                        }
                    }}
                />
            </LocalizationProvider>
            <Button
                variant="contained"
                onClick={onCreateTripClick}
                disabled={loading}
                sx={{ p: 1 }}
            >
                Create Trip
            </Button>
        </form>
    )
}

const CreateTrip = () => {

    return (
        <div>
            <div className="flex flex-col gap-3 p-4">
                <h1 className="text-2xl font-bold">Create a Trip</h1>
                <CreateTripForm />
            </div>
        </div>
    )
}

export default CreateTrip
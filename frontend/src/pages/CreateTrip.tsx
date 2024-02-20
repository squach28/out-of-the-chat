import React, { useEffect, useState } from "react"
import { TripCreation } from "../types/TripCreation"
import validator from "validator"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import { useNavigate } from "react-router-dom"
import { useDebounce } from "../hooks/useDebounce"
import Spinner from "../components/Spinner"

type FormProps = {
    value?: string
    editTrip: (name: string, value: string) => void
    nextStep: () => void,
    previousStep: () => void
}

type DateFormProps = FormProps & {
    startDate?: string
    endDate?: string
}

const TripNameForm = (formProps: FormProps) => {

    const [name, setName] = useState<string>(formProps.value ?? '')
    const [error, setError] = useState<string>('')

    const validateName = (name: string) => {
        if(validator.isEmpty(name)) {
            return false
        }

        return true
    }

    const onContinueClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(!validateName(name)) {
            setError('Field is required')
            return
        }
        const field = 'name'
        formProps.editTrip(field, name)
        formProps.nextStep()
    }

    const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value)
        setError('')
    }

    const onNameBlur = () => {
        if(!validateName(name)) {
            setError('Field is required')
        }
    }

    return (
        <form className="flex flex-col gap-3">
            <div className="flex gap-2">
                <label htmlFor="name">Trip Name</label>
                {error ? <p className="text-red-400">{error}</p> : null}
            </div>
                <input id="name" name="name" className="border p-1" autoFocus={true} type="text" onChange={onNameChange} onBlur={onNameBlur} value={name} placeholder="Trip Name"/>
                <button className="block ml-auto bg-button-light text-button-text-light px-3 py-2 rounded-lg" onClick={onContinueClicked}>Continue</button>
        </form>
    )
}

type SuggestedPlacesListProps = {
    places: string[]
    onSuggestedPlaceClicked: (place: string) => void
}

const SuggestedPlacesList = (suggestedPlacesListProps: SuggestedPlacesListProps) => {
    return(
        <ul className="absolute mr-4 flex flex-col gap-2 bg-gray-200">
            {suggestedPlacesListProps.places.map(place => {
                return(
                    <li key={place} className="p-1 hover:cursor-pointer" onClick={() => { suggestedPlacesListProps.onSuggestedPlaceClicked(place)}}>
                        {place}
                    </li>
                )
            })}
        </ul>
    )
}

const TripLocationForm = (formProps: FormProps) => {

    const [location, setLocation] = useState<string>(formProps.value ?? '')
    const [error, setError] = useState<string>('')
    const [suggested, setSuggested] = useState<string[] | null>([])
    const [suggestedLoading, setSuggestedLoading] = useState<boolean>(false)
    const [autocomplete, setAutocomplete] = useState<boolean>(true)
    const debouncedSearch = useDebounce(location)

    useEffect(() => {
        const fetchPlacesByText = async (text: string): Promise<string[]> => {
            try {
                const data = await fetch(`${import.meta.env.VITE_API_URL}/places?text=${text}`)
                const places = await data.json()
                return places
            } catch(e) {
                console.log(e)
                return []
            }
        }

        const fetchPlaces = () => {
            setSuggestedLoading(true)
            fetchPlacesByText(debouncedSearch)
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

    const validateLocation = (location: string) => {
        if(validator.isEmpty(location)) {
            return false
        }
        return true
    }

    const onContinueClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        if(!validateLocation(location)) {
            setError('Field is required')
            return
        }
        const field = 'location'
        formProps.editTrip(field, location)
        formProps.nextStep()
    }

    const onLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value)
        setAutocomplete(true)
        setError('')
    }

    const onLocationBlur = () => {
        if(!validateLocation(location)) {
            setError('Field is required')
        }
    }

    const onSuggestedPlaceClicked = (place: string) => {
        setLocation(place)
        setAutocomplete(false)
    }

    return (
        <form className="flex flex-col gap-3">
            <div className="flex gap-2">
                <label>Trip Location</label>
                {error ? <p className="text-red-400">{error}</p> : null}
            </div>
            <div className="relative">
                <input className="w-full border p-1 relative" autoFocus={true} type="text" onChange={onLocationChange} onBlur={onLocationBlur} value={location} placeholder="Trip Location"/>
                {suggestedLoading ? 
                    <div className="absolute right-2 top-2 w-4 h-4">
                        <Spinner />
                    </div>
                : null
                }
                {suggested && autocomplete ? <SuggestedPlacesList places={suggested} onSuggestedPlaceClicked={onSuggestedPlaceClicked} /> : null}
            </div>
            <div className="flex gap-1 ml-auto">
                <button className="bg-gray-400 text-button-text-light px-3 py-2 rounded-lg" onClick={formProps.previousStep}>Back</button>
                <button className="bg-button-light text-button-text-light px-3 py-2 rounded-lg" onClick={onContinueClicked}>Continue</button>
            </div>
        </form>
    )
}

const TripDatesForm = (formProps: DateFormProps) => {

    const [startDate, setStartDate] = useState<string>('')
    const [endDate, setEndDate] = useState<string>('')
    const [errors, setErrors] = useState({
        startDate: '',
        endDate: ''
    })

    const onStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const startDate = new Date(e.target.value).toISOString()
        setErrors({
            ...errors,
            [e.target.name]: ''
        })
        setStartDate(e.target.value)
        formProps.editTrip('startDate', startDate)
    }

    const onEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const endDate = new Date(e.target.value).toISOString()
        setErrors({
            ...errors,
            [e.target.name]: ''
        })
        setEndDate(e.target.value)
        formProps.editTrip('endDate', endDate)
    }

    const validateDates = (startDate: string, endDate: string) => {
        if(validator.isEmpty(startDate) || validator.isEmpty(endDate)) {
            console.log('empty')
            return false
        }

        const start = new Date(startDate)
        const end = new Date(endDate)
        if(end <= start) {
            console.log('invalid')
            return false
        }

        return true
    }

    const onFinishClicked = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const start = new Date(startDate)
        const end = new Date(endDate)
        if(!validateDates(startDate, endDate)) {
            if(start >= end) {
                setErrors({
                    ...errors,
                    startDate: 'Range is not valid'
                })
                return
            }
        }
        formProps.editTrip('startDate', start.toISOString())
        formProps.editTrip('endDate', end.toISOString())
        formProps.nextStep()
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const fieldName = e.target.name
        if(validator.isEmpty(e.target.value)) {
            setErrors({
                ...errors,
                [fieldName]: 'Field is required'
            })
        }
    }
    

    return (
        <form className="flex flex-col gap-3">
            <h1 className="text-3xl">Trip Dates</h1>
            <div className="flex gap-2">
                <label htmlFor="startDate">Start</label>
                {errors.startDate ? <p className="text-red-400">{errors.startDate}</p> : null}
            </div>
            <input className="border p-1" id="startDate" name="startDate" type="date" onChange={onStartDateChange} onBlur={onInputBlur} />
            <div className="flex gap-2">
                <label htmlFor="endDate">Return</label>
                {errors.endDate ? <p className="text-red-400">{errors.endDate}</p> : null}
            </div>
            <input className="border p-1" id="endDate" name="endDate" type="date" onChange={onEndDateChange} onBlur={onInputBlur} />
            <div className="flex gap-1 ml-auto">
                <button className="bg-gray-400 text-button-text-light px-3 py-2 rounded-lg" onClick={formProps.previousStep}>Back</button>
                <button className="block ml-auto bg-button-light text-button-text-light px-3 py-2 rounded-lg" onClick={onFinishClicked}>Finish</button>
            </div>
        </form>
    )
}

type CreatingTripProps = {
    trip: TripCreation
}

const CreatingTrip = (creatingTripProps: CreatingTripProps) => {

    const [loading, setLoading] = useState<boolean>(true)
    const [trip, setTrip] = useState(null)

    useEffect(() => {
        const createTrip = async (trip: TripCreation) => {
            try {
                console.log('creating')
                const res = await fetch(`${import.meta.env.VITE_API_URL}/trips`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(trip)
                })
                const createdTrip = await res.json()
                return createdTrip
            } catch(e) {
                console.log(e)
                return null
            }
        }

        createTrip(creatingTripProps.trip)
            .then(createdTrip => {
                setTrip(createdTrip)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [creatingTripProps])
    return(
        <div>
            {loading ? <p>Loading...</p> : trip !== null ? <h1>Sucess!</h1>: null}
        </div>
    )
}



enum CreateTripStep {
    NAME,
    LOCATION,
    DATES,
    CREATING,
}

const CreateTrip = () => {

    const [trip, setTrip] = useState<TripCreation>({
        name: '',
        location: '',
        startDate: null,
        endDate: null,
        createdBy: ''
    })
    const [step, setStep] = useState<CreateTripStep>(CreateTripStep.NAME)
    const navigate = useNavigate()

    useEffect(() => {
        const auth = getAuth()
        onAuthStateChanged(auth, (user) => {
            if(user !== null) {
                setTrip(prev => {
                    return {
                        ...prev,
                        createdBy: user.uid
                    }
                })
            } else {
                console.log(auth.currentUser)
                navigate('/login', { replace: true })
            }
        })

    }, [navigate])

    const editTrip = (name: string, value: string) => {
        setTrip(prev => {
            return {
                ...prev,
                [name]: value
            }

        })
    }   

    const nextStep = async () => {
        switch(step) {
            case CreateTripStep.NAME:
                setStep(CreateTripStep.LOCATION)
                return
            case CreateTripStep.LOCATION:
                setStep(CreateTripStep.DATES)
                return
            case CreateTripStep.DATES:
                setStep(CreateTripStep.CREATING)
                return
            default: 
                return 
        }
    }

    const previousStep = () => {
        switch(step) {
            case CreateTripStep.LOCATION:
                setStep(CreateTripStep.NAME)
                return
            case CreateTripStep.DATES:
                setStep(CreateTripStep.LOCATION)
                return
            default:
                return 
        }
    }

    const renderCreateTripStep = () => {
        switch(step) {
            case CreateTripStep.NAME:
                return <TripNameForm editTrip={editTrip} previousStep={previousStep} nextStep={nextStep} value={trip.name} />
            case CreateTripStep.LOCATION:
                return <TripLocationForm editTrip={editTrip} previousStep={previousStep} nextStep={nextStep} value={trip.location} />
            case CreateTripStep.DATES:
                return <TripDatesForm editTrip={editTrip} previousStep={previousStep} nextStep={nextStep} />
            case CreateTripStep.CREATING:
                return <CreatingTrip trip={trip} />
            default:
                return null
        }
    }

    return (
        <div>
            <div className="flex flex-col gap-3 p-4">
                <h1 className="text-2xl font-bold">Create a Trip</h1>
                {renderCreateTripStep()}
            </div>
        </div>
    )
}

export default CreateTrip
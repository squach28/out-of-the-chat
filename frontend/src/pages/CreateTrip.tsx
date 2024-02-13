import { useState } from "react"
import Navbar from "../components/Navbar"
import { TripCreation } from "../types/TripCreation"
import validator from "validator"

type FormProps = {
    editTrip: (name: string, value: string) => void
    nextStep: () => void
}

const TripNameForm = (formProps: FormProps) => {

    const [name, setName] = useState<string>('')
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
                <input id="name" name="name" className="border p-1" type="text" onChange={onNameChange} onBlur={onNameBlur} placeholder="Trip Name"/>
            <button className="block ml-auto bg-button-light text-button-text-light px-3 py-2 rounded-lg" onClick={onContinueClicked}>Continue</button>
        </form>
    )
}

const TripLocationForm = (formProps: FormProps) => {

    return (
        <form className="flex flex-col gap-3">
            <label>Trip Location</label>
            <input className="border p-1" type="text" placeholder="Trip Location"/>
            <button className="block ml-auto bg-button-light text-button-text-light px-3 py-2 rounded-lg" onClick={formProps.nextStep}>Continue</button>
        </form>
    )
}

const TripDatesForm = (formProps: FormProps) => {

    return (
        <form className="flex flex-col gap-3">
            <label>Trip Dates</label>
            <input className="border p-1" type="date"/>
            <button className="block ml-auto bg-button-light text-button-text-light px-3 py-2 rounded-lg" onClick={formProps.nextStep}>Finish</button>
        </form>
    )
}



enum CreateTripStep {
    NAME,
    LOCATION,
    DATES,
    CREATING
}

const CreateTrip = () => {
    const [trip, setTrip] = useState<TripCreation>({
        name: '',
        location: '',
        startDate: null,
        endDate: null
    })
    const [step, setStep] = useState<CreateTripStep>(CreateTripStep.NAME)

    const editTrip = (name: string, value: string) => {
        setTrip({
            ...trip,
            [name]: value
        })
    }   

    const nextStep = () => {
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

    const renderCreateTripStep = () => {
        switch(step) {
            case CreateTripStep.NAME:
                return <TripNameForm editTrip={editTrip} nextStep={nextStep} />
            case CreateTripStep.LOCATION:
                return <TripLocationForm editTrip={editTrip} nextStep={nextStep} />
            case CreateTripStep.DATES:
                return <TripDatesForm editTrip={editTrip} nextStep={nextStep} />
            default:
                return null
        }
    }

    return (
        <div>
            <Navbar />
            <div className="flex flex-col gap-3 p-4">
                <h1 className="text-2xl font-bold">Create a Trip</h1>
                {renderCreateTripStep()}
            </div>
        </div>
    )
}

export default CreateTrip
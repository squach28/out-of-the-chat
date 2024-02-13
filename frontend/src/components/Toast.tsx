import { useState } from "react"
import xIcon from '../assets/icons/x-solid.svg'

type ToastProps = {
    iconImg: string
    title: string 
    content: string
}

const Toast = (toastProps: ToastProps) => {
    const [active, setActive] = useState<boolean>(true)
    return (
        active ? 
            <div className="w-full flex items-center gap-5 px-5 py-2 bg-[#49A255] text-[#fffffe] rounded-md">
                <img className="w-8 h-8 bg-white rounded-full object-contain p-1" src={toastProps.iconImg} alt="" />
                <div className="flex flex-col flex-1">
                    <p className="text-xl font-bold">{toastProps.title}</p>
                    <p className="text-sm">{toastProps.content}</p>
                </div>
                <img className="w-4 h-4 object-contain hover:cursor-pointer" src={xIcon} alt="" onClick={() => setActive(false)} />
            </div>
        :
            null
    )

}

export default Toast
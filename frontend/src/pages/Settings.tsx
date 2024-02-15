import Navbar from "../components/Navbar"
import SettingsForm from "../components/SettingsForm"

const Settings = () => {
  return (
    <div>
        <Navbar />
        <div className="p-4">
            <h1 className="text-3xl font-bold">Settings</h1>
            <SettingsForm />
        </div>
    </div>
  )
}

export default Settings
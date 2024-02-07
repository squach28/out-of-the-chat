const Navbar = () => {
    return (
        <nav className="w-full bg-green-200 p-2">
            <ul className="flex justify-between">
                <li className="font-bold"><a href="/">Out of the Chat</a></li>
                <li><a href="/login">Login</a></li>
            </ul>
        </nav>
    )
}

export default Navbar
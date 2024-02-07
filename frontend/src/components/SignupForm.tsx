const SignupForm = () => {
    return (
        <form className="flex flex-col p-4 gap-2" action="">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" className="border p-1" type="text" />
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" className="border p-1" type="text" />
            <label htmlFor="email">Email</label>
            <input id="email" className="border p-1" type="email" />
            <label htmlFor="password">Password</label>
            <input id="password" className="border p-1" type="password" />
            <label htmlFor="password">Confirm Password</label>
            <input id="password" className="border p-1" type="password" />
            <button>Sign Up</button>
        </form>
    )
}

export default SignupForm
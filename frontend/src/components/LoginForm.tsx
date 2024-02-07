const LoginForm = () => {
    return (
        <form className="flex flex-col p-4 gap-2" action="">
            <label htmlFor="email">Email</label>
            <input id="email" className="border p-1" type="email" />
            <label htmlFor="password">Password</label>
            <input id="password" className="border p-1" type="password" />
            <button>Login</button>
        </form>
    )
}

export default LoginForm
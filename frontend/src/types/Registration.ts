export type Registration = {
    data: {
        firstName: string
        lastName: string
        email: string
        password: string
        confirmPassword: string
    },
    errors: {
        firstName: string
        lastName: string
        email: string
        password: string
        confirmPassword: string
    }

}
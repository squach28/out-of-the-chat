export const generateErrorMessage = (errorCode: string) => {
    switch(errorCode) {
        case 'auth/email-already-in-use':
            return 'Email is already being used.'
        default: 
            return 'Something went wrong, please try again later.'
    }
}
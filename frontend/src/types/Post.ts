export type Post = {
    action: string
    author: {
        uid: string 
        displayName: string
        photoURL: string
    }
    name: string 
    timestamp: Date 
    type: string
}
export type Post = {
    action: string
    author: {
        uid: string 
        name: string
        photoURL: string
    }
    name: string 
    timestamp: Date 
    type: string
}
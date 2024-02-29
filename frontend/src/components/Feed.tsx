import { ReactNode, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Post } from "../types/Post"
import FeedItem from "./FeedItem"

const Feed = () => {
    const [feed, setFeed] = useState<Post[]>([])
    const { id } = useParams()

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/feed/${id}`)
          .then(res => res.json())
          .then(data => {
            console.log(data)
            setFeed(data)})
    }, [id])
    
    const renderPost = (post: Post) => {
      console.log(post)
      switch(post.action) {
        case 'CREATE':
          return (
            <FeedItem post={post} />
          )
        default:
          return null
      }
    }

    return (
      <div>
        <h1 className="text-4xl font-bold">Feed</h1>
        {feed ? feed.map((post: Post): ReactNode => renderPost(post)) : null}
      </div>
    )
}

export default Feed
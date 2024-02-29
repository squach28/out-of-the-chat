import { ReactNode, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Post } from "../types/Post"
import FeedItem from "./FeedItem"
import { Box } from "@mui/material"

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


    return (
      <div>
        <h1 className="text-4xl font-bold">Feed</h1>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4}}>
          {feed ? feed.map((post: Post): ReactNode => <FeedItem post={post} />) : null}
        </Box>
      </div>
    )
}

export default Feed
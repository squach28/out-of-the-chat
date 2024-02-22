import { useEffect, useState } from "react"
import { Attraction } from "../types/Attraction"
import { Restaurant } from "../types/Restuarant"
import { Hotel } from "../types/Hotel"
import { useParams } from "react-router-dom"

const Feed = () => {
    const [feed, setFeed] = useState<Array<Attraction | Restaurant | Hotel> | null>(null)
    const { id } = useParams()
    console.log(id)
    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/feed/${id}`)
          .then(res => res.json())
          .then(data => setFeed(data))
    }, [id])
    return (
      <div>
        <h1 className="text-4xl font-bold">Feed</h1>
        {feed ? feed.map(post => <p>{post.name}</p>) : null}
      </div>
    )
}

export default Feed
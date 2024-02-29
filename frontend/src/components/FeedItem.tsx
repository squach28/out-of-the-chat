import { Avatar, Box, Card, CardActions, CardContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { Post } from "../types/Post"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import CommentIcon from '@mui/icons-material/Comment'
import { useEffect, useState } from "react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"

type FeedItemProps = {
    post: Post
}

const FeedItem = (postProps: FeedItemProps) => {
  const [user, setUser] = useState<User | null>(null)
  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user)
      }
    })
  }, [])
  return (
    <Card className="max-w-lg mx-auto">
      <CardContent>
        <Typography
              variant="h3"
              component="h2"
          >
              {postProps.post.name}
          </Typography>
          <Typography>
            {postProps.post.author} created a new trip!
          </Typography>
      </CardContent>
      <CardActions sx={{ display: "flex" }}>
        <IconButton sx={{ display: "flex", gap: 1, flex: 1 }}>
          <ThumbUpOffAltIcon />
          <Typography>
            Like
          </Typography>
        </IconButton>
        <IconButton sx={{ display: "flex", gap: 1, flex: 1 }}>
          <CommentIcon />
          <Typography>
            Comment
          </Typography>
        </IconButton>
      </CardActions>
      <Box sx={{ p: 1 }}>
            <TextField
              fullWidth
              size="small"
              InputProps={{
                startAdornment: <InputAdornment position="start">
                                  <Avatar src={user && user.photoURL ? user.photoURL : ''} sx={{ width: 30, height: 30 }} />
                                </InputAdornment>
              }}
            />
      </Box>
    </Card>
  )
}

export default FeedItem
import { Avatar, Box, Card, CardActions, CardContent, IconButton, InputAdornment, TextField, Typography } from "@mui/material"
import { Post } from "../types/Post"
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt'
import CommentIcon from '@mui/icons-material/Comment'
import { useEffect, useState } from "react"
import { User, getAuth, onAuthStateChanged } from "firebase/auth"
import SendIcon from '@mui/icons-material/Send'

type FeedItemProps = {
    post: Post
}

const FeedItem = (postProps: FeedItemProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [comment, setComment] = useState<string>('')

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser(user)
      }
    })
  }, [])

  const generateDescription = (post: Post) => {
    switch(post.action) {
      case 'CREATE':
        switch(post.type) {
          case 'TRIP':
            return `${post.author.uid} created a new trip!`
          default:
            return ''
        }
      case 'ADD':
        switch(post.type) {
          case 'ATTRACTION':
            return `${post.author.uid} added an attraction: ${post.name}`
          default:
            return ''
        }
      case 'UPDATE':
        switch(post.type) {
          case 'ATTRACTION':
            return `${post.author.uid} updated an attraction: ${post.name}`
          default:
            return ''
        }
      case 'REMOVE':
        switch(post.type) {
          case 'ATTRACTION':
            return `${post.author.uid} removed an attraction: ${post.name}`
          default:
            return ''
        }
    }
  }

  return (
    <Card className="md:min-w-[32rem] max-w-lg mx-auto">
      <CardContent>
        <Typography
              variant="h3"
              component="h2"
          >
              {postProps.post.name}
          </Typography>
          <Typography>
            {generateDescription(postProps.post)}
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
              placeholder="Write a comment..."
              onChange={(e) => setComment(e.target.value)}
              value={comment}
              InputProps={{
                startAdornment: <InputAdornment position="start">
                                  <Avatar src={user && user.photoURL ? user.photoURL : ''} sx={{ width: 30, height: 30 }} />
                                </InputAdornment>,
                endAdornment: <InputAdornment position="end">
                                <IconButton size="small" disabled={comment === ''}>
                                  <SendIcon />
                                </IconButton>
                              </InputAdornment>
              }}
            />
      </Box>
    </Card>
  )
}

export default FeedItem
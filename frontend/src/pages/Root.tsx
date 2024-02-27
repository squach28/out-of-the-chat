import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import { ThemeProvider } from "@emotion/react"
import { createTheme } from "@mui/material"

const Root = () => {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#6246ea'
      },
    }
  })

  return (
    <ThemeProvider theme={theme}>
      <div className="w-full min-h-screen relative">
          <Navbar />
          <Outlet />
      </div>
    </ThemeProvider>
  )
}

export default Root
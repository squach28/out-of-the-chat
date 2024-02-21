import ReactDOM from 'react-dom/client'
import './index.css'
import { initializeApp } from 'firebase/app'
import { Link, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Login from './pages/Login.tsx'
import Signup from './pages/Signup.tsx'
import ForgotPassword from './pages/ForgotPassword.tsx'
import AccountSetup from './pages/AccountSetup.tsx'
import CreateTrip from './pages/CreateTrip.tsx'
import Trips from './pages/Trips.tsx'
import Settings from './pages/Settings.tsx'
import TripDetails from './pages/TripDetails.tsx'
import Root from './pages/Root.tsx'
import { Crumb } from './types/Crumb.ts'
import Feed from './components/Feed.tsx'
import Itinerary from './components/Itinerary.tsx'
import Attractions from './components/Attractions.tsx'
import Restaurants from './components/Restaurants.tsx'
import Hotels from './components/Hotels.tsx'
import AddAttraction from './pages/AddAttraction.tsx'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
}

initializeApp(firebaseConfig)

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'login',
        element: <Login />
      },
      {
        path: '/signup',
        element: <Signup />
      },
      {
        path: '/forgotPassword',
        element: <ForgotPassword />
      },
      {
        path: '/accountSetup',
        element: <AccountSetup />
      },
      {
        path: '/settings',
        element: <Settings />
      },
      {
        path: '/createTrip',
        element: <CreateTrip />
      },
      {
        path: '/trips',
        children: [
          {
            index: true,
            element: <Trips />
          },
          {
            path: '/trips/:id',
            element: <TripDetails />,
            children: [ 
              {
                path: '/trips/:id/feed',
                element: <Feed />
              },
              {
                path: '/trips/:id/itinerary',
                element: <Itinerary />
              },
              {
                path: '/trips/:id/attractions',
                element: <Attractions />
              },
              {
                path: '/trips/:id/attractions/addAttraction',
                element: <AddAttraction />,
                handle: {
                  crumb: (crumb: Crumb) => <Link className={`text-blue-800 ${crumb.last ? 'underline' : ''}`} to={`/trips/attractions/addAttraction`}>Add Attraction</Link>
                }
              },
              {
                path: '/trips/:id/restaurants',
                element: <Restaurants />
              },
              {
                path: '/trips/:id/hotels',
                element: <Hotels />
              },
            ],
            handle: {
              crumb: (crumb: Crumb) => <Link className={`text-blue-800 ${crumb.last ? 'underline' : ''}`} to={`/trips/${crumb.data.id}/feed`}>{crumb.data.name}</Link>
            }
          },

        ],
        handle: {
          crumb: (crumb: Crumb) => <Link className={`text-blue-800 ${crumb.last ? 'underline' : ''}`} to="/trips">Trips</Link>
        }
      },

    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={router} />
)

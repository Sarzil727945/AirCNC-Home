import { createBrowserRouter } from 'react-router-dom'
import Main from '../layouts/Main'
import Home from '../pages/Home/Home'
import Login from '../pages/Login/Login'
import SignUp from '../pages/SignUp/SignUp'
import RoomDetails from '../pages/RoomDetails/RoomDetails'
import PrivateRoute from './PrivateRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import AddRoom from '../pages/Dashboard/AddRoom'
import { getRoom } from '../api/rooms'
import MyBookings from '../pages/Dashboard/MyBookings'
import MyListings from '../components/Dashboard/Pages/MyListings'
import ManageBookings from '../components/Dashboard/Pages/ManageBookings'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Main />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/room/:id',
        element: (
          <PrivateRoute>
            <RoomDetails />
          </PrivateRoute>
        ),
        loader:({params})=>getRoom(params.id),
      },
    ],
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        path: '/dashboard/add-room',
        element: <AddRoom></AddRoom>,
      },
      {
        path: '/dashboard/my-bookings',
        element: <MyBookings></MyBookings>,
      },
      {
        path: '/dashboard/my-listings',
        element: <MyListings></MyListings>,
      },
      {
        path: '/dashboard/manageBookings',
        element: <ManageBookings></ManageBookings>,
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
])

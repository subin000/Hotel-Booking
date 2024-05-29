import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { BrowserRouter as Router, Link, Route, Routes} from 'react-router-dom';
import axios from 'axios';
import Hotellist from './Hotellist';
import LoginPage from './Login';
import SignupPage from './Signup';
import UserProfile from './UserProfile';
import HotelDetails from './HotelDetails';
import Bookings from './Bookings';
import BookingPage from './BookingPage';
import Uploadhotel from './Uploadhotel';
import Roomupload from './Roomupload';
import Payment from './Payment';
import AdminPage from './newAdmin';
import Adminroute from './adminroute';

function Navv() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          console.log("no token found")
        }
        const response = await axios.get('http://localhost:5000/user/profile', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response && error.response.status === 401) {
          console.log('login');
        }
      }
    };

    fetchUserData();
  }, []); 

  const handleLogout = () => {
    localStorage.removeItem('authToken');
  };

  return (
    <>
      <Router>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Navbar.Brand as={Link} to="/home">Hotel Booking</Navbar.Brand>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home">Home</Nav.Link>
              <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              <Nav.Link as={Link} to="/book">Bookings</Nav.Link>
            </Nav>
            <Nav className="justify-content-end">
              {userData ? (
                <>
                <Nav.Item style={{color : "white"}}>Hello, {userData.name}</Nav.Item>
                <Nav.Link as={Link} to="/login" onClick={handleLogout}>Logout</Nav.Link>
                </>
              ) : (
                <>
                  <Nav.Link as={Link} to="/login">Login</Nav.Link>
                  <Nav.Link as={Link} to="/signup">Signup</Nav.Link>
                </>
              )}
            </Nav>
          </Container>
        </Navbar>

        <Routes>
          <Route path="/" element={<Hotellist/>}></Route>
          <Route path="/book" element={<Bookings />} />
          <Route path="/home" default element={<Hotellist />} />
          <Route path="/bookpage" element={<BookingPage />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/hotelupload" element={<Uploadhotel />} />
          <Route path="/room" element={<Roomupload />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/adminroute" element={<Adminroute />} />
          <Route path="/hotel-details/:id" element={<HotelDetails/>} />
        </Routes>
      </Router>
    </>
  );
}

export default Navv;
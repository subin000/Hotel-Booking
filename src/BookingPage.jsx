// BookingPage.js

import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function BookingPage() {
  const { roomNo } = useParams();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');

  const handleBooking = async () => {
    try {
      // Assuming you have userId and hotelName available
      const userId = localStorage.getItem('userId');
      const hotelName = localStorage.getItem('hotelName');

      const bookingData = {
        userId,
        hotelName,
        roomNo,
        checkInDate,
        checkOutDate,
      };

      await axios.post('http://localhost:5000/bookings', bookingData);
      alert('Booking successful!');
      // Redirect user to some confirmation page or home page
    } catch (error) {
      console.error('Error:', error);
      alert('Booking failed. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Booking Page</h1>
      <div>
        <label htmlFor="checkInDate">Check-in Date:</label>
        <input
          type="date"
          id="checkInDate"
          value={checkInDate}
          onChange={(e) => setCheckInDate(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="checkOutDate">Check-out Date:</label>
        <input
          type="date"
          id="checkOutDate"
          value={checkOutDate}
          onChange={(e) => setCheckOutDate(e.target.value)}
        />
      </div>
      <button onClick={handleBooking}>Book Room</button>
    </div>
  );
}

export default BookingPage;

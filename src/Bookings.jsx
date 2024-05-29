import {React, useEffect, useState } from 'react';
import axios from 'axios';
import {Card, Row } from 'react-bootstrap';


function Bookings() {
  const [userData, setUserData] = useState(null);
  const [bookingData, setBooking] = useState(null);
  const [idd, setid] = useState("")

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
      setUserData(response.data)
      setid(response.data._id)
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.response && error.response.status === 401) {
        console.log('login');
      }
    }
  };
  fetchUserData();
},[]);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};


useEffect(()=>{
  axios.get(`http://localhost:5000/bookings/${idd}`)
      .then(response => {
        setBooking(response.data);
      })
      .catch(error => {
        console.error('Error fetching bookings:', error);
      });


  
},[idd])
  console.log(bookingData);

  return (
    <>
    
    <Row>
      {bookingData && bookingData.map((book, idx) => (
          <Card key={idx}>
            <Card.Body>
              <Card.Title>Booking ID: {book._id}</Card.Title>
              <Card.Img style ={{width : "300px"}} variant="top" src={book.room_img} />
              {/* <Card.Subtitle className="mb-2 text-muted">User ID: {book.user_id}</Card.Subtitle> */}
              <Card.Text>
              <b>{book.hotel_name} </b> Room no: <b>{book.room_no}</b>
              </Card.Text>
              <Card.Text>
                Check-in: <b>{formatDate(book.check_in_date)}</b>
              </Card.Text>
              <Card.Text>
                Check-out: <b>{formatDate(book.check_out_date)}</b>
              </Card.Text>
              <Card.Text>
              <h3>₹{book.price}</h3>
              </Card.Text>
            </Card.Body>
          </Card>
        
      ))}
    </Row>
    </>
  );
};

export default Bookings;

import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import axios from 'axios';


function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const user_id = searchParams.get('userId');
  const hotel_name = searchParams.get('hotelName');
  const room_no = searchParams.get('roomNo');
  const room_img = searchParams.get('roomImg');
  const check_in_date = searchParams.get('checkInDate');
  const check_out_date = searchParams.get('checkOutDate');
  const price = searchParams.get('price');

  const handleBook = async () => {
        try {
      
      const response = await axios.post('http://localhost:5000/book', {
        user_id, hotel_name, room_no, room_img, check_in_date, check_out_date, price
      });
      alert('Booing Successfull!!!');
      navigate('/book')
      console.log('Booking successful:', response.data);
    } catch (error) {
      console.error('Error booking:', error);
    }
  };


  return (
    <div>
      <h2>Payment Details</h2>
      <Card>
        <Card.Body>
          <Card.Title>Booking Summary</Card.Title>
          <Card.Text>
            <p><strong>User ID:</strong> {user_id}</p>
            <p><strong>Hotel Name:</strong> {hotel_name}</p>
            <p><strong>Room No:</strong> {room_no}</p>
            <p><strong>Check In Date:</strong> {check_in_date}</p>
            <p><strong>Check Out Date:</strong> {check_out_date}</p>
            <p><strong>Price:</strong> ₹{price}</p>
          </Card.Text>
          <Button variant="primary" onClick={handleBook}>Confirm Booking</Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Payment;

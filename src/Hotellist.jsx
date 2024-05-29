import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link,Router,useNavigate,Routes,Route } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Hotellist() {

  const [hotels, setHotel] = useState([]);
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate();


  useEffect(() => {
    axios.get('http://localhost:5000/hotels')
      .then(response => {
        setHotel(response.data);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });

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
  
  async function handle(e){
    alert(e + userData.name)
    const response = await axios.post('http://localhost:5000/details', userData.name);
    navigate('/home');
  }
  

  return (
    <div style={{padding : '20px'}}>
      <br />
      <Row xs={1} md={4} className="g-4">
        {hotels.map((hotel, idx) => (
          <Col key={idx}>
            <Card>
              <Card.Img variant="top" src={hotel.photo} style={{height : "300px"}}/>
              <Card.Body style={{textAlign : "center"}}>
                <Card.Title>{hotel.name}</Card.Title>
                <Card.Text>
                  {hotel.location}
                  
                </Card.Text>
                <Card.Text>
                  {hotel.description}
                </Card.Text>
                <Link to={{ pathname: `/hotel-details/${hotel._id}`, state: { hotel: hotel } }}>
                  <Button variant="secondary">View Hotel</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default Hotellist
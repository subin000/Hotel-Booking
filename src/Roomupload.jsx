import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';


export default function Roomupload() {
  const [img, setPhoto] = useState(null);
  const [Hotel, setHotel] = useState('');
  const [Hotelname, setHotelname] = useState([]);
  const [no, setNo] = useState('');
  const [ac, setAc] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/hotels')
      .then(response => {
        setHotelname(response.data);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  }, []);

  const encodeImageFileAsURL = (file) => {
    var reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    }
    reader.readAsDataURL(file);
  }

  const handleChange = (e) => {
    setHotel(e.target.value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/roompost', {
      img,
      Hotel,
      no,
      ac,
      price,
    })
    .then(alert('Room uploaded Successfully'))
    .catch(err => console.log(err));
  }

  return (
    <>
    <h1>Add a Room</h1>
    <Container style={{textAlign : 'center'}}>
  <Row className="justify-content-md-center">
    <Col md={6}>
      <Form onSubmit={onSubmit}>
        <Form.Group controlId="formNo">
          <Form.Label>Room No</Form.Label>
          <Form.Control type="text" placeholder="No" value={no} onChange={(e) => setNo(e.target.value)} />
        </Form.Group>
        <Form.Group controlId="formHotel">
          <Form.Label>Hotel Name</Form.Label>
          <Form.Control as="select" value={Hotel} onChange={handleChange}>
            <option value="">Select Hotel</option>
            {Hotelname.map(item => (
              <option key={item.id} value={item.name}>{item.name}</option>
            ))}
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formAc">
          <Form.Label>AC?</Form.Label>
          <Form.Control as="select" value={ac} onChange={(e) => setAc(e.target.value)}>
            <option value="">Select if ac</option>
            <option value={true}>Yes</option>
            <option value={false}>No</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formImage">
          <Form.Label>Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => encodeImageFileAsURL(e.target.files[0])} />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price</Form.Label>
          <Form.Control type="text" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        </Form.Group><br/>
        <Button variant="primary" type="submit">
          Upload
        </Button>
      </Form>
    </Col>
  </Row>
</Container>
</>
  )
}

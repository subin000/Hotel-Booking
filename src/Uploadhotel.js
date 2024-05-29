import React, { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';

export default function Uploadhotel() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  const encodeImageFileAsURL = (file) => {
    var reader = new FileReader();
    reader.onloadend = () => {
      setPhoto(reader.result);
    }
    reader.readAsDataURL(file);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/hotelpost', {
      name,
      location,
      description,
      photo
    })
    .then(alert('successfull'))
    .catch(err => console.log(err));
  }

  return (
    <>
    <h1 style={{textAlign : 'center'}}>Add a hotel</h1>

    <Container className="d-flex justify-content-center mt-5">
      <Form onSubmit={onSubmit} style={{ width: '400px' }}>
        <Form.Group controlId="name">
          <Form.Label>Hotel Name</Form.Label>
          <Form.Control type="text" placeholder="Enter Hotel name" value={name} onChange={(e) => setName(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="location">
          <Form.Label>Location</Form.Label>
          <Form.Control type="text" placeholder="Enter Hotel location" value={location} onChange={(e) => setLocation(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control type="text" placeholder="Enter Hotel description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </Form.Group>

        <Form.Group controlId="photo">
          <Form.Label>Upload Photo</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={(e) => encodeImageFileAsURL(e.target.files[0])} />
        </Form.Group>

        <br/>

        <Button variant="secondary" type="submit">
          Submit
        </Button>
        
      </Form>
      
    </Container>
    
    </>
  )
}

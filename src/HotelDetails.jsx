import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import Image from 'react-bootstrap/Image';
import Stack from 'react-bootstrap/Stack';
import { Button, Card, Col, Row, Form, Alert } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function HotelDetails() {
  const [userData, setUserData] = useState(null);
  const [hoteldetail, setHotel] = useState(null);
  const { id } = useParams();
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [checkOutDate, setCheckOutDate] = useState(new Date());
  const [isRoomAvailable, setRoomAvailable] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

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

  useEffect(() => {
    axios.get(`http://localhost:5000/hoteld/${id}`)
      .then(response => {
        setHotel(response.data.length > 0 ? response.data[0] : null);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
      });
  }, [id]);

  useEffect(() => {
    if (hoteldetail) {
      axios.get(`http://localhost:5000/rooms/${hoteldetail.name}`)
        .then(response => {
          setRooms(response.data);
        })
        .catch(error => {
          console.error('Error fetching rooms:', error);
        });
    }
  }, [hoteldetail]);
  const handleBook = async (userId, hotelName, roomNo, roomImg, checkInDate, checkOutDate, price) => {
    await checkAvailability(roomNo, hotelName, checkInDate, checkOutDate);
    console.log(isRoomAvailable);
    if (isRoomAvailable === true) {
      console.log(userId, hotelName, roomNo, roomImg, checkInDate, checkOutDate, price)
      navigate(`/payment?userId=${userId}&hotelName=${hotelName}&roomNo=${roomNo}&roomImg=${roomImg}&checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}&price=${price}`);
    } else if (isRoomAvailable === false) {
      alert('Room is not available for the selected dates.');
    } else {
      console.log('Checking room availability...');
    }
  };
  

  const checkAvailability = async (roomId, hotelName, checkInDate, checkOutDate) => {
    try {
      const response = await axios.get(`http://localhost:5000/availability?roomId=${roomId}&hotelName=${hotelName}&checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}`);
      setRoomAvailable(response.data.available);
    } catch (error) {
      console.error('Error checking availability:', error);
      setRoomAvailable(false);
    }
  };

  const handleRoomSelect = (roomNo) => {
    setRoomAvailable(null);
    setSelectedRoom(roomNo);
  };

  return (
    <div style={{padding : '20px'}}>
      <Stack gap={3}>
        <div className="p-2"><h1 style={{ textAlign: "center" }}>{hoteldetail && hoteldetail.name}</h1></div>
        <div className="p-2" style={{ textAlign: "center" }}><Image style={{ width: "900px" }} src={hoteldetail && hoteldetail.photo} thumbnail /></div>
        <div className="p-2" style={{ textAlign: "center" }}>{hoteldetail && hoteldetail.description}</div>
        <h2 style={{ textAlign: 'center' }}>Rooms in this Hotel</h2>
        {rooms.length > 0 ? (
        <Row xs={1} md={4} className="g-4">
          {rooms.map((room, idx) => (
            <Col key={idx}>
              <Card>
                <Card.Img variant="top" src={room.Photo} />
                <Card.Body>
                  <Card.Title>Room no. {room.no}</Card.Title>
                  <Card.Text>
                    <b>₹{room.price}</b>
                  </Card.Text>
                  <Card.Text>
                    {room.ac ? 'AC' : 'Non AC'}
                  </Card.Text>
                  {selectedRoom === room.no ? (
                    <Form>
                      <Form.Group className="mb-3" controlId="checkInDate">
                        <Form.Label>Check In Date</Form.Label>
                        <br />
                        <DatePicker
                          selected={checkInDate}
                          onChange={date => setCheckInDate(date)}
                          className="form-control"
                        />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="checkOutDate">
                        <Form.Label>Check Out Date</Form.Label>
                        <br />
                        <DatePicker
                          selected={checkOutDate}
                          onChange={date => setCheckOutDate(date)}
                          className="form-control"
                        />
                      </Form.Group>
                      <Button variant="secondary" onClick={() => handleBook(userData._id, hoteldetail.name, room.no, room.Photo, checkInDate, checkOutDate, room.price)}>Book</Button>
                    </Form>
                  ) : (
                    <Button
                      variant='secondary'
                      onClick={() => handleRoomSelect(room.no)}
                    >
                      Select
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>) : ('No Rooms Available') }
        {isRoomAvailable !== null && (
          <Alert variant={isRoomAvailable ? 'success' : 'danger'}>
            {isRoomAvailable ? 'Room is available for booking.' : 'Room is not available for the selected dates.'}
          </Alert>
        )}
      </Stack>
    </div>
  );
}

export default HotelDetails;





// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import Image from 'react-bootstrap/Image';
// import Stack from 'react-bootstrap/Stack';
// import { Button, Card, Col, Row, Form, Alert } from 'react-bootstrap';
// import DatePicker from 'react-datepicker';
// import 'react-datepicker/dist/react-datepicker.css';

// function HotelDetails() {
//   const [userData, setUserData] = useState(null);
//   const [hoteldetail, setHotel] = useState(null);
//   const { id } = useParams();
//   const [rooms, setRooms] = useState([]);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [checkInDate, setCheckInDate] = useState(new Date());
//   const [checkOutDate, setCheckOutDate] = useState(new Date());
//   const [isRoomAvailable, setRoomAvailable] = useState(null);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const authToken = localStorage.getItem('authToken');
//         if (!authToken) {
//           console.log("no token found")
//         }
//         const response = await axios.get('http://localhost:5000/user/profile', {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setUserData(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         if (error.response && error.response.status === 401) {
//           console.log('login');
//         }
//       }
//     };

//     fetchUserData();
//   }, []);

//   useEffect(() => {
//     axios.get(`http://localhost:5000/hoteld/${id}`)
//       .then(response => {
//         setHotel(response.data.length > 0 ? response.data[0] : null);
//       })
//       .catch(error => {
//         console.error('Error fetching hotels:', error);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (hoteldetail) {
//       axios.get(`http://localhost:5000/rooms/${hoteldetail.name}`)
//         .then(response => {
//           setRooms(response.data);
//         })
//         .catch(error => {
//           console.error('Error fetching rooms:', error);
//         });
//     }
//   }, [hoteldetail]);

//   const handleBook = async (userId, hotelName, roomNo, roomImg, checkInDate, checkOutDate) => {
//     await checkAvailability(roomNo, hotelName, checkInDate, checkOutDate);

//     if (isRoomAvailable === true) {
//       try {
//         const booking = {
//           user_id: userId,
//           hotel_name: hotelName,
//           room_no: roomNo,
//           room_img: roomImg,
//           check_in_date: checkInDate,
//           check_out_date: checkOutDate
//         };
//         await axios.post('http://localhost:5000/book', booking);
//         alert('Booking successful!');
//       } catch (error) {
//         console.error('Error:', error);
//         alert('Booking failed. Please try again later.');
//       }
//     } else {
//       alert('Room is not available for the selected dates.');
//     }
//   };

//   const checkAvailability = async (roomId, hotelName, checkInDate, checkOutDate) => {
//     try {
//       const response = await axios.get(`http://localhost:5000/availability?roomId=${roomId}&hotelName=${hotelName}&checkInDate=${checkInDate.toISOString()}&checkOutDate=${checkOutDate.toISOString()}`);
//       setRoomAvailable(response.data.available);
//     } catch (error) {
//       console.error('Error checking availability:', error);
//       setRoomAvailable(false);
//     }
//   };

//   const handleRoomSelect = (roomNo) => {
//     // Reset room availability status when a different room is selected
//     setRoomAvailable(null);
//     setSelectedRoom(roomNo);
//   };

//   return (
//     <>
//       <div>
//         <p>Current User: {userData && userData.name}</p>
//       </div>
//       <Stack gap={3}>
//         <div className="p-2"><h1 style={{ textAlign: "center" }}>{hoteldetail && hoteldetail.name}</h1></div>
//         <div className="p-2" style={{ textAlign: "center" }}><Image style={{ width: "900px" }} src={hoteldetail && hoteldetail.photo} thumbnail /></div>
//         <div className="p-2" style={{ textAlign: "center" }}>{hoteldetail && hoteldetail.description}</div>
//         <h2 style={{ textAlign: 'center' }}>Rooms in this Hotel</h2>
//         <Row xs={1} md={4} className="g-4">
//           {rooms.map((room, idx) => (
//             <Col key={idx}>
//               <Card>
//                 <Card.Img variant="top" src={room.Photo} />
//                 <Card.Body>
//                   <Card.Title>{room.no}</Card.Title>
//                   <Card.Text>₹
//                     {room.price}
//                   </Card.Text>
//                   <Card.Text>
//                     {room.ac ? 'AC' : 'Non AC'}
//                   </Card.Text>
//                   {selectedRoom === room.no ? (
//                     <Form>
//                       <Form.Group className="mb-3" controlId="checkInDate">
//                         <Form.Label>Check In Date</Form.Label>
//                         <br />
//                         <DatePicker
//                           selected={checkInDate}
//                           onChange={date => setCheckInDate(date)}
//                           className="form-control"
//                         />
//                       </Form.Group>
//                       <Form.Group className="mb-3" controlId="checkOutDate">
//                         <Form.Label>Check Out Date</Form.Label>
//                         <br />
//                         <DatePicker
//                           selected={checkOutDate}
//                           onChange={date => setCheckOutDate(date)}
//                           className="form-control"
//                         />
//                       </Form.Group>
//                       <Button variant="secondary" onClick={() => handleBook(userData._id, hoteldetail.name, room.no, room.Photo, checkInDate, checkOutDate)}>Book</Button>
//                     </Form>
//                   ) : (
//                     <Button
//                       variant='secondary'
//                       onClick={() => handleRoomSelect(room.no)}
//                     >
//                       Select
//                     </Button>
//                   )}
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//         {isRoomAvailable !== null && (
//           <Alert variant={isRoomAvailable ? 'success' : 'danger'}>
//             {isRoomAvailable ? 'Room is available for booking.' : 'Room is not available for the selected dates.'}
//           </Alert>
//         )}
//       </Stack>
//     </>
//   );
// }

// export default HotelDetails;

// import React, { useEffect, useState } from 'react';
// import { useParams, Link, redirect } from 'react-router-dom';
// import axios from 'axios';
// import Image from 'react-bootstrap/Image';
// import Stack from 'react-bootstrap/Stack';
// import { Button, Card, Col, Row, Form } from 'react-bootstrap';

// function HotelDetails(props) {
//   const [userData, setUserData] = useState(null);
//   const [hoteldetail, setHotel] = useState(null);
//   const { id } = useParams();
//   const [rooms, setRooms] = useState([]);

//   const [textboxCount, setTextboxCount] = useState(0);

//   const addTextboxes = () => {
//     setTextboxCount(textboxCount + 2);
//   };
  

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const authToken = localStorage.getItem('authToken');
//         if (!authToken) {
//           console.log("no token found")
//         }
//         const response = await axios.get('http://localhost:5000/user/profile', {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setUserData(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         if (error.response && error.response.status === 401) {
//           console.log('login');
//         }
//       }
//     };

//     fetchUserData();
//   }, []); 

//   useEffect(() => {
//     axios.get(`http://localhost:5000/hoteld/${id}`)
//       .then(response => {
//         setHotel(response.data.length > 0 ? response.data[0] : null);
//       })
//       .catch(error => {
//         console.error('Error fetching hotels:', error);
//       });
//   }, [id]);

//   useEffect(() => {
//     if (hoteldetail) {
//       axios.get(`http://localhost:5000/rooms/${hoteldetail.name}`)
//         .then(response => {
//           setRooms(response.data);
//         })
//         .catch(error => {
//           console.error('Error fetching rooms:', error);
//         });
//     }
//   }, [hoteldetail]);

//   const handleBook = async (userId, hotelName, roomNo, roomImg, checkInDate, checkOutDate) => {
//     const booking = {
//       user_id: userId,
//       hotel_name: hotelName,
//       room_no: roomNo,
//       room_img: roomImg,
//       check_in_date: checkInDate,
//       check_out_date: checkOutDate
//     };

//     try {
//       await axios.post('http://localhost:5000/book', booking);
//       alert('Booking successful!');
      
//     } catch (error) {
//       console.error('Error:', error);
//       alert('Booking failed. Please try again later.');
//     }
//   };

//   function test(){

//   };

//   return (
//     <>
//       <div>
//         <p>Current User: {userData && userData.name}</p>
//       </div>
//       <Stack gap={3}>
//         <div className="p-2"><h1 style={{textAlign: "center"}}>{hoteldetail && hoteldetail.name}</h1></div>
//         <div className="p-2" style={{textAlign: "center"}}><Image style={{width: "900px"}} src={hoteldetail && hoteldetail.photo} thumbnail /></div>
//         <div className="p-2" style={{textAlign: "center"}}>{hoteldetail && hoteldetail.description}</div>
//         <h2 style={{textAlign : 'center'}}>Rooms in this Hotel</h2>
//         <Row xs={1} md={4} className="g-4">
//           {rooms.map((room, idx) => (
//             <Col key={idx}>
//               <Card>
//                 <Card.Img variant="top" src={room.Photo} />
//                 <Card.Body>
//                   <Card.Title>{room.no}</Card.Title>
//                   <Card.Text>
//                     {room.ac === true ? 'AC' : 'Non AC'}
//                   </Card.Text>
//                   <div id="container">
//                     {[...Array(textboxCount)].map((_, index) => (
//                         <input
//                             key={index}
//                             type="text"
//                             name={`textbox${index + 1}`}
//                         />
//                     ))}
//                 </div>
//                   <Button variant='secondary' onClick={addTextboxes}>ATB</Button>
//                   {/* <Button variant="secondary" onClick={() => {
//                     const checkInDate = prompt("Enter Check-in Date (YYYY-MM-DD):");
//                     const checkOutDate = prompt("Enter Check-out Date (YYYY-MM-DD):");
//                     if (checkInDate && checkOutDate) {
//                       alert(userData._id+ hoteldetail.name+ room.no+ room.Photo+ checkInDate+ checkOutDate);
//                       handleBook(userData._id, hoteldetail.name, room.no, room.Photo, checkInDate, checkOutDate);
//                     }
//                     redirect('/book')
//                   }}>Book</Button> */}
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Stack>
//     </>
//   );
// }

// export default HotelDetails;

















// import React, { useEffect, useState } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import axios from 'axios';
// import Image from 'react-bootstrap/Image';
// import Stack from 'react-bootstrap/Stack';
// import { Button, Card, Col, Row } from 'react-bootstrap';

// function HotelDetails(props) {
//   const [userData, setUserData] = useState(null)
//   const [hoteldetail, setHotel] = useState(null);
//   const { id } = useParams();
//   const [rooms, setRooms] = useState([])

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const authToken = localStorage.getItem('authToken');
//         if (!authToken) {
//           console.log("no token found")
//         }
//         const response = await axios.get('http://localhost:5000/user/profile', {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setUserData(response.data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         if (error.response && error.response.status === 401) {
//           console.log('login');
//         }
//       }
//     };

//     fetchUserData();
//   }, []); 
  
 
//   useEffect(() => {
//       axios.get(`http://localhost:5000/hoteld/${id}`)
//       .then(response => {
//         setHotel(response.data.length > 0 ? response.data[0] : null);
//       })
//       .catch(error => {
//         console.error('Error fetching hotels:', error);
//       });
//     }, [id]);

  
//   if (hoteldetail === null) {
//     return <div>Loading...</div>;
//   }

//   if (!hoteldetail) {
//     return <div>No hotel data available</div>;
//   }

//   // useEffect(() =>{
//   //   // axios.get(`http://localhost:5000/rooms/Hotel B`)
//   //   //   .then(response => {
//   //   //     setRooms(response.data.length > 0 ? response.data[0] : null);
//   //   //   })
//   //   //   .catch(error => {
//   //   //     console.error('Error fetching rooms:', error); // Log error to console
//   //   //   });
//   //   axios.get(`http://localhost:5000/rooms/${hoteldetail.name}`)
//   //     .then(response => {
//   //       setRooms(response.data);
//   //     })
//   //     .catch(error => {
//   //       console.error('Error fetching rooms:', error); // Log error to console
//   //     });
      
//   // },[hoteldetail]);
//   //console.log(userData.name);

//   const nw = hoteldetail.name
//   axios.get(`http://localhost:5000/rooms/${nw}`)
//       .then(response => {
//         setRooms(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching rooms:', error);
//       });

//     async function handlebook(a,b,c,d){
      

//       const booking = {
//         user_id : a,
//         hotel_name : b,
//         room_no : c,
//         room_img : d
//       }

//       try {
//         await axios.post('http://localhost:5000/book', booking);
//         alert('Booking successful!');
//       } catch (error) {
//         console.error('Error:', error);
//         alert('Booking failed. Please try again later.');
//       }


//     }

//   return (
//     <>
//     <div>
//       {/* <h1 style={{textAlign : "center"}}>Hotel Details</h1> */}
//       <h2>Current User is : {userData.name}</h2>
//       {/* <p>ID: {id}</p> */}
//     </div>
//     <Stack gap={3}>
//     <div className="p-2"><h1 style ={{textAlign : "center"}}>{hoteldetail.name}</h1></div>
//     <div className="p-2" style={{textAlign : "center"}}><Image style={{width : "900px"}} src={hoteldetail.photo} thumbnail /></div>
//     <div className="p-2">{hoteldetail.description}</div>
//     <div className="p-2">Rooms in this hotel</div>
//     <Row xs={1} md={4} className="g-4">
//         {rooms.map((room, idx) => (
//           <Col key={idx}>
//             <Card>
//               <Card.Img variant="top" src={room.Photo} />
//               <Card.Body>
//                 <Card.Title>{room.no}</Card.Title>
//                  <Card.Text>
//                   {room.ac === true ? 'AC': 'Non AC'}
//                 </Card.Text> 
//                 <Link to={{pathname: `/bookpage/${room.no}`}}>
//                 <Button variant="secondary" onClick={() => handlebook(userData._id,hoteldetail.name,room.no,room.Photo)}>Book</Button>
//                 </Link>

//               </Card.Body>
//             </Card>
//           </Col>
//         ))}
//       </Row>

//   </Stack>
//   </>
//   );
// }

// export default HotelDetails;



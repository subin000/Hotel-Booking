const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;
const stripe = require('stripe')('sk_test_tR3PYbcVNZZ796tH88S4VQ2u');
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'du5pgt8ty',
  api_key: '158596388363599',
  api_secret: '8WyvKiriQAFjEiQYrGyQoPVJKzU'
});
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/hotel');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  city: String,
  username: String,
  password: String,
});

userSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

const User = mongoose.model('User', userSchema);

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, 'abcd', { expiresIn: '9h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token.split(' ')[1], 'abcd');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Failed to authenticate token' });
  }
};

app.get('/user/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, city, username, password } = req.body;
    const newUser = new User({ name, email, city, username, password });
    await newUser.save();
    // Generating JWT token
    const token = jwt.sign({ userId: newUser._id }, 'your-secret-key', { expiresIn: '9h' });
    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const hotelSchema = new mongoose.Schema({
  name: String,
  location: String,
  description: String,
  photo: String,
});

const Hotels = mongoose.model('Hotels', hotelSchema);

app.get('/hotels', (req, res) => {
  Hotels.find({})
    .then(hotels => {
      if (hotels.length === 0) {
        res.json({ message: 'No hotels found' });
      } else {
        res.json(hotels);
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching hotels' }));
});

app.get('/hoteld/:id', (req, res) => {
  Hotels.find({ "_id": req.params.id })
    .then(hotels => {
      if (hotels.length === 0) {
        res.json({ message: 'No hotels found' });
      } else {
        res.json(hotels);
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching hotels' }));
});

const roomSchema = new mongoose.Schema({
  Photo: String,
  Hotel: String,
  no: Number,
  ac: Boolean,
  price: Number
});

const Rooms = mongoose.model('Rooms', roomSchema);

app.get('/rooms/:name', (req, res) => {
  Rooms.find({ "Hotel": req.params.name })
    .then(hotels => {
      if (hotels.length === 0) {
        res.json({ message: 'No hotels found' });
      } else {
        res.json(hotels);
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching rooms' }));
});

const bookingSchema = new mongoose.Schema({
  user_id: String,
  hotel_name: String,
  room_no: Number,
  room_img: String,
  check_in_date: Date,
  check_out_date: Date,
  price: Number
});

const Booking = mongoose.model('Bookings', bookingSchema);

app.post('/book', async (req, res) => {
  try {
    const { user_id, hotel_name, room_no, room_img, check_in_date, check_out_date, price } = req.body;
    const newBooking = new Booking({ user_id, hotel_name, room_no, room_img, check_in_date, check_out_date, price });
    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

app.get('/bookings/:id', (req, res) => {
  Booking.find({ "user_id": req.params.id })
    .then(bookings => {
      if (bookings.length === 0) {
        res.json({ message: 'No Bookings found' });
      } else {
        res.json(bookings);
      }
    })
    .catch(err => res.status(500).json({ message: 'Error fetching bookings' }));
});

app.post('/hotelpost', async (req, res) => {
  try {
    const { name, location, description, photo } = req.body;
    cloudinary.uploader.upload(photo, { public_id: name },
      async function (error, result) {
        var photo = result.secure_url
        const HotelUpload = new Hotels({ name, location, description, photo });
        const savedHotel = await HotelUpload.save();
        res.status(201).json(savedHotel);
      });
  } catch (error) {
    console.error('Error uploading Hotel:', error);
    res.status(500).json({ message: 'Error uploading Hotel' });
  }
});


app.post('/roompost', async (req, res) => {
  try {
    const { img, Hotel, no, ac, price } = req.body;
    console.log(img, Hotel, no, ac, price);
    cloudinary.uploader.upload(img, { public_id: Hotel+no },
      async function (error, resultt) {
        var Photo = resultt.secure_url
        const RoomUpload = new Rooms({ Photo, Hotel, no, ac, price });
        const savedRoom = await RoomUpload.save();
        res.status(201).json(savedRoom);
      });
  } catch (error) {
    console.error('Error uploading Room:', error);
    res.status(500).json({ message: 'Error uploading Room' });
  }
});

app.get('/availability', async (req, res) => {
  const { roomId, hotelName, checkInDate, checkOutDate } = req.query;
  const formattedCheckInDate = new Date(checkInDate);
  const formattedCheckOutDate = new Date(checkOutDate);
  const hotel_name = hotelName;
  const room_no = roomId;

  try {
    const existingBookings = await Booking.find({
      hotel_name,
      room_no,
      $or: [
        { 
          check_in_date: { $lt: formattedCheckOutDate },
          check_out_date: { $gt: formattedCheckInDate }
        },
        { 
          check_in_date: formattedCheckInDate,
          check_out_date: formattedCheckOutDate
        }
      ]
    });
    console.log(existingBookings);
    if (existingBookings.length > 0) {
      // If there are existing bookings, check for overlap
      const hasOverlap = existingBookings.some((booking) => {
        const bookingCheckIn = new Date(booking.check_in_date);
        const bookingCheckOut = new Date(booking.check_out_date);
        
        return (formattedCheckInDate < bookingCheckOut && formattedCheckOutDate > bookingCheckIn);
      });

      if (hasOverlap) {
        return res.status(200).json({ available: false });
      } else {
        return res.status(200).json({ available: false });
      }
    } else {
      // If no existing bookings, the room is available
      return res.status(200).json({ available: true });
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

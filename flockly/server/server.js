const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const Event = require('./models/Event'); // Import Event model

const app = express();

// Passport config
require('./config/passport')(passport);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Check your connection string and network access settings');
  });

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: 'Not authenticated' });
};

// Middleware to check if user is a manager
const isManager = (req, res, next) => {
  if (req.user && req.user.userType === 'manager') {
    return next();
  }
  res.status(403).json({ success: false, message: 'Access denied. Manager only.' });
};

// ==================== AUTH ROUTES ====================

// Google OAuth Routes
app.get(
  '/auth/google',
  (req, res, next) => {
    const userType = req.query.userType || 'user';
    req.session.userType = userType;
    console.log('🔵 Storing userType in session:', userType);
    next();
  },
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      console.log('🟢 Callback - Session userType:', req.session.userType);
      console.log('🟢 Callback - User before update:', req.user.userType);

      if (req.session.userType) {
        req.user.userType = req.session.userType;
        await req.user.save();
        console.log('✅ User type updated to:', req.user.userType);
      }
      res.redirect(`${process.env.CLIENT_URL}?auth=success&userType=${req.user.userType}`);
    } catch (error) {
      console.error('❌ Callback error:', error);
      res.redirect(`${process.env.CLIENT_URL}?auth=error`);
    }
  }
);

// Get current user
app.get('/auth/user', (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        profilePicture: req.user.profilePicture,
        userType: req.user.userType
      }
    });
  } else {
    res.json({ success: false, message: 'Not authenticated' });
  }
});

// Logout
app.get('/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.json({ success: false, message: 'Logout failed' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});

// ==================== EVENT ROUTES ====================

// Create new event (Manager only)
app.post('/api/events', isAuthenticated, isManager, async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      managerId: req.user._id
    };

    const event = await Event.create(eventData);
    console.log('✅ Event created:', event);
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('❌ Error creating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create event',
      error: error.message
    });
  }
});

// Get all events for a manager
app.get('/api/events/manager', isAuthenticated, isManager, async (req, res) => {
  try {
    const events = await Event.find({ managerId: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// Get single event by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      event
    });
  } catch (error) {
    console.error('❌ Error fetching event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch event',
      error: error.message
    });
  }
});

// Update event (Manager only)
app.put('/api/events/:id', isAuthenticated, isManager, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, managerId: req.user._id });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unauthorized'
      });
    }
    
    Object.assign(event, req.body);
    await event.save();
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      event
    });
  } catch (error) {
    console.error('❌ Error updating event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update event',
      error: error.message
    });
  }
});

// Delete event (Manager only)
app.delete('/api/events/:id', isAuthenticated, isManager, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, managerId: req.user._id });
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found or unauthorized'
      });
    }
    
    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting event:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete event',
      error: error.message
    });
  }
});

// Get all events (public)
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      events
    });
  } catch (error) {
    console.error('❌ Error fetching events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch events',
      error: error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
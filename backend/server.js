// Load environment variables safely
if (!process.env.DOTENV_LOADED) {
  require('dotenv').config();
  process.env.DOTENV_LOADED = 'true';
}

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const authRoutes = require('./routes/authRoutes');
const srfRoutes = require('./routes/srfRoutes');
const User = require('./models/User');
const SRF = require('./models/SRF');
const Client = require('./models/Client')
const Checklist = require('./models/Checklist')
const Task = require('./models/Task')
const Type = require('./models/VehicleType')

const app = express();

// 🔥 NEW: Create HTTP server and attach Socket.IO
const http = require('http');
const { Server } = require('socket.io');
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true
  }
});

require('./cron/srfStatusCrons')

// ===== SECURITY MIDDLEWARE =====
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      imgSrc: ["'self'", "data:", "https://*.vuetifyjs.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:5173']
    }
  },
  crossOriginEmbedderPolicy: false
}));

app.use(helmet.hsts({ maxAge: 31536000, includeSubDomains: true }));
app.use(helmet.noSniff());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  standardHeaders: true,
  legacyHeaders: false,
});

// Input Sanitization
app.use((req, res, next) => {
  req.body && mongoSanitize.sanitize(req.body);
  req.query && mongoSanitize.sanitize(req.query);
  req.params && mongoSanitize.sanitize(req.params);
  next();
});

// Cookie Parser
app.use(cookieParser());

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Body Parser
app.use(express.json({ limit: '10mb' }));

app.use(limiter);

// ===== DATABASE CONNECTION =====
mongoose.connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 500
  })
  .then(() => {
    console.log('MongoDB connected');

    // Watch User collection for changes
    const changeStream = User.watch([], { fullDocument: 'updateLookup' });

    changeStream.on('change', (change) => {
      console.log('User Change Detected:', change);
      io.emit('user-change', change); // Emit change to frontend
    });

    // Watch Client collection for changes
    const clientStream = Client.watch([], { fullDocument: 'updateLookup' });

    clientStream.on('change', (change) => {
      console.log('Client Change Detected:', change);
      io.emit('client-change', change); // Emit change to frontend
    });

    // Watch Checklist collection for changes
    const checkStream = Checklist.watch([], { fullDocument: 'updateLookup' });

    checkStream.on('change', (change) => {
      console.log('Checklist Change Detected:', change);
      io.emit('check-change', change); // Emit change to frontend
    });

    // Watch Task collection for changes
    const taskStream = Task.watch([], { fullDocument: 'updateLookup' });

    taskStream.on('change', (change) => {
      console.log('Task Change Detected:', change);
      io.emit('task-change', change); // Emit change to frontend
    });

    // Watch Type collection for changes
    const typeStream = Type.watch([], { fullDocument: 'updateLookup' });

    typeStream.on('change', (change) => {
      console.log('Type Change Detected:', change);
      io.emit('vehicle-type-change', change); // Emit change to frontend
    });

    // Watch SRF collection for changes
    const srfChangeStream = SRF.watch([], { fullDocument: 'updateLookup' });

    srfChangeStream.on('change', (change) => {
      console.log('SRF Change Detected:', change);
      io.emit('srf-change', change); // socket event to frontend
    });

    changeStream.on('error', (err) => {
      console.error('User ChangeStream Error:', err);
    });

    mongoose.connection.on('connected', () => console.log('Mongoose connected'));
    mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
    mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// ===== ROUTES =====
app.use('/api/auth', authRoutes);
app.use('/api/srfs', srfRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    dbState: mongoose.connection.readyState,
    timestamp: new Date()
  });
});

// ===== ERROR HANDLING =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// 🔥 Listen to client Socket.IO connections
io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// 🔥 Start the server
const PORT = process.env.PORT || 5000;
const server = httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});

// Graceful shutdown
let isShuttingDown = false;

const shutdown = async () => {
  if (isShuttingDown) return;
  isShuttingDown = true;

  console.log('Shutting down server...');
  try {
    await mongoose.connection.close();
    console.log('Mongoose connection closed');

    server.close(() => {
      console.log('Server closed');
      process.exit(0);
    });
  } catch (err) {
    console.error('Shutdown error:', err);
    process.exit(1);
  }
};

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  shutdown();
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
  shutdown();
});

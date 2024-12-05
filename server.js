const express = require('express');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

// PostgreSQL connection setup
const db = require('./src/db');

// Import routes
const signupRoute = require('./src/sign_up/routes');
const loginRoute = require('./src/sign_in/routes');
const forgotPasswordRoute = require('./src/forgot_password/routes');
const dashboardRouter_1 = require('./src/__01__Dashboard/searchTeachers/routes');
const dashboardRouter_2 = require('./src/__01__Dashboard/listTeachers/routes');
const consultationOverviewRoutes = require('./src/__02__TeacherInformationPage/consultation_overview/routes');
const consultationUpdateRoutes = require('./src/__02__TeacherInformationPage/state_purpose/routes');
const notificationRoutes = require('./src/__03__Notifications/notifications_list/routes');
const profileInfoRoutes = require('./src/__04__Profile/profile_info/routes');


// Import notification controller
const notificationController = require('./src/__03__Notifications/notifications_list/controller');



// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware to parse JSON requests
app.use(bodyParser.json());
app.use(express.json());

// Initialize routes
app.use('/api/signup', signupRoute);
app.use('/api/login', loginRoute);
app.use('/api/forgot_password', forgotPasswordRoute);
app.use('/api/dashboard_1', dashboardRouter_1);
app.use('/api/dashboard_2', dashboardRouter_2);
app.use('/api/appointments', consultationOverviewRoutes);  // Updated appointments route
app.use('/api/appointments/purpose', consultationUpdateRoutes);

app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileInfoRoutes);


// Set up Socket.IO for notifications
notificationController.setSocketIO(io);
notificationController.startNotificationEmitter();

// Socket.IO connection to handle real-time interactions
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

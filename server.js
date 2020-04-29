const express = require('express');
const dotenv = require('dotenv');
const app = express();
const colors = require('colors');

// Route Files
const connectToDB = require('./config/database.js');
const bootcamps = require('./routes/bootcamps.js');

// Load the configs
dotenv.config({ path: './config/config.env'} );

// Middlewares
app.use('/api/v1/bootcamps', bootcamps);

const port = process.env.PORT || 5000;

connectToDB();
const server = app.listen(port, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`.white.bold)); 

// Closes the app if any error is encountered (It's serving as a global handler for unhandled errors)
process.on('unhandledRejection', (err, promise) => {
	console.log(`Error: ${err.message}`.red.bold);
	// Close the app instantly
	server.close(() => process.exit(1));
});
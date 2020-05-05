const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const colors = require('colors');

// Load the config file
dotenv.config({ path: './config/config.env' });

// Models
const Bootcamp = require('./models/Bootcamp.js');

// Connect to Database
const connectToDB = async () => {

	const connection = await mongoose.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true
	});

	console.log(`MongoDB connected from the seeder file`.cyan.bold.underline.inverse);
};

// Load up the JSON Files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`));

// Seed the DB with the data
const importData = async () => {
	try {
		await Bootcamp.create(bootcamps);
		console.log(`Data imported successfully`.green.underline.inverse);
		process.exit();
	}
	catch(err) {
		console.log(err);
	}
	
}

const deleteData = async () => {
	try {
		await Bootcamp.deleteMany();
		console.log(`Data deleted successfully`.red.underline.inverse);
		process.exit();
	}
	catch(err) {
		console.log(err);
	}
}

// This file will be run in cmd with some arguments
if (process.argv[2] === '-i') {
	connectToDB();
	importData();
} else if (process.argv[2] === '-d') {
	connectToDB();
	deleteData();
}
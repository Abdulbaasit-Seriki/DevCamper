const mongoose = require('mongoose');

const connectToDB = async () => {
	const connection = await mongoose.connect(process.env.DATABASE_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true
	});

	console.log(`MongoDB connected`.cyan.bold.underline);
};

module.exports = connectToDB;
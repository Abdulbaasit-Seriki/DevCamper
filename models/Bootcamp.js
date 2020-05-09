const mongoose = require('mongoose');
const slugify = require("slugify");
const geocoder = require('../utils/geocoder.js');

const BootCampSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, `Please Add A Name`],
		unique: true,
		trim: true,
		maxlength: [40, `Name cannot be more than 40 characters`]
	},
	slug: String,
	description: {
		type: String,
		required: [true, `Please Add A Suitable Description`],
		maxlength: [700, `Description cannot be more than 700 characters`]
	},
	website: {
		type: String,
		match: [ /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
				, `Please enter a valid URL`]
	},
	phone: {
		type: String,
		maxlength: [20, `Phone Number cannot be longer than 20 characters`]
	},
	email: {
		type: String,
		match: [/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
		,`Please add a valid email address`]
	},
	address: {
		type: String,
		required: [true, `Please add an address`]
	},
	location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      formattedAddress: String,
      street: String,
      city: String,
      state: String,
      zipcode: String,
      country: String
    },
    careers: {
		type: [String],
		required: true,
		enum: [
			'Web Development',
			'Mobile Development',
			'UI/UX',
			'Data Science',
			'Business',
			'Others'
		]
	},
	averageRating: {
		type: Number,
		min:[1, `Rating must be at least 1`],
		max: [10, `Ratin can not be above 10`]
	},
	averageCost: Number,
	photo: {
		type: String,
		default: `random.jpg`
	},
	housing: {
		type: Boolean,
		default: false
	},
	jobAssistance: {
		type: Boolean,
		default: false
	},
	jobGuarantee: {
		type: Boolean,
		default: false
	},
	acceptGi: {
		type: Boolean,
		default: false
	},
	createdAt: { 
		type: Date,
		default: Date.now
	}
});

// Mongoose Middlewares Also known as hooks
// This one creates a slug from the name of the bootcamp
BootCampSchema.pre("save", function(next) {
	this.slug = slugify(this.name);
	next(); 
});

BootCampSchema.pre('save', async function(next) {
  const loc = await geocoder.geocode(this.address);
  this.location = {
    type: 'Point',
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode 
  }; 

  // Do not save address in DB
  this.address = undefined;
  next();
});

module.exports = mongoose.model('BootCamp', BootCampSchema);
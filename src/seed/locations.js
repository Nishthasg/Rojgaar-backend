const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Location = require('../models/Location');

dotenv.config();

const locations = [
    {
        state: "Andhra Pradesh",
        cities: [
            "Visakhapatnam",
            "Vijayawada",
            "Guntur",
            "Tirupati",
            "Nellore"
        ]
    },
    {
        state: "Assam",
        cities: [
            "Guwahati",
            "Dibrugarh",
            "Silchar",
            "Jorhat",
            "Tezpur"
        ]
    },
    {
        state: "Bihar",
        cities: [
            "Patna",
            "Gaya",
            "Muzaffarpur",
            "Bhagalpur",
            "Darbhanga"
        ]
    },
    {
        state: "Chhattisgarh",
        cities: [
            "Raipur",
            "Bhilai",
            "Bilaspur",
            "Korba",
            "Durg"
        ]
    },
    {
        state: "Delhi",
        cities: [
            "New Delhi",
            "Delhi"
        ]
    },
    {
        state: "Goa",
        cities: [
            "Panaji",
            "Margao",
            "Vasco da Gama",
            "Mapusa"
        ]
    },
    {
        state: "Gujarat",
        cities: [
            "Ahmedabad",
            "Surat",
            "Vadodara",
            "Rajkot",
            "Gandhinagar"
        ]
    },
    {
        state: "Haryana",
        cities: [
            "Gurugram",
            "Faridabad",
            "Panipat",
            "Ambala",
            "Hisar"
        ]
    },
    {
        state: "Himachal Pradesh",
        cities: [
            "Shimla",
            "Manali",
            "Dharamshala",
            "Solan",
            "Mandi"
        ]
    },
    {
        state: "Jharkhand",
        cities: [
            "Ranchi",
            "Jamshedpur",
            "Dhanbad",
            "Bokaro",
            "Deoghar"
        ]
    },
    {
        state: "Karnataka",
        cities: [
            "Bengaluru",
            "Mysuru",
            "Mangaluru",
            "Hubli",
            "Belagavi"
        ]
    },
    {
        state: "Kerala",
        cities: [
            "Thiruvananthapuram",
            "Kochi",
            "Kozhikode",
            "Thrissur",
            "Kollam"
        ]
    },
    {
        state: "Madhya Pradesh",
        cities: [
            "Bhopal",
            "Indore",
            "Gwalior",
            "Jabalpur",
            "Ujjain"
        ]
    },
    {
        state: "Maharashtra",
        cities: [
            "Mumbai",
            "Pune",
            "Nagpur",
            "Nashik",
            "Thane"
        ]
    },
    {
        state: "Odisha",
        cities: [
            "Bhubaneswar",
            "Cuttack",
            "Rourkela",
            "Puri",
            "Sambalpur"
        ]
    },
    {
        state: "Punjab",
        cities: [
            "Ludhiana",
            "Amritsar",
            "Jalandhar",
            "Patiala",
            "Bathinda"
        ]
    },
    {
        state: "Rajasthan",
        cities: [
            "Jaipur",
            "Jodhpur",
            "Udaipur",
            "Kota",
            "Ajmer"
        ]
    },
    {
        state: "Tamil Nadu",
        cities: [
            "Chennai",
            "Coimbatore",
            "Madurai",
            "Salem",
            "Tiruchirappalli"
        ]
    },
    {
        state: "Telangana",
        cities: [
            "Hyderabad",
            "Warangal",
            "Nizamabad",
            "Karimnagar",
            "Khammam"
        ]
    },
    {
        state: "Uttar Pradesh",
        cities: [
      "Agra",
      "Aligarh",
      "Ayodhya",
      "Bareilly",
      "Ghaziabad",
      "Gorakhpur",
      "Kanpur",
      "Lucknow",
      "Mathura",
      "Meerut",
      "Noida",
      "Prayagraj",
      "Varanasi"
        ]
    },
    {
        state: "Uttarakhand",
        cities: [
            "Dehradun",
            "Haridwar",
            "Rishikesh",
            "Nainital",
            "Haldwani"
        ]
    },
    {
        state: "West Bengal",
        cities: [
            "Kolkata",
            "Howrah",
            "Durgapur",
            "Siliguri",
            "Asansol"
        ]
    }
];

const seedLocations = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        await Location.deleteMany();
        await Location.insertMany(locations);
        console.log("Locations inserted successfully");
        process.exit(0);

    } catch(error){
        console.error("Error inserting locations:", error);
        process.exit(1);
    }
};

seedLocations();
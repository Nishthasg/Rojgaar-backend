// this line is used to load environment variables from a .env file into process.env
require('dotenv').config();

const app = require('./app');

// this line is used to connect to the MongoDB database using the connection string specified in the .env file
const connectDB = require('./config/db');
connectDB();

// Route
// app.get('/', (req,res)=>{
//     res.send('backend is running...');
// })


const PORT = process.env.PORT || 5000;
// this line is used to start the server and listen for incoming requests on the specified port
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
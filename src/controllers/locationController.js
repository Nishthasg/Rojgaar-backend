const Location = require('../models/Location');

const getStates = async (req, res) =>{
    try{
     const locations = await Location.find().select('state -_id').sort({state:1});

     const states = locations.map(location => location.state);
     return res.status(200).json({
        success: true,
        message: "States retrieved successfully.",
        data: states
     });
    } catch(error){
       return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
       });
    }
}

const getCitiesByState = async (req, res) =>{
     try {
        const { state } = req.params;

        const location = await Location.findOne({
            state: {
                $regex: `^${state}$`,
                $options: 'i'
            }
        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "State not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Cities fetched successfully.",
            data: location.cities
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    getStates,
    getCitiesByState
}
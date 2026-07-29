const Worker = require('../models/Worker');

const createWorkerProfile = async (req, res) => {
 try{
    const {
        category,
        experience,
        skills,
        city,
        state,
        hourlyRate,
        bio
    } = req.body;
    const userId = req.user._id;

    //Check if Profile Already Exists
    const existingProfile = await Worker.findOne({user: userId});
    if(existingProfile){
        return res.status(400).json({
            success: false,
            message: "Worker profile already exists."
        });
    }
  
    //Validate required fields
    if(!category || !city || !state || !hourlyRate){
        return res.status(400).json({
            success: false,
            message: "Please fill all required fields."
        });
    }
    const worker = await Worker.create({
        user: userId,
        category,
        experience,
        skills,
        city,
        state,
        hourlyRate,
        bio    
    });
    return res.status(201).json({
        success: true,
        message: "Worker profile created successfully.",
        data: worker
    })
 } catch(error) {
    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
    });
 }
};

const getMyProfile = async(req,res) =>{
    try{
         const userId = await req.user._id;
         const worker = await Worker.findOne({user:userId}).populate(
            'user',
            'name email phone role'
         );

         if(!worker){
            return res.status(404).json({
                success: false,
                message: "Worker Profile not found."
            });
         }
         return res.status(200).json({
            success: true,
            message: "Worker Profile fetched successfully",
            data: worker
         });


    } catch{
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

const updateWorkerProfile  = async(req,res) =>{
    try{
       const userId = await req.user._id;
        const {
            category,
            experience,
            skills,
            city,
            state,
            hourlyRate,
            availability,
            bio,
            profileImage
        } = req.body;
        const updateData = {};
        
        if (category !== undefined) updateData.category = category;
        if (experience !== undefined) updateData.experience = experience;
        if (skills !== undefined) updateData.skills = skills;
        if (city !== undefined) updateData.city = city;
        if (state !== undefined) updateData.state = state;
        if (hourlyRate !== undefined) updateData.hourlyRate = hourlyRate;
        if (availability !== undefined) updateData.availability = availability;
        if (bio !== undefined) updateData.bio = bio;
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        
        const updatedWorker = await Worker.findOneAndUpdate(
            {user:userId},
            updateData,
            {
                new:true,
                runValidators: true
            }
        );
        if(!updatedWorker){
            return res.status(402).json({
                success: false,
                message: "Worker not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Worker Profile updated successfully.",
            data: updatedWorker
        });
    } catch(error) {
         console.error(error);
       return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        error: error.message
       });
    }
}

const deleteWorkerProfile = async (req, res) =>{
    try{
        const userId = await req.user._id;
        const deletedWorker = await Worker.findOneAndDelete({user: userId});

        if(!deletedWorker){
            return res.status(404).json({
                success: false,
                message: "Worker not found.",
            });
        }
        return res.status(200).json({
            success: true,
            message: "Worker Profile deleted successfully."
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error: error.message
        });
    }
}

const getWorker = async (req, res) =>{
     try{
         const {
             category,
             city,
             state,
             skills
         } = req.query;

         const filter = {};
        if (category) filter.category = category;
        if (city) filter.city = city;
        if (state) filter.state = state;
        if (skills) filter.skills = skills;

        const workers = await Worker.find(filter)
        .populate(
            'user',
            'name email phone'
        );

        return res.status(200).json({
            success: true,
            count: workers.length,
            data: workers
        });

     } catch(error){
         return res.status(500).json({
            success: false,
            message: "Internal Server Error.",
            error: error.message
        });
     }
}

module.exports = {
    createWorkerProfile,
    getMyProfile,
    updateWorkerProfile,
    deleteWorkerProfile,
    getWorker
}
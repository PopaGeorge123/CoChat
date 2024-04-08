const DBSchemas = require("../models/User.js");

async function createAssistant(data) {
    try {
        const newAssistant = new DBSchemas.Assistant(data);
        const savedAssistant = await newAssistant.save();
        console.log(savedAssistant)
        return savedAssistant
    } catch (error) {
      console.error('Error creating Assistant:', error);
      return false;
    }
}

async function getAssistantById(id){
    try {
        const assistant = await DBSchemas.Assistant.find( {_id : id} );
        return assistant[0]
    } catch (error) {
        console.error('Error retriving data about assistant:', error);
        return false;
    }
}

async function addAsstToUser(userId, assistant) {
    try {
        // Validate user and assistant inputs if necessary
        
        const updateResult = await DBSchemas.User.updateOne(
            { _id: userId },
            { $push: { assistants: assistant } }
        );

        if (updateResult.modifiedCount === 1) {
            // Update successful
            return true;
        } else {
            // No matching document found
            console.error('No matching user found for ID:', userId);
            return false;
        }
    } catch (error) {
        console.error('Error adding assistant to user:', error);
        throw error; // Rethrow the error to handle it at a higher level if needed
    }
}

  
module.exports = {
    createAssistant,
    getAssistantById,
    addAsstToUser
}
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
        return assistant
    } catch (error) {
        console.error('Error retriving data about assistant:', error);
        return false;
    }
}

async function addAsstToUser(user,assistant){
    try {
        const updateResult = await DBSchemas.User.updateOne(
            { _id: user },
            { $push: { assistants: assistant } }
        );

        return updateResult
    } catch (error) {
        console.error('Error adding asst to user:', error);
        return false;
    }
}
  
module.exports = {
    createAssistant,
    getAssistantById,
    addAsstToUser
}
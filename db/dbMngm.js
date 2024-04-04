const DBSchemas = require("../models/User.js");

async function createAssistant(id,name,ownerId,model,status,enabled,numberOfCharacters,LastTrainDate) {
    try {
        const newAssistant = new DBSchemas.Assistant({
        _id: id,
        name: name,
        owner: ownerId,
        model: model,
        status : status,
        enabled : enabled
        });
        const savedAssistant = await newAssistant.save();
        return savedAssistant ? true : false;
    } catch (error) {
      console.error('Error creating Assistant:', error);
      return false;
    }
}

async function addAssistantToUser(userId, chatbotData) {
    try {
        const updateData = { $push: { 
          ChatBots : chatbotData
        } }
        const filter = { _id: userId };
        
        const db_res = await DBSchemas.User.updateOne(filter, updateData);
  
        return db_res
    } catch (error) {
      console.error(error);
    }
}

async function getAssistantById(id) {
  try {
    const assistant = await DBSchemas.Assistant.find( {_id : id} );

    return assistant

  } catch (error) {
    console.error('Error retriving data about assistant:', error);
    return false;
  }
}
  
module.exports = {
    createAssistant,
    addAssistantToUser,
    getAssistantById
}
const fileHandler = require('../files/savedel')
const AIModule = require('./openAi')
 
async function buildAssistantWithFiles(filename , files){
    //return AssistantId
    try{
        const path = await fileHandler.saveFile(files, filename ,'/tempFiles')
        const assistant = await AIModule.buildAssistant(path)
        await fileHandler.deleteFile(path)

        return assistant

    }catch(err){
        console.error(err)
    }
}

module.exports = {
    buildAssistantWithFiles
}





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

async function createFilesToOpenAI(files){
    try{
        const filesCreated = []
        files.forEach(async (element, index) => {
            const path = await fileHandler.saveFile(element.buffer, element.originalname ,'/tempFiles')
            const createdFile = await AIModule.createFile(path)
            await fileHandler.deleteFile(path)
            filesCreated.push(createdFile)
        });

        return filesCreated

    }catch(err){
        console.error(err)
    }
}


module.exports = {
    buildAssistantWithFiles,
    createFilesToOpenAI
}





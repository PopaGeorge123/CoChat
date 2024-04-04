const fs = require('fs');
const path = require('path');


function saveFile(fileData , fileName , location) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(__dirname,location, fileName);
        fs.writeFile(filePath, fileData, err => {
            if (err) {
                reject(err); // If an error occurs, reject the promise
            } else {
                resolve(filePath); // If file is saved successfully, resolve with the file path
            }
        });
    });
}

function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        fs.unlink(filePath, (err) => {
            if (err) {
                reject(err); // If an error occurs, reject the promise
            } else {
                resolve(); // If file is deleted successfully, resolve without any value
            }
        });
    });
}

module.exports = {
    saveFile,
    deleteFile
}

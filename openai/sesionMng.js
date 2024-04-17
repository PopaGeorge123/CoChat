const crypto = require('crypto');

function generateRandomString() {
    return crypto.randomBytes(Math.ceil(10 / 2)).toString('hex').slice(0, length);
}

const sessionCookies = [];

async function getUserByCookie(cookieToFind) {
  return sessionCookies.find(session => session.user.cookie === cookieToFind);
}

async function setCookie(cookie,thread){
  sessionCookies.push({
    user:{
        cookie:cookie,
        thread:thread
    }
  })
}

async function deleteUserByCookie(cookieToDelete) {
  const indexToDelete = sessionCookies.findIndex(session => session.user.cookie === cookieToDelete);
  if (indexToDelete !== -1) {
    sessionCookies.splice(indexToDelete, 1);
    return true
  }else{
    return false
  }
}

async function cookieArray(){
  return sessionCookies
}

module.exports = {
  getUserByCookie,
  setCookie,
  deleteUserByCookie,
  cookieArray
}

// // Middleware to track and manage session cookies
// app.use((req, res, next) => {
//   // Store session cookie if it's not already in the array
//   if (!sessionCookies.includes(req.sessionID)) {
//     sessionCookies.push(req.sessionID);
//   }
//   console.log(sessionCookies)
//   next();
// });

// // Express session middleware
// app.use(session({
//   secret: 'your_secret_key',
//   resave: true,
//   saveUninitialized: true
// }));

// // Custom middleware to merge some id with session cookie
// app.get('/query', (req, res) => {
//   const customId = 'your_custom_id'; // You can generate or fetch your custom ID here
//   req.session.customId = customId;
//   res.cookie('customId', customId); // Set a cookie with the custom ID
//   res.send('Custom ID has been merged with session cookie');
// });

// // Custom middleware to handle requests and return customized data based on the merged id
// app.get('/data', (req, res) => {
//   const customId = req.session.customId;
//   // Fetch customized data based on the custom ID
//   const customizedData = fetchDataBasedOnId(customId); // You need to implement this function
//   res.json(customizedData);
// });

// // Custom middleware to clear session cookie and id
// app.get('/ext', (req, res) => {
//   // Clear session cookie and custom id
//   const index = sessionCookies.indexOf(req.sessionID);
//   if (index !== -1) {
//     sessionCookies.splice(index, 1);
//   }
//   req.session.destroy();
//   res.clearCookie('customId');
//   res.send('Session cookie and custom ID have been cleared');
// });

// // Start the server
// app.listen(5000, () => {
//   console.log('Server is running on port 5000');
// });

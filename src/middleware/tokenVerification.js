require('dotenv').config();
const jwt=require('jsonwebtoken');


function authenticateToken(req, res, next) {
     // Get the token from the request headers
     const authHeader = req.headers['authorization'];
     const token = authHeader && authHeader.split(' ')[1];

     if (!token) { return res.status(401).json({ error: 'Access denied: missing token' }); }     // If the token is not found, return an error response
     // Verify the token
     jwt.verify(token, process.env.JWT, (err, user) => {
          if (err) { return res.status(403).json({ error: 'Access denied: invalid token' }); }          // If the token is invalid, return an error response  
          req.user = user;
          next();// If the token is valid, set the user object on the request object and call the next middleware function
     });
}

module.exports = authenticateToken
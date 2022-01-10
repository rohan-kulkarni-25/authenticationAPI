// Require JWT
const jwt = require("jsonwebtoken");
//  Create Middleware Function AUTH
const auth = (req, res, next) => {
  // Access the token from bearer
  const token = req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    res.send(403).send("<h1>No TOKEN FOUND</h1>");
  }else{
    token.replace('Bearer ','')
  }
  try {
    const decode = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decode;

  } catch (error) {
    console.log(error);
    res.status(401).send(`<h1>INVALID TOKEN</h1>`);
  }
  return next();
};

// If no token is there send response
// Verify token and give permission
// If not verified then send response not authenticated
module.exports = auth
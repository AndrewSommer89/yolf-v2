const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function(req, res, next) {
  //Get token from header
  const token = req.header("x-auth-token");

  // If there is not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  //Verify token
  try {
    //Decode
    const decoded = jwt.verify(token, config.get("jwtSecret"));

    // Set req.user to user in decoded token
    req.user = decoded.user;
    next();
  } catch (err) {
    // There is a token but it is invalid
    res.status(401).json({ msg: "Token is not valid" });
  }
};

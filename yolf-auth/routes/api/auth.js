const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/");
const config = require("config");

const auth = require("../../middleware/auth");

const User = require("../../models/User");
// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get("/", auth, async (req, res) => {
  try {
    // get the user details besides the password
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    //if there is an error
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/auth
// @desc    Authenticate user and get token
// @access  Public
router.post(
  "/",
  // Validation Check
  [
    // Check to make sure the user entered a valid email
    check("email", "Please include a valid email").isEmail(),

    // Check to make sure user enters a password
    check("password", "Password is required").exists()
  ],

  async (req, res) => {
    const errors = validationResult(req);

    // If there are errors in the validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      // Look for user
      let user = await User.findOne({ email });
      // If user exists send error
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User does not exists" }] });
      }

      // Make sure password matches
      // Compare the password user enters to user's password in database
      const isMatch = await bcrypt.compare(password, user.password);

      // If the passwords do not match
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Password is incorrect" }] });
      }

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };
      // jwt sign
      jwt.sign(
        payload,
        // jwt secret
        config.get("jwtSecret"),
        // When token expires
        { expiresIn: 360000 },
        // Callback
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      // If there is an error
      console.error(err.messag);
      res.status(500).send("Server Error");
    }
  }
);

module.exports = router;

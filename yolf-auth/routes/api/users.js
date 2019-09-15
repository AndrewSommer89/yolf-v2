const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator/");
const config = require("config");

// Bring in User model
const User = require("../../models/User");

// @route   GET api/users
// @desc    Register user
// @access  Public
router.post(
  "/",
  // Validation Check
  [
    // Check to make sure the user entered a name
    check("name", "Name is required")
      .not()
      .isEmpty(),

    // Check to make sure the user entered a valid email
    check("email", "Please include a valid email").isEmail(),

    // Check to make sure user's password is more than 6 characters
    check(
      "password",
      "Please enter a password of 6 or more characters"
    ).isLength({ min: 6 })
  ],

  async (req, res) => {
    const errors = validationResult(req);
    // If there are errors in the validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      // Look for user
      let user = await User.findOne({ email });
      // If user exists send error
      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Get users gravatar
      const avatar = gravatar.url(email, {
        // Size of gravatar
        s: "200",
        // Rating
        r: "pg",
        // Default image
        d: "mm"
      });

      // Create a new user
      user = new User({
        name,
        email,
        avatar,
        password
      });

      // Ecrypt password
      // Create salt
      const salt = await bcrypt.genSalt(10);
      // Hash password
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id
        }
      };
      //jwt sign
      jwt.sign(
        payload,
        //jwt secret
        config.get("jwtSecret"),
        // When token expires
        { expiresIn: 604800 },
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

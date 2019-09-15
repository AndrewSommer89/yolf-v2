const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route   GET api/profile/me
// @desc    Get current users profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    // If there is not profile send back error message
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    // If there are no errors respond with profile
    res.json(profile);
  } catch (err) {
    //If there is an error in the server
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route POST api/profile
// @desc  Create or update user profile
// @access Private

router.post(
  "/",
  auth,
  // User is autheticated and required info is validated
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //extract what you need from req.body
    const {
      city,
      homeCourse,
      bio,
      instagram,
      twitter,
      facebook,
      linkedin
    } = req.body;

    // Build profile object
    // Set variable to empty object
    const profileFields = {};
    profileFields.user = req.user.id;
    // If field has input add to profileFields;
    if (city) profileFields.city = city;
    if (homeCourse) profileFields.homeCourse = homeCourse;
    if (bio) profileFields.bio = bio;

    //Build social object
    profileFields.social = {};
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      //Look for profile
      let profile = await Profile.findOne({ user: req.user.id });

      // Update
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        //Return the profile
        return res.json(profile);
      }

      // Create
      profile = new Profile(profileFields);

      // Save Profile
      await profile.save();
      res.json(profile);
    } catch (err) {
      //If there is a server error
      console.error(err.message);
      res.status(500).send("Server Error");
    }
    res.send("Profile Updated!");
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    // Look for profiles
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    // Respond with profiles
    res.json(profiles);
  } catch (err) {
    // If there is an error log it in console
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    // Look to see if there is a profile
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    //If there is no profile
    if (!profile) return res.status(400).json({ msg: "Profile not found" });
    res.json(profile);
  } catch (err) {
    // If there is a server error
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile/user/:user_id
// @desc    Delete profile,user and posts
// @access  private
router.delete("/", auth, async (req, res) => {
  try {
    // Remove users posts
    await Post.deleteMany({ user: req.user.id });
    //Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });
    res.json({ msg: "User deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/scores
// @desc    Add profile score
// @access  Private
router.put(
  "/scores",
  [
    auth,
    [
      check("course", "Course must be entered")
        .not()
        .isEmpty(),
      check("score", "Score is required")
        .not()
        .isEmpty(),
      check("putts", "Number of putts is required")
        .not()
        .isEmpty(),
      check("eagles", "Number of eagles is required")
        .not()
        .isEmpty(),
      check("birdies", "Number of birdies is required")
        .not()
        .isEmpty(),
      check("pars", "Number of pars converted is required")
        .not()
        .isEmpty(),
      check("bogeys", "Number of bogeys is required")
        .not()
        .isEmpty(),
      check("doubleBogeys", "Number of double bogeys is required")
        .not()
        .isEmpty(),
      check("tripleBogeys", "Number of triple bogeys is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      course,
      score,
      putts,
      scoreToPar,
      eagles,
      birdies,
      pars,
      bogeys,
      doubleBogeys,
      tripleBogeys
    } = req.body;

    const newScore = {
      course,
      score,
      putts,
      scoreToPar,
      eagles,
      birdies,
      pars,
      bogeys,
      doubleBogeys,
      tripleBogeys
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.scores.unshift(newScore);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/score/:score_id
// @desc    Delete score from profile
// @access  Private
router.delete("/score/:user_id/:score_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id });

    // Get remove index
    const removeIndex = profile.scores
      .map(item => item.id)
      .indexOf(req.params.score_id);

    profile.scores.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});
module.exports = router;

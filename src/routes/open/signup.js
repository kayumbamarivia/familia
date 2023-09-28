const route = require("express").Router();
const { User, validate } = require("../../models/User");
const bcrypt = require("bcrypt");
const _ = require("lodash");

route.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res
        .status(400)
        .json({
          message: _.get(error, "details[0].message", "Validation error"),
        });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .json({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(_.toNumber(process.env.SALT));
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    await new User({ ...req.body, password: hashedPassword }).save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = route;

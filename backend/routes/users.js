import express from "express";
import User from "../models/User.js";

const router = express.Router()

router.put("/:id", async (req, res) => {
  const username = req.body.username;
  const updates = {
    username,
  };
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: updates,
    });
    res.status(200).json("Data Updated Succesfully");
  } catch (err) {
    return res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Account Deleted Succesfully");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).send("You can Only Update Your Account");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res
      .status(200)
      .json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/all/users", async (req, res) => {
  try {
    const users = await User.find({});
    res
      .status(200)
      .json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


export default router;

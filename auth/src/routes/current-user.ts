import express from "express";

const router = express.Router();

router.post("/api/users/current-user", (req, res) => {
  res.send("Hiiiiiiiiiiiiiii");
});

export { router as currentuserRouter };

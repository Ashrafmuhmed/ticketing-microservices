import express from "express";

const router = express.Router();

router.post("/api/users/signout", (req, res) => {
  req.session = null;
  res.send({ message : 'You are signed out successfully!'});
});

export { router as signoutRouter };

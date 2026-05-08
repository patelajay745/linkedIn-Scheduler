import "dotenv/config";
import express from "express";
import authRouter from "@/auth/auth.route";

const app = express();

const PORT = process.env.PORT || 8080;

app.get("/health", (req, res) => {
  res.send("Up and Running");
});

app.use("/api/v1/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

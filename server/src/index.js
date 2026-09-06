import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Todo API is running");
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

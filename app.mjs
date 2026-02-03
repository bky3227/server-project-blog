import express from "express";
import cors from "cors";

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://server-project-blog-o5n4h2ers-banks-projects-f4d0eee4.vercel.app",
    ],
  })
);


app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello TechUp!");
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});

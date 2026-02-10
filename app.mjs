import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";
import postRouter from "./routes/postRouter.js";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(
    cors({
        origin: [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://server-project-blog.vercel.app",
        ],
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    })
);

app.use("/posts", postRouter);

connectionPool
    .query("SELECT NOW()")
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ DB error", err));


app.get("/", (req, res) => {
    res.send("Hello TechUp!");
});

if (process.env.VERCEL !== "1") {
    app.listen(port, () => {
        console.log(`✅ Server running on http://localhost:${port}`);
    });
}

export default app;

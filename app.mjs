import express from "express";
import cors from "cors";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://server-project-blog.vercel.app/",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

connectionPool
    .query("SELECT NOW()")
    .then(() => console.log("✅ Database connected"))
    .catch((err) => console.error("❌ DB error", err));


app.post("/assignments", async (req, res) => {
    try {
        const {
            title,
            image,
            category_id,
            description,
            content,
            status_id,
        } = req.body;

        if (
            !title ||
            !image ||
            !category_id ||
            !description ||
            !content ||
            !status_id
        ) {
            return res.status(400).json({
                message:
                    "Server could not create post because there are missing data from client",
            });
        }

        const query = `
        INSERT INTO posts
        (title, image, category_id, description, content, status_id)
         VALUES ($1, $2, $3, $4, $5, $6)
        `;


        const values = [
            title,
            image,
            category_id,
            description,
            content,
            status_id,
        ];

        await connectionPool.query(query, values);

        return res.status(201).json({
            message: "Created post sucessfully",
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            message: "Server could not create post because database connection",
        });
    }
});

app.get("/test", (req, res) => {
    res.send("Hello TechUp!");
});

app.get("/posts", async (req, res) => {
    try { 
        let result = await connectionPool.query("select * from posts")
        return res.status(200).json({
            "data": result.rows
        })

    } catch {
        return res.status(500).json({
            message: "Unable to fetch posts."
    })}
})

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});

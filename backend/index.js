import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { nanoid } from "nanoid";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

//connect to mongoDB
mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

//create a schema
const urlSchema = new mongoose.Schema({
  originalUrl: { type: String, required: true },
  shortUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
});
const Url = mongoose.model("Url", urlSchema);

app.post("/api/short", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if(!originalUrl){
        return res.status(400).json({message:"Original URL is required"});
    } 
    const shortUrl = nanoid(8);
    const url = new Url({ originalUrl, shortUrl });
    await url.save();
    return res
      .status(201)
      .json({ message: "Short URL created successfully", url: url });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error creating short URL", error: error.message });
  }
});

app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;
    const url = await Url.findOne({ shortUrl });
    if(url){
        url.clicks++;
        await url.save();
        return res.redirect(url.originalUrl);
    } else {
        return res.status(404).json({message:"Short URL not found"});
    }

  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error finding short URL", error: error.message });
  }
});

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

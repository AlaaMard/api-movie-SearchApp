import axios from "axios";

export default async function handler(req, res) {
  try {
    const { q } = req.query;
    const apiKey = process.env.OMDB_API_KEY; // store in Vercel env vars

    const response = await axios.get(
      `http://www.omdbapi.com/?apikey=${apiKey}&s=${q}`
    );

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
}

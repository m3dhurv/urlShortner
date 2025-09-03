import React from "react";
import { useState } from "react";
import "./App.css";
import axios from "axios";

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");


  const handleSubmit = async () => {
    axios.post("http://localhost:5000/api/short", { originalUrl })

    .then((res) => {
      setShortUrl(res.data.url.shortUrl);
      console.log(res.data.url.shortUrl);
    })
    .catch((err) => {
      console.log(err);
    });
  };


  return (
    <div className="flex flex-col items-center gap-4 justify-center h-screen bg-gray-300">
      <div className="flex w-full max-w-md flex-col items-center gap-4 justify-center bg-white p-4 rounded-md">
        <h1 className="text-2xl font-bold">URL Shortener</h1>
      <input
        className="w-full max-w-md p-2 rounded-md border border-gray-300"
        type="text"
        placeholder="Enter URL"
        name="originalUrl"
        value={originalUrl}
        onChange={(e) => setOriginalUrl(e.target.value)}
      />
      <button className="bg-gray-800 w-full text-white p-2 rounded-md" onClick={handleSubmit}>Shorten</button>
      shortUrl:{shortUrl && (
        <div className="w-full max-w-md">
          <p className="text-sm text-gray-500">Short URL: {shortUrl}</p>
          <a href={`http://localhost:5000/${shortUrl}`}>{shortUrl}</a>
        </div>
      )}
    </div>
    </div>
  );
}

export default App;

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// 🟢 Halaman utama (frontend langsung dari sini)
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TikTok Downloader</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
</head>

<body class="bg-gray-100 min-h-screen flex flex-col items-center p-6">
  <h1 class="text-3xl font-bold mb-4 text-gray-800">🎵 TikTok Downloader</h1>
  <p class="text-gray-500 mb-6 text-center">Tempel URL TikTok kamu di bawah, lalu klik "Download".</p>

  <div class="w-full max-w-lg bg-white p-6 rounded-2xl shadow-lg">
    <input id="urlInput" type="text" placeholder="Masukkan URL TikTok..." 
           class="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-4">
    <button onclick="downloadVideo()" 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
      Download
    </button>

    <div id="result" class="mt-6 hidden">
      <div class="flex items-center space-x-3">
        <img id="avatar" src="" alt="avatar" class="w-12 h-12 rounded-full">
        <div>
          <h2 id="author" class="font-semibold text-gray-800"></h2>
          <p id="unique_id" class="text-gray-500 text-sm"></p>
        </div>
      </div>
      <p id="title" class="mt-4 text-gray-700"></p>
      <img id="cover" src="" alt="cover" class="mt-3 rounded-lg w-full shadow">
      <div class="mt-4 space-y-2">
        <a id="hdBtn" href="#" download class="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg">Download HD</a>
        <a id="noWmBtn" href="#" download class="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg">Download Tanpa Watermark</a>
        <a id="musicBtn" href="#" download class="block w-full bg-yellow-500 hover:bg-yellow-600 text-white text-center py-3 rounded-lg">Download Musik</a>
      </div>
    </div>

    <div id="loading" class="mt-6 hidden text-center text-blue-600 font-semibold">Mengambil data...</div>
  </div>

  <footer class="mt-10 text-gray-400 text-sm">
    Dibuat oleh <a href="https://github.com/RappOfficial" target="_blank" class="text-blue-600">RappOfficial</a>
  </footer>

  <script>
    async function downloadVideo() {
      const url = document.getElementById("urlInput").value.trim();
      const loading = document.getElementById("loading");
      const result = document.getElementById("result");

      if (!url) return alert("Masukkan URL TikTok terlebih dahulu!");

      loading.classList.remove("hidden");
      result.classList.add("hidden");

      try {
        const res = await axios.get(\`/api/download?url=\${encodeURIComponent(url)}\`);
        const data = res.data?.result?.data;

        if (!data) throw new Error("Video tidak ditemukan.");

        document.getElementById("avatar").src = data.author.avatar;
        document.getElementById("author").innerText = data.author.nickname;
        document.getElementById("unique_id").innerText = "@" + data.author.unique_id;
        document.getElementById("title").innerText = data.title;
        document.getElementById("cover").src = data.cover;

        document.getElementById("hdBtn").href = data.hdplay;
        document.getElementById("noWmBtn").href = data.play;
        document.getElementById("musicBtn").href = data.music;

        result.classList.remove("hidden");
      } catch (e) {
        alert("Gagal mengambil data video: " + e.message);
      } finally {
        loading.classList.add("hidden");
      }
    }
  </script>
</body>
</html>
  `);
});

// 🔵 API proxy route
app.get("/api/download", async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: "URL TikTok wajib diisi!" });

  try {
    const apiUrl = `https://rappofficial-apis.vercel.app/download/tiktok-v2?apikey=bestdev&url=${encodeURIComponent(url)}`;
    const response = await axios.get(apiUrl);
    res.json(response.data);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Gagal mengambil data video." });
  }
});

app.listen(PORT, () => {
  console.log(\`✅ TikTok Downloader berjalan di http://localhost:\${PORT}\`);
});

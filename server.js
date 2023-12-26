const express = require("express");
const fetch = require("node-fetch");
const { MongoClient } = require("mongodb");
const app = express();
const port = 3000;

// Koneksi ke MongoDB
const uri = "mongodb://localhost:27017";
const dbName = "cek-bin"; // Ganti dengan nama database yang digunakan
const collectionName = "history-pencarian"; // Ganti dengan nama koleksi yang digunakan

app.use(express.static("public"));

app.get("/check/:bin", (req, res) => {
  const { bin } = req.params;
  const apiKey = "DxAyIIikyfZGaYgzcxjlG3GDNoyThrPu";

  fetch(`https://api.apilayer.com/bincheck/${bin}`, {
    method: "GET",
    headers: {
      apikey: apiKey,
    },
  })
    .then((response) => response.json()) // Mengubah ke JSON
    .then((result) => {
      // Simpan hasil pemeriksaan ke MongoDB
      saveToMongoDB(result);

      // Kirim hasil pemeriksaan sebagai respons
      res.json(result);
    })
    .catch((error) => {
      console.log("error", error);
      res.status(500).send("An error occurred during BIN check.");
    });
});

// Fungsi untuk menyimpan data ke MongoDB
async function saveToMongoDB(data) {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Menyimpan data ke koleksi MongoDB
    const result = await collection.insertOne(data);
    console.log("Data berhasil disimpan:", result.insertedId);

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

app.get("/data-bin", async (req, res) => {
  try {
    const client = new MongoClient(uri);
    await client.connect();

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Ambil data dari MongoDB
    const data = await collection.find({}).toArray();

    await client.close();

    // Kirim data sebagai respons
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while fetching data.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

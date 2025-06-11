import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Pinecone } from "@pinecone-database/pinecone";

dotenv.config();
const app = express();

app.use(cors());

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = "ucl-this-decade";
async function createIndex() {
  await pc.createIndexForModel({
    name: indexName,
    cloud: "aws",
    region: "us-east-1",
    embed: {
      model: "llama-text-embed-v2",
      fieldMap: { text: "chunk_text" },
    },
    waitUntilReady: true,
  });
}
await createIndex();

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { Pinecone } from "@pinecone-database/pinecone";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function chunkText(text, chunkSize = 1000) {
  const chunks = [];
  for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
  }
  return chunks;
}

async function chunkDoc(filePath) {
  const content = await fs.readFile(filePath, "utf-8");
  const chunks = await chunkText(content, 1000);
  return chunks;
}

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

const indexName = "ucl-this-decade";
async function createIfNotExist() {
  try {
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
  } catch (error) {
    if (error.name === "PineconeConflictError") {
      console.log("Index already exists, skipping creation 🤷");
      return;
    }

    throw error;
  }
}
await createIfNotExist();

const pineconeIndex = pc.index(indexName).namespace("ns1");
async function upsertChunks(chunked_docs) {
  const records = chunked_docs.map((chunk, i) => ({
    id: `chunk_${i}`,
    chunk_text: chunk,
  }));

  await pineconeIndex.upsertRecords(records);
}

async function main() {
  const stats = await pineconeIndex.describeIndexStats();
  if (stats && stats.totalRecordCount > 0) {
    console.log("You've already uploaded the data to Pinecone 👏");
    return;
  }

  const files = [
    "UCL_2020_21_Report.txt",
    "UCL_2021_22_Report.txt",
    "UCL_2022_23_Report.txt",
    "UCL_2023_24_Report.txt",
    "UCL_2024_25_Report.txt",
  ];

  let chunked_docs = [];
  for (const file of files) {
    const filePath = path.resolve(__dirname, "data", file);
    const doc = await chunkDoc(filePath);
    chunked_docs.push(...doc);
  }

  await upsertChunks(chunked_docs);
}
main();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});
const config = {
  responseMimeType: "text/plain",
};
const model = "gemini-2.0-flash-lite";

app.get("/ask", async (req, res) => {
  const { question } = req.query;

  const results = await pineconeIndex.searchRecords({
    query: {
      topK: 5,
      inputs: { text: question },
    },
    rerank: {
      model: "bge-reranker-v2-m3",
      topN: 5,
      rankFields: ["chunk_text"],
    },
  });

  const contents = [
    {
      role: "user",
      parts: [
        {
          text: `
          You are a helpful assistant that can answer questions about the UCL 2020-2025 reports.
          Here are the reports: ${JSON.stringify(results)}
          Here is the question: ${question}
          `,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });

  let responseText = "";
  for await (const chunk of response) {
    responseText += chunk.text;
  }

  res.json(responseText);
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

# UCL Chat 🤖

## 🖼️ Preview

![UCL AI Assistant Chat Session](./chat-session.png)

A **smart chat application** that knows everything about UEFA Champions League seasons from 2020/21 to 2024/25, powered by **Pinecone** and **Gemini AI**.

## 🔍 Description

This project provides an intelligent chat interface that can answer questions about recent UEFA Champions League seasons. It uses vector embeddings to store and retrieve information about matches, teams, players, and statistics from the 2020/21 to 2024/25 seasons.

## 📁 Project Structure

```
.
├── server/   # Express.js backend with Pinecone integration
└── client/   # Next.js frontend chat interface
```

## 🚀 Features

- **Intelligent Q&A** about UCL seasons
- **Vector-based search** using Pinecone
- **AI-powered responses** with Gemini
- **Real-time chat interface** with modern design
- **Responsive UI** for desktop and mobile
- **University College London style branding**
- **Comprehensive UCL knowledge** from 2020/21 to 2024/25

## 🛠️ Tech Stack

### Backend

- **Express.js**
- **Pinecone** (vector database)
- **Gemini AI** (language model)
- **CORS** (cross-origin resource sharing)

### Frontend

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **TailwindCSS 4**
- **shadcn/ui** (customizable UI components)
- **Lucide React** (icon library)
- **Axios** (API requests)

## ⚙️ Installation

### 1. Clone the Repo

```bash
git clone https://github.com/andrew-dev-p/pinecone-ai-champions-league-chat
cd pinecone-ai-champions-league-chat
```

### 2. Setup Server

```bash
cd server
npm install
```

### 3. Setup Client

```bash
cd ../client
npm install
```

## 🧪 Running Locally

### Start the Server

```bash
cd server
npm run start
```

### Start the Client

```bash
cd ../client
npm run dev
```

The client will be available at `http://localhost:3000` (or another port if specified). Make sure the server is running for the chat to work.

## 🔗 How It Works

- The **frontend** (client) provides a chat interface where users can ask questions about UCL seasons.
- When a user submits a question, the frontend sends a request to the backend API (`/ask?question=...`).
- The **backend** processes the question using Pinecone for vector search and Gemini AI for generating responses.
- The answer is returned and displayed in the chat UI.

## 🔐 Environment Variables

### 📦 Server (`server/.env`)

```env
PORT=3000
PINECONE_API_KEY=your_pinecone_api_key
GEMINI_API_KEY=your_gemini_api_key
```

## 📬 Deployment

- **Server**: Deployed on your preferred hosting platform
- **Frontend**: Deployable on Vercel, Netlify, or any platform supporting Next.js

## 📚 Data Sources

The application uses data from the following UCL seasons:
- 2020/21
- 2021/22
- 2022/23
- 2023/24
- 2024/25

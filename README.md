# 🧠 AI Brainstormer Kanban

An intelligent **Kanban-style brainstorming app** powered by **Gemini 2.5 Pro AI**.  
This tool helps you **generate, organize, and manage ideas** in a visual Kanban board, making creative thinking structured and effortless.

---

## 🚀 Features

- 💡 **AI Idea Generator** – Uses **Gemini 2.5 Pro** to create smart, structured idea tables.
- 📋 **Kanban Board Interface** – Organize ideas into *To Do*, *In Progress*, and *Completed* columns.
- ⚡ **Real-Time Data** – Syncs ideas using **MongoDB Atlas**.
- 🔒 **JWT Authentication** – Secure access and sessions.
- 🌐 **Next.js App** – Fast, SEO-friendly, and fully API-driven.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js v <= 15 (React + Javascript)
- **Backend:** Next.js API Routes (Node.js)
- **Database:** MongoDB Atlas
- **AI Engine:** Google Gemini 2.5 Pro
- **Authentication:** JWT

---

## ⚙️ Environment Setup

Before running the project, create a file named `.env.local` in the root folder and add the following environment variables:

```bash
MONGODB_URI="your-mongodb-url"
JWT_SECRET="your-jwt-secret"
GEMINI_API_KEY="your-gemini-key"
NEXT_PUBLIC_APP_URL="http://localhost:3000"


# 1️⃣ Clone the repository
git clone https://github.com/yourusername/ai-brainstormer-kanban.git

# 2️⃣ Navigate into the project folder
cd ai-brainstormer-kanban

# 3️⃣ Install all dependencies
npm install

# 4️⃣ Start the development server
npm run dev

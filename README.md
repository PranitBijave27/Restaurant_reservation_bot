# 🍽️ Restaurant Reservation Chatbot (BistroBot)

An **AI-powered conversational chatbot** that helps users book restaurant tables through a simple chat interface.

Built with a modern stack and designed like a real-world reservation assistant.

---

## ✨ Features

- 💬 Chat-based booking experience  
- 🤖 AI-powered intent extraction using **Hugging Face**  
- 📅 Asks for missing details (date, time, people)  
- 👤 Requests user name before final confirmation  
- 🗄️ Stores reservations in **MongoDB**  
- 🎨 Clean, responsive chat UI  
- 🧪 Easy to run locally for demos and interviews  

---

## 🛠️ Tech Stack

| Layer | Technology |
|------|------------|
| Backend | Node.js + Express |
| Database | MongoDB (Local) |
| AI | Hugging Face Inference API |
| Frontend | HTML, CSS, Vanilla JS |
| State | In-memory pending booking |

---

## 🚀 How it Works (High Level)

1. User types a message in chat  
2. Hugging Face model extracts booking intent  
3. Bot checks for missing details  
4. If complete → asks for user’s name  
5. Saves reservation in MongoDB  
6. Confirms booking in chat  

---

## 🧑‍💻 How to Run Locally

### 1️⃣ Clone the repository
git clone https://github.com/PranitBijave27/Restaurant_reservation_bot.git
cd Restaurant_reservation_bot
2️⃣ Install dependencies
npm install

3️⃣ Create a .env file in project root

Create a file named .env and add:

MONGO_URI=mongodb://127.0.0.1:27017/restaurent
HF_API_KEY=your_huggingface_token_here


Get your Hugging Face token from: https://huggingface.co/settings/tokens

4️⃣ Start MongoDB locally

Make sure MongoDB Compass / MongoDB server is running.

5️⃣ Run the server
node server.js

6️⃣ Open in browser
http://localhost:3000

💬 Example Conversation

User:

Book a table for 4 tomorrow at 7 pm

Bot:

Sure! May I have your name, please? 🙂

User:

Pranit

Bot:

✅ Confirmed! Table for 4 on 2026-02-08 at 19:00 under the name Pranit.

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

```bash
git clone https://github.com/PranitBijave27/Restaurant_reservation_bot.git
cd Restaurant_reservation_bot

📚 Yeneta Backend - Kids Learning App

This is the backend server for Yeneta, a mobile learning application designed for young children to explore educational content. The backend provides RESTful APIs that support user authentication, content delivery, events, and leaderboards.

---

## 🚀 Features

- Parent registration and login (including Google OAuth)
- Quiz management and scoring
- Stories and tutorial content delivery
- Child-friendly events with RSVP support
- Multimedia content upload (text, audio, video, image)
- Rankings and weekly leaderboard announcements

---

🛠️ Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Authentication: JWT (via Bearer token)
- Database: MongoDB
- File Uploads: `multipart/form-data` for media content

---

Installation

1. Clone the Repository

```bash
git clone https://github.com/fira-g/yeneta-api.git

```

2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory with the following example:

```env
PORT=5000
DB_URI=your_database_uri_here
JWT_SECRET=your_jwt_secret
```

### 4. Start the Server

```bash
npm run dev
```

The server will run at `http://localhost:5000` by default.

---

## Base URL

All endpoints are prefixed with:

```
https://yeneta-api.onrender.com
```

> ⚠️ Note: Where specified, include a Bearer token in the `Authorization` header.

---

## 📚 API Endpoints

### 👨‍👩‍👧 Parents

| Method | Endpoint                              | Description            |
| ------ | ------------------------------------- | ---------------------- |
| POST   | `/api/parents/register`               | Parent registration    |
| POST   | `/api/parents/login`                  | Parent login           |
| GET    | `/api/parents/google`                 | Google OAuth login     |
| POST   | `/api/parents/password/reset/request` | Request password reset |
| POST   | `/api/parents/password/reset/:token`  | Reset password         |

---

### 📅 Events

| Method | Endpoint                    | Description         |
| ------ | --------------------------- | ------------------- |
| GET    | `/api/events`               | Get children events |
| POST   | `/api/events`               | Post a new event    |
| POST   | `/api/events/:eventId/rsvp` | RSVP for an event   |

---

### 📖 Stories

| Method | Endpoint                 | Description                   |
| ------ | ------------------------ | ----------------------------- |
| GET    | `/api/stories/:category` | Get stories by category       |
| POST   | `/api/stories`           | Upload a new story with image |

---

### 📚 Tutorials

| Method | Endpoint                           | Description              |
| ------ | ---------------------------------- | ------------------------ |
| GET    | `/api/tutorials?subject={subject}` | Get tutorials by subject |

---

### 🧠 Quizzes

| Method | Endpoint                    | Description |
| ------ | --------------------------- | ----------- |
| GET    | `/api/quizzes`              | Get quizzes |
| POST   | `/api/quizzes/:quizId/mark` | Mark a quiz |

---

### 🧾 Learning Content

| Method | Endpoint        | Description                                 |
| ------ | --------------- | ------------------------------------------- |
| POST   | `/api/contents` | Upload text, audio, video, or image content |

---

### 🏆 Rankings & Leaderboard

| Method | Endpoint                   | Description                |
| ------ | -------------------------- | -------------------------- |
| GET    | `/api/rankings/:contextId` | Rank students in a context |
| GET    | `/api/leaderboard`         | Get overall leaderboard    |
| GET    | `/api/winners/weekly`      | Announce weekly winners    |

---

## License

This project is open-source and available under the [MIT License](LICENSE).

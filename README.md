# Mini Project

This is a full-stack project with **Node.js + Express (backend)** and **React (frontend)**.  
The project is organized into two folders:

- `backend/` → Node.js + Express server
- `frontend/` → React app

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/AnshuPandey108/miniproject.git
cd miniproject
```

### 2. Backend Setup
```bash
cd backend
npm install
cp  .env  
npm run dev
```
### 3.Frontend Setup
```bash
cd ../frontend
npm install
cp  .env   
npm start
```
### Environment Variables

```bash
1.BAckend:
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/project_manager
JWT_SECRET=supersecretkey123
ACCESS_TOKEN_SECRET=supersecretaccesstoken
REFRESH_TOKEN_SECRET=supersecretrefreshtoken
ACCESS_TOKEN_EXPIRE=15m
REFRESH_TOKEN_EXPIRE=7d

2.Frontend
VITE_API_URL=http://localhost:5000/api

```




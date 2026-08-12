# 🚀 AI-Powered Resume & Job Matching Platform with RAG Integration

A full-stack, enterprise-grade application allowing job seekers to upload resumes, evaluate compatibility against job descriptions, receive AI-driven ATS match scores, practice generated technical interview questions with automated answer scoring, and query company interview guides using Retrieval-Augmented Generation (RAG).

---

## 💻 Tech Stack

### **Backend**
- **Java 17 (LTS)** & **Spring Boot 3.3.2**
- **Spring AI Framework** (Groq OpenAI-Compatible API integration, `llama-3.1-8b-instant` model, local ONNX `TransformersEmbeddingModel`, `SimpleVectorStore`)
- **Spring Data JPA** & **MySQL 8.0**
- **Spring Security** (Stateless JWT Authentication)
- **Apache Tika 2.9.2** (PDF Text Extraction)
- **Springdoc OpenAPI 2.5.0** (Interactive Swagger UI)

### **Frontend**
- **React.js (Vite)** & **Tailwind CSS** (Modern Glassmorphism Aesthetic)
- **Lucide Icons** & **Axios** (Bearer Token Interceptor)

### **DevOps & Delivery**
- **Docker & Docker Compose** (Multi-container orchestration for MySQL, Backend, Frontend)
- **GitHub Actions** (`.github/workflows/ci.yml` continuous integration for Java 17 & Node 20)

---

## 🔥 Key Enterprise Features

1. **📄 PDF Resume Parsing**: Drag-and-drop PDF resume upload with automated text extraction powered by Apache Tika and structured schema parsing via Spring AI.
2. **🎯 AI ATS Match Engine**: Dynamic ATS evaluation comparing candidate resumes against target job postings, generating Match Score %, Skill Matrices (Matched, Partial, Missing), and actionable ATS recommendations.
3. **🤖 Interactive AI Technical Interviewer**: Customized 5-question technical interview generation targeting candidate skill gaps, with real-time scoring (0-100 Technical Correctness & Clarity), missing concepts, and ideal answers.
4. **📚 Document RAG Advisor**: Upload company interview guides, chunk text using Spring AI `TokenTextSplitter`, store vector embeddings locally, and execute grounded similarity-search Q&A prompts with source chunk citations.
5. **🔐 Security & Data Isolation**: User-level isolation with strict foreign key constraints across `users`, `resumes`, `job_descriptions`, `applications`, `interview_sessions`, and `rag_documents`.

---

## 🌐 API Documentation (Swagger UI)

Interactive Swagger API documentation is available at:
`http://localhost:8080/api/v1/swagger-ui.html`

- **Register/Login**: Obtain a JWT access token.
- **Authorize**: Click **Authorize** button in Swagger UI and enter `Bearer <JWT_TOKEN>`.

---

## ⚡ Quick Start & Deployment

### Option A: Running with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/periyakaruppu7/Ai-Resume-Platform.git
cd Ai-Resume-Platform

# Launch full stack (MySQL + Backend + Frontend)
docker-compose up --build -d
```

- **React Frontend**: `http://localhost`
- **Spring Boot REST API**: `http://localhost:8080/api/v1`
- **Swagger Documentation**: `http://localhost:8080/api/v1/swagger-ui.html`

---

### Option B: Running Locally

#### 1. Backend Setup
Set environment variables or configure `src/main/resources/application.yml`:
```bash
cd backend
export GROQ_API_KEY="gsk_your_groq_api_key_here"
export DB_PASSWORD="your_mysql_password"

mvn spring-boot:run
```

#### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173`.

---

## 📤 Pushing to GitHub

Run the following commands in your shell to commit and push your repository cleanly:

```bash
git add .
git commit -m "feat: complete full-stack AI Resume & Job Matching Platform with RAG Integration"
git push origin main
```
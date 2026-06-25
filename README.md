# Notes Management System

A full-stack notes workspace using Spring Boot (REST API), PostgreSQL (Supabase), and React styled with a clean black-and-white monochrome theme.

---

## Tech Stack
- **Backend**: Spring Boot, Spring Data JPA, PostgreSQL (Supabase)
- **Frontend**: React, CSS (Grid & Flexbox)

---

## Step-by-Step Implementation

### 1. Database Configuration
- Added the PostgreSQL dependency to [pom.xml](backend/note/pom.xml).
- Set up connection credentials in [application.properties](backend/note/src/main/resources/application.properties) targeting Supabase.

### 2. Backend Development
- **Entity**: Created [Note.java](backend/note/src/main/java/com/example/note/Note.java) with auto-timestamps.
- **Repository**: Created [NoteRepository.java](backend/note/src/main/java/com/example/note/NoteRepository.java) extending `JpaRepository`.
- **Controller**: Created [NoteController.java](backend/note/src/main/java/com/example/note/NoteController.java) to handle REST CRUD endpoints (`GET`, `POST`, `PUT`, `DELETE`).

### 3. Frontend Development
- **Styling**: Configured a clean black-and-white theme in [index.css](frontend/src/index.css) using a 2-column grid layout.
- **Components & Logic**: Wrote state management, REST API integration, real-time search, compose modals, and client-side pagination (exactly 4 notes per page) in [App.js](frontend/src/App.js).

---

## How to Run

### Backend
Navigate to the `backend/note` directory and run:
```powershell
.\mvnw.cmd spring-boot:run
```

### Frontend
Navigate to the `frontend` directory and run:
```powershell
npm start
```
The client will start at `http://localhost:3000`.

# URL Shortener

A full-stack URL Shortener application built using Java, Spring Boot, React, and MySQL that converts long URLs into short and shareable links. The application provides fast URL redirection, unique short-code generation, and RESTful APIs for efficient URL management.

---

## Features

- Shorten long URLs into compact links
- Redirect short URLs to original URLs
- Unique short-code generation
- RESTful API support
- Database persistence using MySQL
- Clean and responsive UI
- Copy shortened URL functionality
- Scalable backend architecture

---

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- MySQL

### Frontend
- React.js
- Tailwind CSS

### Tools
- Maven
- Postman
- Git & GitHub

---

## Project Workflow

```text
User enters long URL
        ↓
Frontend sends request to backend
        ↓
Backend validates URL
        ↓
Generate unique short code
        ↓
Store mapping in database
        ↓
Return shortened URL
        ↓
User opens short URL
        ↓
Backend fetches original URL
        ↓
Redirect to original website
```

---

## API Endpoints

### Create Short URL

```http
POST /api/shorten
```

### Request

```json
{
  "url": "https://google.com"
}
```

### Response

```json
{
  "shortUrl": "http://localhost:8080/aB12x"
}
```

---

### Redirect URL

```http
GET /{shortCode}
```

Example:

```http
GET /aB12x
```

Redirects user to the original URL.

---

## Database Schema

| Column Name  | Type      |
|-------------|-----------|
| id          | Long      |
| original_url| String    |
| short_code  | String    |
| created_at  | Timestamp |

---

## Installation & Setup

### Clone Repository

```bash
git clone https://github.com/your-username/url-shortener.git
```

---

### Backend Setup

```bash
cd backend
```

Configure MySQL database in `application.properties`.

Run Spring Boot application:

```bash
mvn spring-boot:run
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Folder Structure

```text
url-shortener/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   └── application.properties
│
├── frontend/
│   ├── src/
│   ├── components/
│   └── pages/
│
└── README.md
```

---

## Future Enhancements

- User authentication
- URL analytics
- QR code generation
- Custom aliases
- URL expiration feature
- Redis caching

---

## Resume Description

Developed a full-stack URL Shortener application using Spring Boot, React, and MySQL that converts long URLs into compact shareable links. Implemented REST APIs, unique short-code generation, database persistence, and URL redirection with scalable backend architecture.

---

## Author

Abhishek Vadiyala

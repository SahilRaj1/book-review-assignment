## 🗂️ Schema Design

### 🔐 User Schema

| Field          | Type   | Description                              |
| -------------- | ------ | ---------------------------------------- |
| `username`     | String | Unique username, stored in lowercase     |
| `email`        | String | Unique email address                     |
| `fullName`     | String | Full name of the user                    |
| `password`     | String | Hashed password                          |
| `refreshToken` | String | JWT refresh token                        |
| `createdAt`    | Date   | Timestamp when the user was created      |
| `updatedAt`    | Date   | Timestamp when the user was last updated |

* 🔒 Passwords are hashed before saving. JWT is used for authentication.
* 👤 `User` is referenced in books and reviews for ownership.

---

### 📘 Book Schema

| Field           | Type     | Description                                    |
| --------------- | -------- | ---------------------------------------------- |
| `title`         | String   | Required and unique (case-insensitive)         |
| `description`   | String   | Description of the book                        |
| `author`        | String   | Author's name                                  |
| `genre`         | String   | Genre of the book                              |
| `noOfReviews`   | Number   | Total number of reviews (default: 0)           |
| `averageRating` | Number   | Average rating across all reviews (default: 0) |
| `addedBy`       | ObjectId | Reference to the `User` who added the book     |
| `createdAt`     | Date     | Timestamp when the book was created            |
| `updatedAt`     | Date     | Timestamp when the book was last updated       |

* 📚 A single user can add multiple books.
* 📊 Review data (average rating and total reviews) is dynamically updated.

---

### ✍️ Review Schema

| Field           | Type     | Description                                |
| --------------- | -------- | ------------------------------------------ |
| `rating`        | Number   | Required, must be between 1–5              |
| `reviewContent` | String   | Review text content                        |
| `book`          | ObjectId | Reference to the reviewed `Book`           |
| `reviewer`      | ObjectId | Reference to the `User` who posted review  |
| `createdAt`     | Date     | Timestamp when the review was created      |
| `updatedAt`     | Date     | Timestamp when the review was last updated |

* 🧾 Each user can only post **one review per book**.
* 🔗 Reviews are automatically deleted when a book is removed (cascading delete).
* 📈 Used in book detail pages to display ratings and review lists.

---

### 🔁 Relationships

* **User ↔ Book**: One-to-many (via `addedBy`)
* **User ↔ Review**: One-to-many (via `reviewer`)
* **Book ↔ Review**: One-to-many (via `book`)

---

## ⚙️ Project Setup Instructions

### 1. **Clone the repository**

```bash
git clone https://github.com/your-username/book-review-assignment.git
cd book-review-assignment
```

### 2. **Install dependencies**

```bash
npm install
npm install --save-dev
```

### 3. **Environment variables**

Since I am submitting the project for review, I have pushed `.env` file as well in the root directory.

---

## 🧪 How to Run Locally

### 1. **Start the development server**

```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the port you specify in `.env`).

### 2. **API Base URL and documentation**

```
http://localhost:5000/api/v1
```

---

## 📚 API Endpoints

### 🔐 **API health check**

| Method | Endpoint           | Description                        | Auth Required |
| ------ | ------------------ | ---------------------------------- | ------------- |
| GET    | `/api/v1`          | Swagger Documentationof API          | ❌             |

---

### 🔐 **API health check**

| Method | Endpoint           | Description                        | Auth Required |
| ------ | ------------------ | ---------------------------------- | ------------- |
| GET    | `/api/v1/health-check` | Health check endpoint          | ❌             |

---

### 🔐 **Auth & User**

| Method | Endpoint           | Description                        | Auth Required |
| ------ | ------------------ | ---------------------------------- | ------------- |
| POST   | `/api/v1/user/signup` | Register a new user                | ❌             |
| POST   | `/api/v1/user/login`    | Login and receive tokens           | ❌             |
| POST   | `/api/v1/user/logout`   | Logout user and clear tokens       | ✅             |
| GET    | `/api/v1/user/me`       | Get current logged-in user info    | ✅             |
| POST   | `/api/v1/user/refresh`  | Refresh access token using refresh | ❌             |
| PUT    | `/api/v1/user/update`   | Update user details                | ✅             |
| PUT    | `/api/v1/user/password` | Change current password            | ✅             |

---

### 📘 **Books**

| Method | Endpoint               | Description                                        | Auth Required |
| ------ | ---------------------- | -------------------------------------------------- | ------------- |
| GET    | `/api/v1/books`        | Get all books with pagination & optional filters   | ❌             |
| POST   | `/api/v1/books`        | Add a new book                                     | ✅             |
| GET    | `/api/v1/books/search` | Search books by title or author (partial match)    | ❌             |
| GET    | `/api/v1/books/:id`    | Get details of a specific book + paginated reviews | ❌             |
| PUT    | `/api/v1/books/:id`    | Update a book (only addedBy can update)            | ✅             |
| DELETE | `/api/v1/books/:id`    | Delete a book + cascade delete reviews             | ✅             |

---

### ✍️ **Reviews**

| Method | Endpoint                    | Description                                  | Auth Required |
| ------ | --------------------------- | -------------------------------------------- | ------------- |
| POST   | `/api/v1/books/:id/reviews` | Add a review to a book (1 per user per book) | ✅             |
| PUT    | `/api/v1/reviews/:id`       | Update your review                           | ✅             |
| DELETE | `/api/v1/reviews/:id`       | Delete your review                           | ✅             |

---

## 📬 Postman Collection

A Postman collection is included in the root directory of this project:

```
📁 postman_collection.json
```

This file contains all the API endpoints with pre-configured request bodies, headers, and authentication where needed.

### ✅ How to Use:

1. Open [Postman](https://www.postman.com/).
2. Click on **Import**.
3. Choose the `postman_collection.json` file from the project root.
4. Start testing the APIs directly — all routes and methods are already set up for convenience.

---

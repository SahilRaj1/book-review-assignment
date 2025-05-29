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

> 🔒 Passwords are hashed before saving. JWT is used for authentication.
> 👤 `User` is referenced in books and reviews for ownership and authorship.

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

> 📚 A single user can add multiple books.
> 📊 Review data (average rating and total reviews) is dynamically updated.

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

> 🧾 Each user can only post **one review per book**.
> 🔗 Reviews are automatically deleted when a book is removed (cascading delete).
> 📈 Used in book detail pages to display ratings and review lists.

---

### 🔁 Relationships

* **User ↔ Book**: One-to-many (via `addedBy`)
* **User ↔ Review**: One-to-many (via `reviewer`)
* **Book ↔ Review**: One-to-many (via `book`)

---



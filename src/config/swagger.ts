export const swaggerDefinition = {
  info: {
    title: "Book & Review API",
    description: "API documentation for book and review management",
    version: "1.0.0",
  },
  host: "localhost:5000",
  basePath: "/api/v1",
  schemes: ["http"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [],
  definitions: {
    User: {
      username: "john_doe",
      email: "john@example.com",
      fullName: "John Doe",
      password: "password123",
    },
    Login: {
      email: "john@example.com",
      password: "password123",
    },
    Book: {
      title: "Sample Book",
      description: "A great book",
      author: "Author Name",
      genre: "Fiction",
    },
    Review: {
      rating: 5,
      reviewContent: "Amazing book!",
    },
  },
};

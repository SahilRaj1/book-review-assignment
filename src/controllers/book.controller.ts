import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Book from "../models/book.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import mongoose, { PipelineStage } from "mongoose";
import Review from "../models/review.model";

export const getAllBooks = asyncHandler(
    async (req: Request, res: Response) => {
        const { page = 1, limit = 10, author, genre } = req.query;

        const filters: any = {};
        if (author) filters.author = { $regex: new RegExp(author as string, "i") };
        if (genre) filters.genre = { $regex: new RegExp(genre as string, "i") };

        const aggregatePipeline : PipelineStage[] = [
            { $match: filters },
            {
                $sort: { createdAt: -1 },
            }
        ];

        const options = {
            page: parseInt(page as string, 10),
            limit: parseInt(limit as string, 10),
        };

        const books = await (Book as any).aggregatePaginate(
            Book.aggregate(aggregatePipeline),
            options
        );

        if (!books.docs || books.docs.length === 0) {
            throw new ApiError(404, "No books found");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, books, "Books fetched successfully"));
    }
);

export const addBook = asyncHandler(
    async (req: Request, res: Response) => {
        const { title, description, author, genre } = req.body;

        if (
            [title, description, author, genre].some(
                (field: string) => field?.trim() === ""
            )
        ) {
            throw new ApiError(400, "All fields are required");
        }

        const existingBook = await Book.findOne({
            title: { $regex: `^${title}$`, $options: "i" }
        });

        if (existingBook) {
            throw new ApiError(409, "Book with this title already exists");
        }

        const book = await Book.create({
            title,
            description,
            author,
            genre,
            addedBy: (req as any).user._id,
        });

        if (!book) {
            throw new ApiError(500, "Something went wrong while adding the book");
        }

        return res
            .status(201)
            .json(
                new ApiResponse(201, book, "Book added successfully")
            );
    }
);

export const getBookById = asyncHandler(
    async (req: Request, res: Response) => {
        const { id: bookId } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            throw new ApiError(400, "Invalid book ID");
        }

        // Check if book exists
        const bookExists = await Book.findById(bookId).lean();
        if (!bookExists) {
            throw new ApiError(404, "Book not found");
        }

        const ratingStatsAggregatePipeline : PipelineStage[] = [
            { $match: { book: new mongoose.Types.ObjectId(bookId) } },
            {
                $group: {
                    _id: "$book",
                    averageRating: { $avg: "$rating" },
                    noOfReviews: { $sum: 1 },
                },
            },
        ]

        // Fetch averageRating and review count
        const ratingStats = await Review.aggregate(ratingStatsAggregatePipeline);

        const averageRating = ratingStats[0]?.averageRating || 0;
        const noOfReviews = ratingStats[0]?.noOfReviews || 0;

        const reviewsAggregatePipeline : PipelineStage[] = [
            { $match: { book: bookId } },
            {
                $lookup: {
                    from: "users",
                    localField: "reviewer",
                    foreignField: "_id",
                    as: "reviewer",
                },
            },
            { $unwind: "$reviewer" },
            {
                $project: {
                    rating: 1,
                    reviewContent: 1,
                    createdAt: 1,
                    reviewer: {
                        _id: 1,
                        fullName: 1,
                        username: 1,
                    },
                },
            },
            { $sort: { createdAt: -1 } },
        ]

        // Fetch paginated reviews
        const reviewsAggregate = Review.aggregate(reviewsAggregatePipeline);

        const paginatedReviews = await Review.aggregatePaginate(
            reviewsAggregate,
            { page, limit }
        );

        return res.status(200).json(
            new ApiResponse(200, {
                book: {
                    ...bookExists,
                    averageRating,
                    noOfReviews,
                },
                reviews: paginatedReviews,
            })
        );
    }
);

export const updateBook = asyncHandler(
    async (req: Request, res: Response) => {
        // extracting book ID from params and update fields from body
        const { id } = req.params;
        const { title, description, author, genre } = req.body;

        if (!id) {
            throw new ApiError(400, "Book ID is required");
        }

        // checking if the book exists
        const book = await Book.findById(id);
        if (!book) {
            throw new ApiError(404, "Book not found");
        }

        // if title is being updated, check if another book has this title (case-insensitive)
        if (title && title.trim() !== book.title) {
            const existingBook = await Book.findOne({
                _id: { $ne: id },
                title: { $regex: `^${title.trim()}$`, $options: "i" },
            });

            if (existingBook) {
                throw new ApiError(409, "Another book with this title already exists");
            }
        }

        // updating only provided fields
        if (title) book.title = title.trim();
        if (description) book.description = description.trim();
        if (author) book.author = author.trim();
        if (genre) book.genre = genre.trim();

        await book.save();

        return res.status(200).json(
            new ApiResponse(200, book, "Book updated successfully")
        );
    }
);

export const deleteBook = asyncHandler(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) {
            throw new ApiError(400, "Book ID is required");
        }

        const book = await Book.findById(id);
        if (!book) {
            throw new ApiError(404, "Book not found");
        }

        // deleting all reviews associated with this book
        await Review.deleteMany({ book: new mongoose.Types.ObjectId(id) });

        // deleting the book
        await book.deleteOne();

        return res.status(200).json(
            new ApiResponse(200, null, "Book deleted successfully")
        );
    }
);

export const searchBooks = asyncHandler(
    async (req: Request, res: Response) => {
        const { query } = req.query;

        if (!query || (query as string).trim() === "") {
            throw new ApiError(400, "Search query is required");
        }

        // case-insensitive partial match
        const regex = new RegExp(query as string, "i");

        const books = await Book.find({
            $or: [{ title: regex }, { author: regex }],
        }).sort({ createdAt: -1 });

        if (!books.length) {
            throw new ApiError(404, "No books found matching the search query");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, books, "Books fetched successfully")
            );
    }
);

import { Request, Response } from "express";
import asyncHandler from "../utils/asyncHandler";
import Book from "../models/book.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { PipelineStage } from "mongoose";
import Review from "../models/review.model";

export const addReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: bookId } = req.params;
    const { rating, reviewContent } = req.body;
    const userId = (req as any).user._id;

    // Validating input fields
    if (![1, 2, 3, 4, 5].includes(rating)) {
      throw new ApiError(400, "Rating must be an integer between 1 and 5");
    }
    if (!reviewContent || reviewContent.trim() === "") {
      throw new ApiError(400, "Review content is required");
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      throw new ApiError(404, "Book not found");
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({ book: bookId, reviewer: userId });
    if (existingReview) {
      throw new ApiError(409, "You have already submitted a review for this book");
    }

    // Creating the review
    const review = await Review.create({
      rating,
      reviewContent,
      book: bookId,
      reviewer: userId,
    });

    const aggregatePipeline : PipelineStage[] = [
      { $match: { book: book._id } },
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]

    // Updating book stats (averageRating and noOfReviews)
    const aggregateResult = await Review.aggregate(aggregatePipeline);

    if (aggregateResult.length > 0) {
      book.averageRating = aggregateResult[0].avgRating;
      book.noOfReviews = aggregateResult[0].count;
    } else {
      book.averageRating = 0;
      book.noOfReviews = 0;
    }

    await book.save();

    return res
      .status(201)
      .json(new ApiResponse(201, review, "Review submitted successfully"));
  }
);

export const updateReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const { rating, reviewContent } = req.body;
    const userId = (req as any).user._id;

    if (rating !== undefined && ![1, 2, 3, 4, 5].includes(rating)) {
      throw new ApiError(400, "Rating must be an integer between 1 and 5");
    }
    if (reviewContent !== undefined && reviewContent.trim() === "") {
      throw new ApiError(400, "Review content cannot be empty");
    }

    // Find review and check ownership
    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }
    if (review.reviewer.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only update your own reviews");
    }

    // Update fields if provided
    if (rating !== undefined) review.rating = rating;
    if (reviewContent !== undefined) review.reviewContent = reviewContent;

    await review.save();

    const aggregatePipeline : PipelineStage[] = [
      { $match: { book: review.book } },
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]

    // Update book stats after review update
    const aggregateResult = await Review.aggregate(aggregatePipeline);

    const book = await Book.findById(review.book);
    if (aggregateResult.length > 0) {
      book!.averageRating = aggregateResult[0].avgRating;
      book!.noOfReviews = aggregateResult[0].count;
    } else {
      book!.averageRating = 0;
      book!.noOfReviews = 0;
    }

    await book!.save();

    return res
      .status(200)
      .json(new ApiResponse(200, review, "Review updated successfully"));
  }
);

export const deleteReview = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: reviewId } = req.params;
    const userId = (req as any).user._id;

    const review = await Review.findById(reviewId);
    if (!review) {
      throw new ApiError(404, "Review not found");
    }
    if (review.reviewer.toString() !== userId.toString()) {
      throw new ApiError(403, "You can only delete your own reviews");
    }

    const bookId = review.book;
    await review.remove();

    const aggregatePipeline : PipelineStage[] = [
      { $match: { book: bookId } },
      {
        $group: {
          _id: "$book",
          avgRating: { $avg: "$rating" },
          count: { $sum: 1 },
        },
      },
    ]

    // Update book stats after review deletion
    const aggregateResult = await Review.aggregate(aggregatePipeline);

    const book = await Book.findById(bookId);
    if (aggregateResult.length > 0) {
      book!.averageRating = aggregateResult[0].avgRating;
      book!.noOfReviews = aggregateResult[0].count;
    } else {
      book!.averageRating = 0;
      book!.noOfReviews = 0;
    }

    await book!.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Review deleted successfully"));
  }
);

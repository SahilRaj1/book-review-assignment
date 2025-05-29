import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const reviewSchema = new Schema(
    {
        rating: {
            type: Number,
            required: [true, "Rating is required"],
            enum: [1, 2, 3, 4, 5],
        },
        reviewContent: {
            type: String,
            required: [true, "Review is required"],
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: "Book",
        },
        reviewer: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

reviewSchema.plugin(mongooseAggregatePaginate);

const Review = model("Review", reviewSchema);

export default Review;

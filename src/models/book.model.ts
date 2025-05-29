import { Schema, model } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const bookSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
        },
        author: {
            type: String,
            required: [true, "Author is required"],
        },
        genre: {
            type: String,
            required: [true, "Genre is required"],
        },
        noOfReviews: {
            type: Number,
            default: 0,
        },
        averageRating : {
            type: Number,
            default: 0,
        },
        addedBy : {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

bookSchema.plugin(mongooseAggregatePaginate);

const Book = model("Book", bookSchema);

export default Book;

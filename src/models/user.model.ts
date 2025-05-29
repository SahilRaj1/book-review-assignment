import { Schema, model } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction } from "express";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, "Username is required"],
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
        },
        fullName: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            index: true,
        },
        avatarUrl: {
            type: String, // cloudinary url
            required: true,
        },
        avatarPublicId: {
            type: String, // cloudinary public ID
            required: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
        },
        refreshToken: {
            type: String,
        },
    },
    { timestamps: true }
);

(userSchema as any).pre("save", async function (this: any, next: NextFunction) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
    const accessToken = jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullName: this.fullName,
        },
        process.env.ACCESS_TOKEN_SECRET!,
        ({
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        } as jwt.SignOptions)
    );
    
    return accessToken;
};

userSchema.methods.generateRefreshToken = async function () {
    const refreshToken = jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET!,
        ({
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        } as jwt.SignOptions)
    );

    return refreshToken;
};

const User = model("User", userSchema);

export default User;

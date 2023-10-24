
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
}, {timestamps: true});


export const Post = mongoose.model('posts', PostSchema);


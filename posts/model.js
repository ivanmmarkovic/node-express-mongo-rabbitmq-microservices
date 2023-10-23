
import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        reqired: true
    },
    body: {
        type: String,
        reqired: true
    }
}, {timestamps: true});


export const Post = mongoose.model('posts', PostSchema);


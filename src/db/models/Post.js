import Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema(
  {
    author: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    avatar: { type: String },
    title: { type: String, required: 'title is required' },
    description: { type: String, required: 'description is required' },
    image: { type: String, required: 'image url is required' },
  },
  { timestamps: true }
);

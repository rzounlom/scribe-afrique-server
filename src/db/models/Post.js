import Mongoose from 'mongoose';

const postSchema = new Mongoose.Schema(
  {
    author: { type: Mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: { type: String, required: 'title is required' },
    description: { type: String, required: 'description is required' },
    image: { type: String, required: 'image url is required' },
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const PostModel = Mongoose.model('Post', postSchema);
export default PostModel;

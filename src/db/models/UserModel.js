import Mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Mongoose.Schema(
  {
    username: { type: String, unique: true, required: 'Username is required' },
    password: { type: String, required: 'password is required' },
    role: { type: String, default: 'ADMIN' },
    avatar: { type: String },
    posts: [{ type: Mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  //salt password
  this.password = await bcrypt.hashSync(this.password, 12);
});

const UserModel = Mongoose.model('User', userSchema);
export default UserModel;

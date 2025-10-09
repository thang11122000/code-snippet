import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  userId: string; // Unique ID from NextAuth (e.g., Google OAuth ID)
  email: string; // User's email address
  name: string; // User's display name
  image?: string; // User's profile image URL
  provider: string; // Authentication provider (google, github, etc.)
  lastLogin: Date; // Last login timestamp
  createdAt: Date; // Account creation timestamp
  updatedAt: Date; // Last update timestamp
}

const UserSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      default: null,
    },
    provider: {
      type: String,
      required: true,
      enum: ['google', 'github', 'credentials'],
      default: 'credentials',
    },
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create indexes for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });

export default mongoose.model<IUser>('User', UserSchema);

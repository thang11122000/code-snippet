import mongoose, { Document, Schema } from 'mongoose';

export interface ILike extends Document {
  userId: string;
  snippetId: string;
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    snippetId: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
    toJSON: {
      virtuals: true,
      transform: function (_doc, ret) {
        delete ret._id;
        delete (ret as any).__v;
        return ret;
      },
    },
  }
);

// Compound index to ensure a user can only like a snippet once
LikeSchema.index({ userId: 1, snippetId: 1 }, { unique: true });

export default mongoose.model<ILike>('Like', LikeSchema);

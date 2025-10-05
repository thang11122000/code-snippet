import mongoose, { Document, Schema } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorImage?: string;
  likes: number;
  views: number;
  isPublic: boolean;
  complexity: 'beginner' | 'intermediate' | 'advanced';
  createdAt: Date;
  updatedAt: Date;
}

const SnippetSchema = new Schema<ISnippet>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    code: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags: string[]) {
          return tags.length <= 10;
        },
        message: 'Maximum 10 tags allowed',
      },
    },
    authorId: {
      type: String,
      required: true,
      index: true,
    },
    authorName: {
      type: String,
      required: true,
    },
    authorImage: {
      type: String,
      default: null,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    complexity: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  {
    timestamps: true,
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

// Indexes for better query performance
SnippetSchema.index({ authorId: 1, createdAt: -1 });
SnippetSchema.index({ language: 1 });
SnippetSchema.index({ tags: 1 });
SnippetSchema.index({ likes: -1 });
SnippetSchema.index({ views: -1 });
SnippetSchema.index({ createdAt: -1 });
SnippetSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<ISnippet>('Snippet', SnippetSchema);

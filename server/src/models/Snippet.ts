import mongoose, { Document, Schema } from 'mongoose';

export interface ISnippet extends Document {
  title: string;
  description: string;
  code: string;
  languageCode: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorImage?: string;
  isPublic: boolean;
  complexity: string;
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
    languageCode: {
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
    isPublic: {
      type: Boolean,
      default: true,
    },
    complexity: {
      type: String,
      trim: true,
      default: 'unknown',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
SnippetSchema.index({ authorId: 1, createdAt: -1 });
SnippetSchema.index({ languageCode: 1 });
SnippetSchema.index({ tags: 1 });
SnippetSchema.index({ createdAt: -1 });
SnippetSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<ISnippet>('Snippet', SnippetSchema);

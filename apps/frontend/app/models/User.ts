import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
    },
    total_points: {
      type: Number,
      default: 0,
    },
    current_level: {
      type: Number,
      default: 1,
    },
    streak_count: {
      type: Number,
      default: 0,
    },
    last_login: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

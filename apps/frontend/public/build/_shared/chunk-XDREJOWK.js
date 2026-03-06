import {
  require_browser_umd
} from "/build/_shared/chunk-FN4XIHTW.js";
import {
  createHotContext
} from "/build/_shared/chunk-HUMZIC5X.js";
import {
  __toESM
} from "/build/_shared/chunk-PZDJHGND.js";

// app/models/User.ts
var import_mongoose = __toESM(require_browser_umd(), 1);
if (import.meta) {
  import.meta.hot = createHotContext(
    //@ts-expect-error
    "app\\models\\User.ts"
  );
  import.meta.hot.lastModified = "1772353506163.5662";
}
var userSchema = new import_mongoose.default.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password_hash: {
      type: String,
      required: true
    },
    total_points: {
      type: Number,
      default: 0
    },
    current_level: {
      type: Number,
      default: 1
    },
    streak_count: {
      type: Number,
      default: 0
    },
    last_login: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);
userSchema.index({ email: 1 });
var User = import_mongoose.default.model("User", userSchema);
//# sourceMappingURL=/build/_shared/chunk-XDREJOWK.js.map

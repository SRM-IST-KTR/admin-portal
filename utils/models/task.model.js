const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["BACKLOG", "TO_DO", "IN_PROGRESS", "CODE_REVIEW", "TESTING", "DONE"],
      default: "BACKLOG",
    },
    priority: {
      type: String,
      enum: ["LOW", "MEDIUM", "HIGH", "URGENT"],
      default: "MEDIUM",
    },
    storyPoints: {
      type: Number,
      min: 0,
      max: 100,
    },
    dueDate: {
      type: Date,
    },
    bucket: {
      type: String,
      default: "General",
    },
    assignedTo: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams',
    },
    labels: [{
      name: String,
      color: String,
    }],
    attachments: [{
      name: String,
      url: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    comments: [{
      text: String,
      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    }],
    updates: [{
      content: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
      date: {
        type: Date,
        default: Date.now,
      },
    }],
    completedAt: {
      type: Date,
    },
    blockedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tasks',
    }],
    blocks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'tasks',
    }],
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sprints',
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({ title: 'text', description: 'text' });

let Task;
try {
  Task = mongoose.model("tasks");
} catch {
  Task = mongoose.model("tasks", taskSchema);
}

module.exports = Task;
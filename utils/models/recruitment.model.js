import mongoose from "mongoose";

const participantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    year: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      required: true,
      trim: true,
    },
    degreeWithBranch: {
      type: String,
      required: true,
      trim: true,
    },
    // Flexible links object supporting arbitrary domain-specific submission requirements
    links: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({
        github: null,
        demo: null,
        deployment: null,
      }),
    },
    status: {
      type: String,
      enum: [
        "registered",
        "task_assigned",
        "taskSubmitted",
        "interviewShortlisted",
        "interviewShortlist",
        "onboarding",
        "rejected",
        "underReview",
      ],
      default: "registered",
    },
    notes: {
      type: String,
      default: "",
    },
    review: {
      rating: { type: Number, default: 0 },
      feedback: { type: String, default: "" },
      interviewer: { type: String, default: "" },
      reviewedAt: { type: Date, default: null },
    },
  },
  {
    timestamps: true,
    strict: false, // Allows additional domain-specific submission fields dynamically
  }
);

participantSchema.index({ domain: 1, year: 1 });
participantSchema.index({ status: 1 });
participantSchema.index({ name: "text", email: "text", registrationNumber: "text" });

const ParticipantUser =
  mongoose.models.recruitment26 ||
  mongoose.model("recruitment26", participantSchema, "recruitment26");

export default ParticipantUser;

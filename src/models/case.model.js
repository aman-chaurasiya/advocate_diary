import mongoose, { Schema } from "mongoose";

// Define the Court Case schema
const courtCaseSchema = new Schema(
  {
    caseNumber: {
      type: String,
      required: true,
      unique: true, // Ensure case numbers are unique
      trim: true,
    },
    caseTitle: {
      type: String,
      required: true,
      trim: true,
    },
    caseType: {
      type: String,
      required: true,
      enum: ["Civil", "Criminal", "Family", "Commercial", "Labor"], // You can add more types based on your needs
    },
    plaintiff: {
      type: String, //
      required: true,
      trim: true,
    },
    defendant: {
      type: String,
      required: true,
      trim: true,
    },
    caseStatus: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved", "Dismissed", "Closed"],
      default: "Pending",
    },
    filedDate: {
      type: Date,
      required: true,
      default: Date.now, // Automatically set to current date if not provided
    },
    hearingDates: [
      {
        date: {
          type: Date,
          // required: true,
        },
        description: {
          type: String,
          trim: true,
        },
      },
    ],
    judgmentDate: {
      type: Date,
    },
    judgment: {
      type: String,
      trim: true,
    },
    lawyer: {
      name: {
        type: String,
        trim: true,
      },
      contact: {
        type: String,
        trim: true,
      },
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt fields
  }
);

export const CourtCase = mongoose.model("CourtCase", courtCaseSchema);

import mongoose, { Schema } from "mongoose";

const caseSchema = new Schema(
  {
    caseNumber: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
    },
    caseName: {
      type: String,
      require: true,
      lowercase: true,
      trim: true,
    },
    caseType: {
      type: String,
      lowercase: true,
      trim: true,
    },

    priviousDate: {
      type: String,
      lowercase: true,
      trim: true,
    },
    nextDate: {
      type: String,
      lowercase: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    // advocateName: {},
    // courtName: {},
    // judgeName: {}, // optional

    // partyName: {},
    // partyAddress: {},
    // partyContact: {},
    // antiPartyName: {},
    // antiPartyContact: {},
    // antiPartyAdvocate: {},
  },
  {
    timestamps: true,
  }
);
export const Case = mongoose.model("Case", caseSchema);

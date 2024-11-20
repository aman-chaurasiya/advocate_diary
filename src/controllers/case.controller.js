import { asyncHandler } from "../utils/asyncHandler.js";
import { CourtCase } from "../models/case.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addNewCase = asyncHandler(async (req, resp) => {
  const {
    caseNumber,
    caseTitle,
    caseType,
    plaintiff,
    defendant,
    caseStatus,
    filedDate,
  } = req.body;

  if (
    [
      caseNumber,
      caseTitle,
      caseType,
      plaintiff,
      defendant,
      caseStatus,
      filedDate,
    ].some((fields) => fields?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  const existedCase = await CourtCase.findOne({
    $or: [{ caseNumber }, { caseTitle }],
  });
  if (existedCase) {
    throw new ApiError(
      409,
      "case with caseNumber or caseTitle already exist!!"
    );
  }

  const Newcase = await CourtCase.create({
    caseNumber,
    caseTitle,
    caseType,
    plaintiff,
    defendant,
    caseStatus,
    filedDate,
  });
  const createdCase = await CourtCase.findById(Newcase._id);
  if (!createdCase) {
    throw new ApiError(500, "Something went wrong while adding the case");
  }
  return resp
    .status(201)
    .json(new ApiResponse(200, createdCase, "case add Successfully"));
});

export { addNewCase };

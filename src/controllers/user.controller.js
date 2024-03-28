import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, resp) => {
  const { firstname } = req.body;

  return resp
    .status(201)
    .json(new ApiResponse(200, firstname, "User register successfully!!"));
});

export { registerUser };

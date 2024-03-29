import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "./../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, resp) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if (
    [firstName, lastName, email, mobile, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email or mobile already exist!!");
  }

  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!!");
  }
  const avatar = await uploadOnCloudinary(avatarLocalPath, "Avatars");
  if (!avatar) {
    throw new ApiError(400, "Avatar file is required");
  }

  const user = await User.create({
    firstName,
    lastName,
    avatar: avatar.url,
    mobile,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }
  return resp
    .status(201)
    .json(new ApiResponse(200, createdUser, "User register successfully!!"));
});

// const testing = asyncHandler(async (req, resp) => {
//   const avatar = req.file.path;
//   return resp.status(200).json(new ApiResponse(200, avatar, " successfully:"));
// });

export { registerUser };

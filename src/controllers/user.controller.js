import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "./../utils/ApiResponse.js";
import fs from "fs";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();

    // console.log(accessToken, "==========>");
    const refreshToken = user.generateRefreshToken();
    // console.log(refreshToken, "==========>");

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "somthing went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, resp) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  if (
    [firstName, lastName, email, mobile, password].some(
      (fields) => fields?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required!!");
  }
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is missing!!");
  }

  const existedUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existedUser) {
    fs.unlinkSync(avatarLocalPath);
    throw new ApiError(409, "User with email or mobile already exist!!");
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

const loginUser = asyncHandler(async (req, resp) => {
  const { email, password, mobile } = req.body;

  if (!mobile && !email) {
    throw new ApiError(400, "username or password is required");
  }
  const user = await User.findOne({
    $or: [{ mobile }, { email }],
  });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "invalid user cridentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return resp
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User login successfully!!"
      )
    );
});

const logoutUser = asyncHandler(async (req, resp) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return resp
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

// const testing = asyncHandler(async (req, resp) => {
//   const avatar = req.file.path;
//   return resp.status(200).json(new ApiResponse(200, avatar, " successfully:"));
// });

export { registerUser, loginUser, logoutUser };

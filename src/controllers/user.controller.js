import { userService } from "../services/user.service.js";
import fs from "fs";

const getUsersByRole = async (req, res, next) => {
  try {
    const page = Number(req.query["page"]);
    const role = req.query.role.toUpperCase();

    const result = await userService.getUsersByRole({ page, role });
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { email } = req.userData;

    const result = await userService.updateUser({ ...req.body, email });
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const updateEmail = async (req, res, next) => {
  try {
    const { email } = req.userData;

    const { user, newAccessToken } = await userService.updateEmail({
      ...req.body,
      email,
    });

    res.cookie("accessToken", newAccessToken, { httpOnly: true });
    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { email } = req.userData;
    await userService.updatePassword({ ...req.body, email });

    res.status(200).json({ message: "updated password successfully" });
  } catch (error) {
    next(error);
  }
};

const updatePhotoProfile = async (req, res, next) => {
  try {
    const { email } = req.userData;

    const result = await userService.updatePhotoProfile({ ...req.body, email });
    res.status(200).json({ data: result });
  } catch (error) {
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    next(error);
  }
};

export const userController = {
  getUsersByRole,
  updateUser,
  updateEmail,
  updatePassword,
  updatePhotoProfile,
};

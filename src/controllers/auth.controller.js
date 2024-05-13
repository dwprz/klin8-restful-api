import { authService } from "../services/auth.service.js";

const sendOtp = async (req, res, next) => {
  try {
    await authService.sendOtp(req.body.email);
    res.status(200).json({ message: "sent otp successfully" });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    await authService.verifyOtp(req.body);
    res.status(200).json({ message: "verified otp successfully" });
  } catch (error) {
    next(error);
  }
};

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.login(req.body);

    res.cookie("accessToken", tokens.newAccessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.newRefreshToken, { httpOnly: true });

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const loginWithGoogle = async (req, res, next) => {
  try {
    const { user, tokens } = await authService.loginWithGoogle(req.body);

    res.cookie("accessToken", tokens.newAccessToken, { httpOnly: true });
    res.cookie("refreshToken", tokens.newRefreshToken, { httpOnly: true });

    res.status(200).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies["refreshToken"];

    if (!refreshToken) {
      return res
        .status(401)
        .json({ error: "refreshToken cookie is required " });
    }

    const { accessToken, user } = await authService.generateNewAccessToken(
      refreshToken
    );

    res.cookie("accessToken", accessToken, { httpOnly: true });

    res.status(201).json({ data: user });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { userId } = req.userData;
    await authService.setNullRefreshToken(userId);

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    const { email } = req.userData;
    await authService.authenticateUser({ ...req.body, email });

    res.status(200).json({ message: "authenticated user successfully" });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  sendOtp,
  verifyOtp,
  register,
  login,
  loginWithGoogle,
  refreshToken,
  logout,
  authenticateUser,
};

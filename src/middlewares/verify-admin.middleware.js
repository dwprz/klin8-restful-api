const verifyAdminMiddleware = (req, res, next) => {
  const { role } = req.userData;
  role === "ADMIN" ? next() : res.status(403).json({ error: "access denied" });
};

export default verifyAdminMiddleware;

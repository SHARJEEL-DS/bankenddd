import jwt from "jsonwebtoken";
import User from "../models/User.js"; // or Host if you're using hosts

// Middleware: Verify JWT token
export const authenticate = async (req, res, next) => {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Authorization token missing" });
  }

  try {
    const token = authToken.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.userId = decoded.id;
    req.role = decoded.role;

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token is expired" });
    }
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Middleware: Restrict to specific roles
export const restrict = (roles = []) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId); // replace User with Host if needed

    if (!user || !user.role || !roles.includes(user.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    next();
  } catch (err) {
    console.error("Restrict Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

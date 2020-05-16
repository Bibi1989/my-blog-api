import { NextFunction } from "express";
import jwt from "jsonwebtoken";

const authenticate = (req: any, res: any, next: NextFunction) => {
  const token = req.headers["auth"];
  if (!token) {
    throw Error("unauthorize user, access denied");
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export default authenticate;

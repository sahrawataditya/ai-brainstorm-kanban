import jwt from "jsonwebtoken";
import { getCookie } from "cookies-next";

export function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateRequest(req) {
  const token = await getCookie("auth-token", { req });
  console.log(token);
  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  return decoded ? decoded.userId : null;
}

import jwt from "jsonwebtoken";

const signToken = (id: number) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "", {
    expiresIn: process.env.JWT_EXPIRES_IN as any,
  });
};

export { signToken };

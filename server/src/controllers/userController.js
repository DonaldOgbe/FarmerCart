import prisma from "../configs/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  BCRYPT_SALT_ROUNDS,
  JWT_SECRET,
  JWT_EXPIRES_IN,
  NODE_ENV,
} from "../env.js";

// Register User (Buyer or Farmer)
export const register = async (req, res) => {
  try {
    const { name, email, password, role, farmName, state, lga, phone } =
      req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing required details" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    const userRole =
      role && ["BUYER", "FARMER", "ADMIN"].includes(role.toUpperCase())
        ? role.toUpperCase()
        : "BUYER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: userRole,
        farmName: userRole === "FARMER" ? farmName : null,
        state: userRole === "FARMER" ? state : null,
        lga: userRole === "FARMER" ? lga : null,
        phone: userRole === "FARMER" ? phone : null,
        cart: {
          create: {},
        },
      },
      include: {
        cart: true,
      },
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        farmName: user.farmName,
        cartId: user.cart?.id,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({
        success: false,
        message: "Email and Password are required",
      });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { cart: true },
    });

    if (!user) {
      return res.json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie("userToken", token, {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        farmName: user.farmName,
        cartId: user.cart?.id,
      },
    });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Check Auth Status & Get Profile
export const isAuth = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        farmName: true,
        state: true,
        lga: true,
        phone: true,
        cart: {
          include: {
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Logout User
export const logout = async (req, res) => {
  try {
    res.clearCookie("userToken", {
      httpOnly: true,
      secure: NODE_ENV === "production",
      sameSite: NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });
    return res.json({ success: true, message: "Logged Out!" });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};

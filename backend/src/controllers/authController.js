import jwt from "jsonwebtoken";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

// @desc Signup
export const signup = async (req, res) => {
    try {
        const { email, password } = req.body;
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const user = new User({ email, password });
        await user.save();
        const accessToken = generateToken(user);
        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );
        await RefreshToken.create({ token: refreshToken, userId: user._id });

        res.status(201).json({
            msg: "User registered successfully",
            accessToken,
            refreshToken,
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// @desc Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: "Invalid credentials" });
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });
        const accessToken = generateToken(user);
        const refreshToken = jwt.sign(
            { id: user._id, email: user.email },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: "7d" }
        );

        // Save refresh token in DB
        await RefreshToken.create({ token: refreshToken, userId: user._id });

        res.json({
            msg: "Login successful",
            accessToken,
            refreshToken,
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        res.status(500).json({ msg: err.message });
    }
};

// @desc Refresh Access Token
export const refresh = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(401).json({ msg: "No token provided" });

    // Check if refresh token exists in DB
    const stored = await RefreshToken.findOne({ token });
    if (!stored) return res.status(403).json({ msg: "Invalid refresh token" });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ msg: "Token expired" });

        const accessToken = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({ accessToken });
    });
};

// @desc Logout
export const logout = async (req, res) => {
    const { token } = req.body;
    await RefreshToken.deleteOne({ token });
    res.json({ msg: "Logged out" });
};

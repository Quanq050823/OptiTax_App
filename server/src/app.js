const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/mongodb");
const errorHandler = require("./middlewares/errorHandler");

dotenv.config();

connectDB();

const app = express();

app.use(helmet());

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	message: {
		success: false,
		message: "Too many requests from this IP, please try again later.",
	},
});

app.use("/api/", limiter);

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 5,
	message: {
		success: false,
		message: "Too many authentication attempts, please try again later.",
	},
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);

app.use(
	cors({
		origin: process.env.CORS_ORIGIN || "http://localhost:3000",
		credentials: true,
	})
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));

app.get("/api/health", (req, res) => {
	res.status(200).json({
		success: true,
		message: "Server is running",
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
	});
});

app.all("*", (req, res) => {
	res.status(404).json({
		success: false,
		message: `Route ${req.originalUrl} not found`,
	});
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
	console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
	console.log(`Error: ${err.message}`);
	server.close(() => {
		process.exit(1);
	});
});

process.on("uncaughtException", (err) => {
	console.log(`Error: ${err.message}`);
	console.log("Shutting down the server due to Uncaught Exception");
	process.exit(1);
});

module.exports = app;

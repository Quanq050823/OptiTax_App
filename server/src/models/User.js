const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: [true, "Username is required"],
			unique: true,
			trim: true,
			minlength: [3, "Username must be at least 3 characters long"],
			maxlength: [30, "Username cannot exceed 30 characters"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
			match: [
				/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
				"Please enter a valid email",
			],
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minlength: [6, "Password must be at least 6 characters long"],
			select: false,
		},
		firstName: {
			type: String,
			required: [true, "First name is required"],
			trim: true,
			maxlength: [50, "First name cannot exceed 50 characters"],
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			trim: true,
			maxlength: [50, "Last name cannot exceed 50 characters"],
		},
		phone: {
			type: String,
			trim: true,
			match: [/^[0-9]{10,11}$/, "Please enter a valid phone number"],
		},
		role: {
			type: String,
			enum: ["user", "admin"],
			default: "user",
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		lastLogin: {
			type: Date,
		},
		refreshTokens: [
			{
				token: String,
				createdAt: {
					type: Date,
					default: Date.now,
					expires: 604800, // 7 days in seconds
				},
				deviceInfo: String,
				ipAddress: String,
			},
		],
		resetPasswordToken: String,
		resetPasswordExpire: Date,
	},
	{
		timestamps: true,
	}
);

userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();

	this.password = await bcrypt.hash(this.password, 12);
	next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
	return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.virtual("fullName").get(function () {
	return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", {
	virtuals: true,
	transform: function (doc, ret) {
		delete ret.password;
		delete ret.__v;
		return ret;
	},
});

module.exports = mongoose.model("User", userSchema);

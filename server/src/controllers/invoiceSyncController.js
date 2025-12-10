import {
	getCaptchaImage as getCaptchaService,
	loginWithCaptcha,
} from "../services/invoiceSyncService.js";

export const getCaptchaImage = async (req, res) => {
	try {
		const { username, password } = req.body;

		if (!username || !password) {
			return res.status(400).json({
				success: false,
				message: "Username và password là bắt buộc",
			});
		}

		const sessionId = `sync_${Date.now()}_${Math.random()
			.toString(36)
			.substr(2, 9)}`;

		const result = await getCaptchaService(sessionId, username, password);

		if (result.success) {
			return res.status(200).json({
				success: true,
				sessionId,
				captchaImage: result.captchaImage,
				message: "Đã lấy captcha thành công",
			});
		} else {
			return res.status(500).json({
				success: false,
				message: "Không thể lấy captcha",
				error: result.error,
			});
		}
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Lỗi server",
			error: error.message,
		});
	}
};

export const loginWithCredentials = async (req, res) => {
	try {
		const { sessionId, captcha, startDate, invoiceType = "input" } = req.body;

		if (!sessionId || !captcha) {
			return res.status(400).json({
				success: false,
				message: "SessionId và captcha là bắt buộc",
			});
		}

		// Validate invoiceType
		if (invoiceType && !["input", "output"].includes(invoiceType)) {
			return res.status(400).json({
				success: false,
				message: "invoiceType phải là 'input' hoặc 'output'",
			});
		}

		const result = await loginWithCaptcha(
			sessionId,
			captcha,
			startDate,
			invoiceType
		);

		return res.status(200).json(result);
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Lỗi server",
			error: error.message,
		});
	}
};

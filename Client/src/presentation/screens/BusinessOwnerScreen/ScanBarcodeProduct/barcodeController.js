import axios from "axios";
import { StatusCodes } from "http-status-codes";
import config from "../config/environment.js";

/**
 * Search product information via SerpApi Google Shopping by barcode.
 * GET /api/barcode/search/:barcode
 */
export const searchBarcodeViaSerpApi = async (req, res, next) => {
	try {
		const { barcode } = req.params;

		if (!barcode || !/^[0-9a-zA-Z\-]+$/.test(barcode)) {
			return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid barcode" });
		}

		if (!config.serpApiKey) {
			return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ message: "SerpApi not configured" });
		}

		// Run iCheck (Google Search) and Google Shopping in parallel
		// Both use quoted barcode to force exact match
		const [iCheckRes, shoppingRes] = await Promise.allSettled([
			axios.get("https://serpapi.com/search.json", {
				params: {
					engine: "google",
					q: `site:icheck.com.vn "${barcode}"`,
					api_key: config.serpApiKey,
					num: 3,
					hl: "vi",
					gl: "vn",
				},
				timeout: 10000,
			}),
			axios.get("https://serpapi.com/search.json", {
				params: {
					engine: "google_shopping",
					q: `"${barcode}"`,   // quoted → exact barcode match only
					api_key: config.serpApiKey,
					num: 5,
					hl: "vi",
					gl: "vn",
				},
				timeout: 10000,
			}),
		]);

		// --- Parse iCheck results ---
		const iCheckOrganic = iCheckRes.status === "fulfilled"
			? (iCheckRes.value.data?.organic_results ?? [])
			: [];
		console.log(`[iCheck] barcode="${barcode}" → ${iCheckOrganic.length} organic_results`);
		if (iCheckOrganic.length) {
			console.log("[iCheck] raw results:", JSON.stringify(iCheckOrganic, null, 2));
		}

		const iCheckProducts = iCheckOrganic.map((item) => {
			// Strip trailing "- iCheck" or "| iCheck" from title
			const name = (item.title ?? "").replace(/\s*[-|]\s*iCheck.*$/i, "").trim();
			// Try to parse price from snippet (e.g. "7.000đ" or "15,000 đồng")
			const priceMatch = (item.snippet ?? "").match(/([\d.,]+)\s*[đ₫đồng]/);
			const price = priceMatch
				? parseFloat(priceMatch[1].replace(/[.,]/g, "")) || 0
				: 0;
			return {
				name,
				price,
				imageUrl: item.thumbnail ?? null,
				source: "icheck",
				link: item.link ?? null,
				rating: null,
				brand: "iCheck",
			};
		});

		// --- Parse Google Shopping results ---
		const shoppingResults = shoppingRes.status === "fulfilled"
			? (shoppingRes.value.data?.shopping_results ?? [])
			: [];
		console.log(`[GoogleShopping] barcode="${barcode}" → ${shoppingResults.length} shopping_results`);
		if (shoppingResults.length) {
			console.log("[GoogleShopping] raw results:", JSON.stringify(shoppingResults.slice(0, 5), null, 2));
		}

		const shoppingProducts = shoppingResults.slice(0, 5).map((item) => ({
			name: item.title ?? "",
			price: parseFloat(String(item.extracted_price ?? "0").replace(/[^0-9.]/g, "")) || 0,
			imageUrl: item.thumbnail ?? null,
			source: "google_shopping",
			link: item.link ?? null,
			rating: item.rating ?? null,
			brand: item.source ?? null,
		}));

		// Merge: iCheck first (most trusted for VN products), then Google Shopping
		const products = [...iCheckProducts, ...shoppingProducts];

		if (products.length === 0) {
			return res.status(StatusCodes.NOT_FOUND).json({ message: "No product found for this barcode" });
		}

		return res.status(StatusCodes.OK).json({ data: products });
	} catch (error) {
		// SerpApi quota/auth errors
		if (error.response?.status === 401) {
			return res.status(StatusCodes.UNAUTHORIZED).json({ message: "SerpApi key invalid or expired" });
		}
		if (error.response?.status === 429) {
			return res.status(StatusCodes.TOO_MANY_REQUESTS).json({ message: "SerpApi rate limit exceeded" });
		}
		next(error);
	}
};

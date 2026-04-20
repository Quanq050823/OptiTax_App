import { ColorMain } from "@/src/presentation/components/colors";
import {
	adjustEasyInvoiceFromSource,
	EasyInvoiceItem,
	EasyInvoiceRelatedInvoice,
} from "@/src/services/API/invoiceService";
import { getProductsInventory } from "@/src/services/API/storageService";
import { RootStackParamList } from "@/src/types/route";
import { ProductInventory } from "@/src/types/storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import { RouteProp, useRoute } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import {
	ActivityIndicator,
	Alert,
	FlatList,
	Modal,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useNavigation } from "expo-router";
import { StackNavigationProp } from "@react-navigation/stack";

type NavProp = StackNavigationProp<RootStackParamList>;

type AdjustProductForm = {
	storageItemId?: string;
	name: string;
	unit: string;
	quantity: string;
	price: string;
	vatRate: string;
};

type DropdownOption = {
	label: string;
	value: string;
};

type StorageItemOption = {
	label: string;
	value: string;
	unit: string;
	defaultQuantity: string;
	price: string;
};

const DEFAULT_PRODUCT: AdjustProductForm = {
	storageItemId: undefined,
	name: "",
	unit: "Cai",
	quantity: "1",
	price: "0",
	vatRate: "0",
};

const PAYMENT_METHOD_OPTIONS: DropdownOption[] = [
	{ label: "Tiền mặt (TM)", value: "TM" },
	{ label: "Chuyển khoản (CK)", value: "CK" },
	{ label: "Khác", value: "KHAC" },
];

const formatCurrency = (value: number) =>
	new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
		value,
	);

const parseNumericInput = (value: unknown) => {
	if (typeof value === "number") return Number.isFinite(value) ? value : 0;
	if (typeof value === "string") {
		const normalized = value.replace(/,/g, "").trim();
		if (!normalized) return 0;
		const parsed = Number(normalized);
		return Number.isFinite(parsed) ? parsed : 0;
	}
	return 0;
};

const toProductForm = (item: any): AdjustProductForm | null => {
	if (!item || typeof item !== "object") return null;

	const name = (item.name ?? item.ten ?? item.ProdName ?? "").toString().trim();
	if (!name) return null;

	const unit = (
		item.unit ?? item.dvtinh ?? item.ProdUnit ?? DEFAULT_PRODUCT.unit
	)
		.toString()
		.trim();
	const quantity = parseNumericInput(
		item.quantity ?? item.sluong ?? item.ProdQuantity,
	);
	const price = parseNumericInput(item.price ?? item.dgia ?? item.ProdPrice);
	const vatRate = parseNumericInput(item.vatRate ?? item.vat ?? item.VATRate);

	return {
		storageItemId: undefined,
		name,
		unit: unit || DEFAULT_PRODUCT.unit,
		quantity: String(quantity || 1),
		price: String(price || 0),
		vatRate: String(vatRate || 0),
	};
};

const extractArrayFromUnknown = (input: unknown): any[] => {
	if (!input) return [];
	if (Array.isArray(input)) return input;

	if (typeof input === "string") {
		try {
			return extractArrayFromUnknown(JSON.parse(input));
		} catch {
			return [];
		}
	}

	if (typeof input !== "object") return [];
	const obj = input as Record<string, unknown>;
	const candidateKeys = [
		"hdhhdvu",
		"products",
		"Products",
		"items",
		"Items",
		"details",
		"Details",
		"lineItems",
		"LineItems",
	];

	for (const key of candidateKeys) {
		const value = obj[key];
		if (Array.isArray(value)) return value;
	}

	return [];
};

const getInitialAdjustProducts = (invoice: EasyInvoiceItem): AdjustProductForm[] => {
	const rawSources: unknown[] = [
		(invoice as any)?.hdhhdvu,
		(invoice as any)?.products,
		(invoice as any)?.Products,
		(invoice as any)?.Items,
		(invoice as any)?.Details,
		(invoice as any)?.Extra,
	];

	for (const source of rawSources) {
		const productArray = extractArrayFromUnknown(source)
			.map(toProductForm)
			.filter((item): item is AdjustProductForm => Boolean(item));

		if (productArray.length > 0) {
			return productArray;
		}
	}

	return [DEFAULT_PRODUCT];
};

export default function EasyInvoiceAdjustScreen() {
	const route =
		useRoute<RouteProp<RootStackParamList, "EasyInvoiceAdjustScreen">>();
	const navigate = useNavigation<NavProp>();
	const { invoice } = route.params;

	const initialProducts = useMemo(() => getInitialAdjustProducts(invoice), [invoice]);
	const initialAdjustForm = useMemo(
		() => ({
			customerName: invoice.CustomerName || "",
			customerAddress: invoice.CustomerAddress || "",
			customerTaxCode: invoice.CustomerTaxCode || "",
			paymentMethod: "TM",
		}),
		[invoice],
	);
	const initialRelatedInvoiceForm = useMemo(
		() => ({
			No: invoice.No || "",
			Pattern: invoice.Pattern || "",
			Serial: invoice.Serial || "",
			ArisingDate: invoice.ArisingDate || "",
			IssueDate: invoice.IssueDate || "",
			CustomerName: invoice.CustomerName || "",
			CustomerTaxCode: invoice.CustomerTaxCode || "",
			Total: String(invoice.Total || ""),
			TaxAmount: String(invoice.TaxAmount || ""),
			Amount: String(invoice.Amount || ""),
			TaxAuthorityCode: invoice.TaxAuthorityCode || "",
			LookupCode: invoice.LookupCode || "",
		}),
		[invoice],
	);

	const [adjusting, setAdjusting] = useState(false);
	const [loadingStorageItems, setLoadingStorageItems] = useState(false);
	const [storageItemOptions, setStorageItemOptions] = useState<
		StorageItemOption[]
	>([]);
	const [adjustForm, setAdjustForm] = useState(initialAdjustForm);
	const [products, setProducts] = useState<AdjustProductForm[]>(initialProducts);
	const [useRelatedInvoice, setUseRelatedInvoice] = useState(false);
	const [showSelectModal, setShowSelectModal] = useState(false);
	const [selectType, setSelectType] = useState<"payment" | "product">(
		"payment",
	);
	const [selectProductIndex, setSelectProductIndex] = useState<number | null>(null);
	const [productSearch, setProductSearch] = useState("");
	const [relatedInvoiceForm, setRelatedInvoiceForm] = useState(
		initialRelatedInvoiceForm,
	);

	const updateRelatedInvoiceField = (key: string, value: string) => {
		setRelatedInvoiceForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const updateAdjustFormField = (key: string, value: string) => {
		setAdjustForm((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	const updateProductField = (
		index: number,
		field: keyof AdjustProductForm,
		value: string,
	) => {
		setProducts((prev) =>
			prev.map((item, idx) =>
				idx === index
					? {
						...item,
						[field]: value,
					}
					: item,
			),
		);
	};

	const handleSelectStorageItem = (index: number, selected: StorageItemOption) => {
		setProducts((prev) =>
			prev.map((item, idx) =>
				idx === index
					? {
						...item,
						storageItemId: selected.value,
						name: selected.label,
						unit: selected.unit || item.unit || DEFAULT_PRODUCT.unit,
						quantity: selected.defaultQuantity || item.quantity || "1",
						price: selected.price || item.price || "0",
					}
					: item,
			),
		);
	};

	const addProductRow = () => {
		setProducts((prev) => [...prev, { ...DEFAULT_PRODUCT }]);
	};

	const removeProductRow = (index: number) => {
		setProducts((prev) => prev.filter((_, idx) => idx !== index));
	};

	const toOptionalNumber = (value: string) => {
		const trimmed = value.trim();
		if (!trimmed) return undefined;
		const parsed = Number(trimmed.replace(/,/g, ""));
		return Number.isFinite(parsed) ? parsed : undefined;
	};

	const buildRelatedInvoicePayload = (): EasyInvoiceRelatedInvoice | undefined => {
		if (!useRelatedInvoice) return undefined;

		const payload: EasyInvoiceRelatedInvoice = {
			No: relatedInvoiceForm.No.trim() || undefined,
			Pattern: relatedInvoiceForm.Pattern.trim() || undefined,
			Serial: relatedInvoiceForm.Serial.trim() || undefined,
			ArisingDate: relatedInvoiceForm.ArisingDate.trim() || undefined,
			IssueDate: relatedInvoiceForm.IssueDate.trim() || undefined,
			CustomerName: relatedInvoiceForm.CustomerName.trim() || undefined,
			CustomerTaxCode: relatedInvoiceForm.CustomerTaxCode.trim() || undefined,
			Total: toOptionalNumber(relatedInvoiceForm.Total),
			TaxAmount: toOptionalNumber(relatedInvoiceForm.TaxAmount),
			Amount: toOptionalNumber(relatedInvoiceForm.Amount),
			TaxAuthorityCode: relatedInvoiceForm.TaxAuthorityCode.trim() || undefined,
			LookupCode: relatedInvoiceForm.LookupCode.trim() || undefined,
		};

		const hasAnyField = Object.values(payload).some(
			(value) => value !== undefined && value !== "",
		);

		return hasAnyField ? payload : undefined;
	};

	const previewTotals = useMemo(
		() =>
			products.reduce(
				(acc, item) => {
					const quantity = parseNumericInput(item.quantity);
					const price = parseNumericInput(item.price);
					const vatRate = parseNumericInput(item.vatRate);
					if (quantity <= 0 || price < 0) return acc;

					const lineTotal = quantity * price;
					const lineVat = (lineTotal * vatRate) / 100;
					return {
						subtotal: acc.subtotal + lineTotal,
						vatAmount: acc.vatAmount + lineVat,
						total: acc.total + lineTotal + lineVat,
					};
				},
				{ subtotal: 0, vatAmount: 0, total: 0 },
			),
		[products],
	);

	const paymentMethodLabel = useMemo(() => {
		return (
			PAYMENT_METHOD_OPTIONS.find(
				(item) => item.value === adjustForm.paymentMethod,
			)?.label ?? "Chọn phương thức thanh toán"
		);
	}, [adjustForm.paymentMethod]);

	const filteredStorageItemOptions = useMemo(() => {
		const keyword = productSearch.trim().toLowerCase();
		if (!keyword) return storageItemOptions;
		return storageItemOptions.filter((item) =>
			item.label.toLowerCase().includes(keyword),
		);
	}, [productSearch, storageItemOptions]);

	const openPaymentSelectModal = () => {
		setSelectType("payment");
		setSelectProductIndex(null);
		setProductSearch("");
		setShowSelectModal(true);
	};

	const openProductSelectModal = (index: number) => {
		setSelectType("product");
		setSelectProductIndex(index);
		setProductSearch("");
		setShowSelectModal(true);
	};

	const closeSelectModal = () => {
		setShowSelectModal(false);
		setProductSearch("");
	};

	const onSelectOption = (option: DropdownOption | StorageItemOption) => {
		if (selectType === "payment") {
			updateAdjustFormField("paymentMethod", option.value);
			closeSelectModal();
			return;
		}

		if (selectProductIndex === null) {
			closeSelectModal();
			return;
		}

		handleSelectStorageItem(selectProductIndex, option as StorageItemOption);
		closeSelectModal();
	};

	useEffect(() => {
		const loadStorageItems = async () => {
			setLoadingStorageItems(true);
			try {
				const response = await getProductsInventory();
				const options = (response?.data ?? []).map((item: ProductInventory) => ({
					label: item.name,
					value: item._id,
					unit: item.unit || DEFAULT_PRODUCT.unit,
					defaultQuantity: String(
						item.conversionUnit?.from?.itemQuantity &&
						item.conversionUnit.from.itemQuantity > 0
							? item.conversionUnit.from.itemQuantity
							: 1,
					),
					price: String(item.price ?? 0),
				}));
				setStorageItemOptions(options);
			} catch {
				setStorageItemOptions([]);
			}
			setLoadingStorageItems(false);
		};

		loadStorageItems();
	}, []);

	const handleAdjustInvoice = async () => {
		if (!adjustForm.customerName.trim()) {
			Alert.alert("Thiếu dữ liệu", "Vui lòng nhập tên khách hàng.");
			return;
		}

		const validProducts = products
			.map((item) => {
				const quantity = Number(item.quantity || 0);
				const price = Number(item.price || 0);
				const vatRate = Number(item.vatRate || 0);
				return {
					name: item.name.trim(),
					unit: item.unit.trim() || DEFAULT_PRODUCT.unit,
					quantity,
					price,
					vatRate,
				};
			})
			.filter((item) => item.name && item.quantity > 0 && item.price >= 0);

		if (validProducts.length === 0) {
			Alert.alert(
				"Thiếu dữ liệu",
				"Vui lòng thêm ít nhất một sản phẩm hợp lệ để điều chỉnh.",
			);
			return;
		}

		if (useRelatedInvoice && !relatedInvoiceForm.No.trim()) {
			Alert.alert(
				"Thiếu thông tin",
				"Khi dùng RelatedInvoice, vui lòng nhập ít nhất số hóa đơn gốc.",
			);
			return;
		}

		setAdjusting(true);
		try {
			await adjustEasyInvoiceFromSource({
				invoiceData: {
					customerName: adjustForm.customerName.trim(),
					customerAddress: adjustForm.customerAddress.trim(),
					customerTaxCode: adjustForm.customerTaxCode.trim(),
					paymentMethod: adjustForm.paymentMethod.trim() || "TM",
					products: validProducts,
				},
				invoice: useRelatedInvoice ? undefined : invoice,
				relatedInvoice: buildRelatedInvoicePayload(),
			});

			Alert.alert("Thành công", "Đã gửi yêu cầu điều chỉnh hóa đơn.", [
				{
					text: "OK",
					onPress: () => navigate.goBack(),
				},
			]);
		} catch (err: any) {
			const message =
				err?.message || err?.error || "Không thể điều chỉnh hóa đơn.";
			Alert.alert("Lỗi", message);
		} finally {
			setAdjusting(false);
		}
	};

	return (
		<ScrollView
			style={styles.container}
			contentContainerStyle={styles.content}
			showsVerticalScrollIndicator={false}
		>
			<View style={styles.headerCard}>
				<View style={styles.headerBadge}>
					<Text style={styles.headerBadgeText}>EasyInvoice</Text>
				</View>
				<Text style={styles.title}>Điều chỉnh hóa đơn</Text>
				<Text style={styles.subtitle}>
					Cập nhật lại thông tin khách hàng, hàng hóa và dữ liệu tham chiếu trước khi gửi yêu cầu điều chỉnh.
				</Text>
				<View style={styles.metaRow}>
					<View style={styles.metaChip}>
						<Text style={styles.metaChipText}>Số HĐ: {invoice.No || "-"}</Text>
					</View>
					<View style={styles.metaChip}>
						<Text style={styles.metaChipText}>Mã: {invoice.Ikey}</Text>
					</View>
				</View>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Thông tin điều chỉnh</Text>
				<Text style={styles.sectionDescription}>
					Điền lại thông tin đầu ra của hóa đơn sau điều chỉnh. Các trường có dấu sao là bắt buộc.
				</Text>

				<Text style={styles.inputLabel}>Tên khách hàng *</Text>
				<TextInput
					style={styles.input}
					value={adjustForm.customerName}
					onChangeText={(v) => updateAdjustFormField("customerName", v)}
					placeholder="Nhập tên khách hàng"
					placeholderTextColor="#9CA3AF"
				/>

				<Text style={styles.inputLabel}>Địa chỉ khách hàng</Text>
				<TextInput
					style={styles.input}
					value={adjustForm.customerAddress}
					onChangeText={(v) => updateAdjustFormField("customerAddress", v)}
					placeholder="Nhập địa chỉ"
					placeholderTextColor="#9CA3AF"
				/>

				<Text style={styles.inputLabel}>Mã số thuế khách hàng</Text>
				<TextInput
					style={styles.input}
					value={adjustForm.customerTaxCode}
					onChangeText={(v) => updateAdjustFormField("customerTaxCode", v)}
					placeholder="Nhập mã số thuế"
					placeholderTextColor="#9CA3AF"
				/>

				<Text style={styles.inputLabel}>Phương thức thanh toán</Text>
				<TouchableOpacity
					style={styles.selectorInput}
					onPress={openPaymentSelectModal}
					activeOpacity={0.9}
				>
					<Text style={styles.selectorText}>{paymentMethodLabel}</Text>
					<AntDesign name="down" size={14} color="#6B7280" />
				</TouchableOpacity>
			</View>

			<View style={styles.section}>
				<Text style={styles.sectionTitle}>Danh sách sản phẩm điều chỉnh *</Text>
				<Text style={styles.sectionDescription}>
					Chọn từ kho hàng hoặc nhập thủ công. Hệ thống sẽ tự tính lại tổng tiền và VAT theo từng dòng.
				</Text>
				<View style={styles.productListWrap}>
					{loadingStorageItems && (
						<Text style={styles.loadingHint}>Đang tải danh sách hàng hóa...</Text>
					)}
					{products.map((item, index) => (
						<View key={index} style={styles.productRowCard}>
							<View style={styles.productRowHeader}>
								<Text style={styles.productRowTitle}>Sản phẩm {index + 1}</Text>
								{products.length > 1 && (
									<TouchableOpacity onPress={() => removeProductRow(index)}>
										<AntDesign name="delete" size={16} color="#EF4444" />
									</TouchableOpacity>
								)}
							</View>
							<TouchableOpacity
								style={styles.selectorInput}
								onPress={() => openProductSelectModal(index)}
								activeOpacity={0.9}
							>
								<Text
									style={[
										styles.selectorText,
										!item.name ? styles.selectorPlaceholder : null,
									]}
								>
									{item.name || "Chọn tên hàng hóa, dịch vụ"}
								</Text>
								<AntDesign name="down" size={14} color="#6B7280" />
							</TouchableOpacity>
							{!item.storageItemId ? (
								<TextInput
									style={[styles.input, styles.manualNameInput]}
									value={item.name}
									onChangeText={(v) => updateProductField(index, "name", v)}
									placeholder="Hoặc nhập tên thủ công"
									placeholderTextColor="#9CA3AF"
								/>
							) : null}
							<View style={styles.productGrid2}>
								<TextInput
									style={[styles.input, styles.productGridInput]}
									value={item.unit}
									onChangeText={(v) => updateProductField(index, "unit", v)}
									placeholder="Don vi"
									placeholderTextColor="#9CA3AF"
								/>
								<TextInput
									style={[styles.input, styles.productGridInput]}
									keyboardType="decimal-pad"
									value={item.quantity}
									onChangeText={(v) => updateProductField(index, "quantity", v)}
									placeholder="Số lượng"
									placeholderTextColor="#9CA3AF"
								/>
							</View>
							<View style={styles.productGrid2}>
								<TextInput
									style={[styles.input, styles.productGridInput]}
									keyboardType="decimal-pad"
									value={item.price}
									onChangeText={(v) => updateProductField(index, "price", v)}
									placeholder="Đơn giá"
									placeholderTextColor="#9CA3AF"
								/>
								<TextInput
									style={[styles.input, styles.productGridInput]}
									keyboardType="decimal-pad"
									value={item.vatRate}
									onChangeText={(v) => updateProductField(index, "vatRate", v)}
									placeholder="VAT %"
									placeholderTextColor="#9CA3AF"
								/>
							</View>
						</View>
					))}
					<TouchableOpacity
						style={styles.addProductBtn}
						onPress={addProductRow}
						activeOpacity={0.9}
					>
						<AntDesign name="plus-circle" size={15} color={ColorMain} />
						<Text style={styles.addProductText}>Thêm sản phẩm</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.previewCard}>
					<Text style={styles.previewTitle}>Tạm tính sau điều chỉnh</Text>
					<View style={styles.previewRow}>
						<Text style={styles.previewLabel}>Tiền hàng chưa thuế</Text>
						<Text style={styles.previewValue}>
							{formatCurrency(previewTotals.subtotal)}
						</Text>
					</View>
					<View style={styles.previewRow}>
						<Text style={styles.previewLabel}>Thuế VAT</Text>
						<Text style={styles.previewValue}>
							{formatCurrency(previewTotals.vatAmount)}
						</Text>
					</View>
					<View style={[styles.previewRow, styles.previewTotalRow]}>
						<Text style={styles.previewTotalLabel}>Tổng thanh toán</Text>
						<Text style={styles.previewTotalValue}>
							{formatCurrency(previewTotals.total)}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.section}>
				<TouchableOpacity
					style={styles.relatedToggle}
					onPress={() => setUseRelatedInvoice((prev) => !prev)}
					activeOpacity={0.9}
				>
					<Feather
						name={useRelatedInvoice ? "check-square" : "square"}
						size={18}
						color={useRelatedInvoice ? ColorMain : "#6B7280"}
					/>
					<Text style={styles.relatedToggleText}>Dùng RelatedInvoice thay cho Ikey</Text>
				</TouchableOpacity>

				{useRelatedInvoice && (
					<View style={styles.relatedFormContent}>
						<Text style={styles.sectionDescription}>
							Nhập thông tin hóa đơn gốc nếu bạn muốn gửi điều chỉnh theo RelatedInvoice thay vì dùng trực tiếp Ikey.
						</Text>

						<Text style={styles.inputLabel}>Số hóa đơn gốc *</Text>
						<TextInput
							style={styles.input}
							value={relatedInvoiceForm.No}
							onChangeText={(v) => updateRelatedInvoiceField("No", v)}
							placeholder="VD: 00000123"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Ký hiệu hóa đơn</Text>
						<TextInput
							style={styles.input}
							value={relatedInvoiceForm.Pattern}
							onChangeText={(v) => updateRelatedInvoiceField("Pattern", v)}
							placeholder="VD: 1C26TAA"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Mẫu số</Text>
						<TextInput
							style={styles.input}
							value={relatedInvoiceForm.Serial}
							onChangeText={(v) => updateRelatedInvoiceField("Serial", v)}
							placeholder="VD: AB/26E"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Ngày lập (DD/MM/YYYY)</Text>
						<TextInput
							style={styles.input}
							value={relatedInvoiceForm.ArisingDate}
							onChangeText={(v) => updateRelatedInvoiceField("ArisingDate", v)}
							placeholder="VD: 19/04/2026"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Tên khách hàng</Text>
						<TextInput
							style={styles.input}
							value={relatedInvoiceForm.CustomerName}
							onChangeText={(v) => updateRelatedInvoiceField("CustomerName", v)}
							placeholder="Nhap ten khach hang"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Mã số thuế khách hàng</Text>
						<TextInput
							style={styles.input}
							value={relatedInvoiceForm.CustomerTaxCode}
							onChangeText={(v) =>
								updateRelatedInvoiceField("CustomerTaxCode", v)
							}
							placeholder="Nhập mã số thuế"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Tiền hàng chưa thuế</Text>
						<TextInput
							style={styles.input}
							keyboardType="decimal-pad"
							value={relatedInvoiceForm.Total}
							onChangeText={(v) => updateRelatedInvoiceField("Total", v)}
							placeholder="VD: 1000000"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Tiền thuế</Text>
						<TextInput
							style={styles.input}
							keyboardType="decimal-pad"
							value={relatedInvoiceForm.TaxAmount}
							onChangeText={(v) => updateRelatedInvoiceField("TaxAmount", v)}
							placeholder="VD: 100000"
							placeholderTextColor="#9CA3AF"
						/>

						<Text style={styles.inputLabel}>Tổng thanh toán</Text>
						<TextInput
							style={styles.input}
							keyboardType="decimal-pad"
							value={relatedInvoiceForm.Amount}
							onChangeText={(v) => updateRelatedInvoiceField("Amount", v)}
							placeholder="VD: 1100000"
							placeholderTextColor="#9CA3AF"
						/>
					</View>
				)}
			</View>

			<Modal
				visible={showSelectModal}
				transparent
				animationType="fade"
				onRequestClose={closeSelectModal}
			>
				<TouchableOpacity
					style={styles.selectModalBackdrop}
					activeOpacity={1}
					onPress={closeSelectModal}
				>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.selectModalCard}
						onPress={() => {}}
					>
						<View style={styles.selectModalHeader}>
							<Text style={styles.selectModalTitle}>
								{selectType === "payment"
									? "Chọn phương thức thanh toán"
									: "Chọn tên hàng hóa, dịch vụ"}
							</Text>
							<TouchableOpacity onPress={closeSelectModal}>
								<AntDesign name="close" size={18} color="#111827" />
							</TouchableOpacity>
						</View>

						{selectType === "product" && (
							<TextInput
								style={styles.selectSearchInput}
								value={productSearch}
								onChangeText={setProductSearch}
								placeholder="Tìm tên hàng hóa..."
								placeholderTextColor="#9CA3AF"
							/>
						)}

						<FlatList
							data={
								selectType === "payment"
									? PAYMENT_METHOD_OPTIONS
									: filteredStorageItemOptions
							}
							keyExtractor={(item) => item.value}
							renderItem={({ item }) => (
								<TouchableOpacity
									style={styles.selectOptionRow}
									onPress={() => onSelectOption(item)}
								>
									<Text style={styles.selectOptionText}>{item.label}</Text>
								</TouchableOpacity>
							)}
							ListEmptyComponent={
								<Text style={styles.selectEmptyText}>Không có dữ liệu</Text>
							}
						/>
					</TouchableOpacity>
				</TouchableOpacity>
			</Modal>

			<View style={styles.actions}>
				<TouchableOpacity
					style={styles.secondaryBtn}
					onPress={() => navigate.goBack()}
					disabled={adjusting}
					activeOpacity={0.9}
				>
					<Text style={styles.secondaryBtnText}>Quay lại</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.primaryBtn}
					onPress={handleAdjustInvoice}
					disabled={adjusting}
					activeOpacity={0.9}
				>
					{adjusting ? (
						<ActivityIndicator color="#fff" />
					) : (
						<Text style={styles.primaryBtnText}>Gửi điều chỉnh</Text>
					)}
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: { flex: 1, backgroundColor: "#F4F7FB" },
	content: { padding: 16, gap: 14, paddingBottom: 32 },
	headerCard: {
		backgroundColor: "#fff",
		borderRadius: 20,
		padding: 18,
		borderWidth: 1,
		borderColor: "rgba(15, 23, 42, 0.06)",
		...Platform.select({
			ios: {
				shadowColor: "#0F172A",
				shadowOpacity: 0.08,
				shadowRadius: 18,
				shadowOffset: { width: 0, height: 8 },
			},
			android: {
				elevation: 3,
			},
		}),
	},
	headerBadge: {
		alignSelf: "flex-start",
		paddingHorizontal: 10,
		paddingVertical: 6,
		borderRadius: 999,
		backgroundColor: "#ECFEFF",
		borderWidth: 1,
		borderColor: "#CFFAFE",
		marginBottom: 10,
	},
	headerBadgeText: {
		fontSize: 12,
		fontWeight: "700",
		color: "#0F766E",
	},
	title: { fontSize: 24, fontWeight: "800", color: "#111827" },
	subtitle: { marginTop: 8, fontSize: 14, lineHeight: 21, color: "#64748B" },
	metaRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 14,
	},
	metaChip: {
		paddingHorizontal: 10,
		paddingVertical: 7,
		borderRadius: 999,
		backgroundColor: "#F8FAFC",
		borderWidth: 1,
		borderColor: "#E2E8F0",
	},
	metaChipText: {
		fontSize: 12,
		fontWeight: "600",
		color: "#334155",
	},
	section: {
		backgroundColor: "#fff",
		borderRadius: 18,
		padding: 16,
		borderWidth: 1,
		borderColor: "#EEF2F7",
		...Platform.select({
			ios: {
				shadowColor: "#0F172A",
				shadowOpacity: 0.04,
				shadowRadius: 14,
				shadowOffset: { width: 0, height: 6 },
			},
			android: {
				elevation: 2,
			},
		}),
	},
	sectionTitle: {
		fontSize: 15,
		fontWeight: "800",
		color: ColorMain,
		marginBottom: 6,
	},
	sectionDescription: {
		fontSize: 13,
		lineHeight: 20,
		color: "#64748B",
		marginBottom: 12,
	},
	inputLabel: {
		fontSize: 13,
		fontWeight: "600",
		color: "#374151",
		marginBottom: 6,
		marginTop: 10,
	},
	input: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: Platform.OS === "ios" ? 12 : 10,
		fontSize: 14,
		color: "#111827",
		backgroundColor: "#FCFDFE",
	},
	selectorInput: {
		minHeight: 48,
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 14,
		paddingHorizontal: 12,
		backgroundColor: "#FCFDFE",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	selectorText: {
		fontSize: 14,
		color: "#111827",
		flex: 1,
		paddingRight: 8,
	},
	selectorPlaceholder: {
		color: "#9CA3AF",
	},
	manualNameInput: {
		marginTop: 8,
	},
	selectModalBackdrop: {
		flex: 1,
		backgroundColor: "rgba(17, 24, 39, 0.45)",
		justifyContent: "center",
		paddingHorizontal: 20,
	},
	selectModalCard: {
		backgroundColor: "#fff",
		borderRadius: 18,
		maxHeight: "72%",
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	selectModalHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: 10,
	},
	selectModalTitle: {
		fontSize: 16,
		fontWeight: "800",
		color: "#111827",
	},
	selectSearchInput: {
		borderWidth: 1,
		borderColor: "#E5E7EB",
		borderRadius: 14,
		paddingHorizontal: 12,
		paddingVertical: 10,
		fontSize: 14,
		color: "#111827",
		marginBottom: 10,
	},
	selectOptionRow: {
		paddingVertical: 14,
		borderBottomWidth: 1,
		borderBottomColor: "#F3F4F6",
	},
	selectOptionText: {
		fontSize: 14,
		color: "#111827",
	},
	selectEmptyText: {
		textAlign: "center",
		color: "#9CA3AF",
		paddingVertical: 18,
	},
	loadingHint: {
		fontSize: 13,
		color: "#6B7280",
		marginBottom: 4,
	},
	productListWrap: { marginTop: 8, gap: 10 },
	productRowCard: {
		padding: 12,
		borderWidth: 1,
		borderColor: "#E2E8F0",
		borderRadius: 16,
		gap: 10,
		backgroundColor: "#FCFDFE",
	},
	productRowHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	productRowTitle: { fontSize: 13, fontWeight: "700", color: "#1F2937" },
	productGrid2: { flexDirection: "row", gap: 8 },
	productGridInput: { flex: 1 },
	addProductBtn: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: 6,
		paddingVertical: 12,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#BFDBFE",
		backgroundColor: "#EFF6FF",
	},
	addProductText: { fontSize: 14, fontWeight: "700", color: ColorMain },
	previewCard: {
		marginTop: 8,
		padding: 14,
		borderRadius: 16,
		borderWidth: 1,
		borderColor: "#DBEAFE",
		backgroundColor: "#F8FBFF",
		gap: 8,
	},
	previewTitle: {
		fontSize: 13,
		fontWeight: "800",
		color: "#1D4ED8",
	},
	previewRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	previewLabel: { fontSize: 13, color: "#4B5563" },
	previewValue: { fontSize: 14, fontWeight: "700", color: "#111827" },
	previewTotalRow: {
		marginTop: 2,
		paddingTop: 8,
		borderTopWidth: 1,
		borderTopColor: "#BFDBFE",
	},
	previewTotalLabel: { fontSize: 14, fontWeight: "800", color: "#1E3A8A" },
	previewTotalValue: { fontSize: 16, fontWeight: "800", color: ColorMain },
	relatedToggle: {
		flexDirection: "row",
		alignItems: "center",
		gap: 10,
		paddingVertical: 2,
	},
	relatedToggleText: { fontSize: 14, fontWeight: "600", color: "#374151" },
	relatedFormContent: { paddingBottom: 4 },
	actions: { flexDirection: "row", gap: 10, marginTop: 4, marginBottom: 6 },
	secondaryBtn: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		borderRadius: 14,
		borderWidth: 1,
		borderColor: "#D1D5DB",
		backgroundColor: "#fff",
	},
	secondaryBtnText: { fontSize: 14, fontWeight: "700", color: "#374151" },
	primaryBtn: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 14,
		borderRadius: 14,
		backgroundColor: "#0F766E",
	},
	primaryBtnText: { fontSize: 14, fontWeight: "800", color: "#fff" },
});

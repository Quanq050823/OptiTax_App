import ExcelJS from "exceljs/dist/exceljs.bare.min.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import { Buffer } from "buffer";
import { InventoryReportResponse, InventoryReportRow } from "@/src/types/storage";

global.Buffer = Buffer;

const formatDate = (date: string | Date) =>
	new Date(date).toLocaleDateString("vi-VN");

const safeFilePart = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-zA-Z0-9_-]+/g, "_")
		.replace(/^_+|_+$/g, "");

const setBorder = (cell: ExcelJS.Cell) => {
	cell.border = {
		top: { style: "thin" },
		left: { style: "thin" },
		bottom: { style: "thin" },
		right: { style: "thin" },
	};
};

const setTableCell = (cell: ExcelJS.Cell, value: string | number, bold = false) => {
	cell.value = value;
	cell.font = { name: "Times New Roman", size: 11, bold };
	cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
	setBorder(cell);
};

const setNumberCell = (cell: ExcelJS.Cell, value: number, bold = false) => {
	setTableCell(cell, value, bold);
	cell.numFmt = "#,##0";
};

const roundQuantity = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;

const setQuantityCell = (cell: ExcelJS.Cell, value: number, bold = false) => {
	setTableCell(cell, roundQuantity(value), bold);
	cell.numFmt = "#,##0.00";
};

const writeRow = (
	worksheet: ExcelJS.Worksheet,
	rowNumber: number,
	row: InventoryReportRow | InventoryReportResponse["totals"],
	options?: { index?: number; itemCode?: string; itemName?: string; unit?: string; unitPrice?: number; bold?: boolean },
) => {
	const excelRow = worksheet.getRow(rowNumber);
	excelRow.height = options?.bold ? 24 : 22;

	setTableCell(excelRow.getCell("A"), options?.itemCode ?? (options?.index ? String(options.index) : ""), options?.bold);
	setTableCell(excelRow.getCell("B"), options?.itemName ?? "TỔNG CỘNG", options?.bold);
	setTableCell(excelRow.getCell("C"), options?.unit ?? "", options?.bold);
	setQuantityCell(excelRow.getCell("D"), row.openingQuantity, options?.bold);
	setNumberCell(excelRow.getCell("E"), row.openingValue, options?.bold);
	setQuantityCell(excelRow.getCell("F"), row.inQuantity, options?.bold);
	setNumberCell(excelRow.getCell("G"), row.inValue, options?.bold);
	setQuantityCell(excelRow.getCell("H"), row.outQuantity, options?.bold);
	setNumberCell(excelRow.getCell("I"), row.outValue, options?.bold);
	setQuantityCell(excelRow.getCell("J"), row.closingQuantity, options?.bold);
	setNumberCell(excelRow.getCell("K"), row.closingValue, options?.bold);
	setNumberCell(excelRow.getCell("L"), options?.unitPrice ?? 0, options?.bold);
	excelRow.commit();
};

export const exportInventoryReportS08DNN = async (report: InventoryReportResponse) => {
	const workbook = new ExcelJS.Workbook();
	workbook.creator = "OptiTax";
	workbook.created = new Date();

	const worksheet = workbook.addWorksheet("S08-DNN");
	worksheet.pageSetup = {
		orientation: "landscape",
		fitToPage: true,
		fitToWidth: 1,
		fitToHeight: 0,
		margins: {
			left: 0.25,
			right: 0.25,
			top: 0.35,
			bottom: 0.35,
			header: 0.2,
			footer: 0.2,
		},
	};

	worksheet.columns = [
		{ key: "code", width: 12 },
		{ key: "name", width: 34 },
		{ key: "unit", width: 11 },
		{ key: "openingQty", width: 12 },
		{ key: "openingValue", width: 15 },
		{ key: "inQty", width: 12 },
		{ key: "inValue", width: 15 },
		{ key: "outQty", width: 12 },
		{ key: "outValue", width: 15 },
		{ key: "closingQty", width: 12 },
		{ key: "closingValue", width: 15 },
		{ key: "unitPrice", width: 13 },
	];

	worksheet.mergeCells("A1:F1");
	worksheet.mergeCells("G1:L1");
	worksheet.getCell("A1").value = `HỘ KINH DOANH ${report.profile.businessName ?? ""}`.trim();
	worksheet.getCell("G1").value = "Mẫu số S08-DNN";
	worksheet.getCell("A1").font = { name: "Times New Roman", size: 14, bold: true };
	worksheet.getCell("G1").font = { name: "Times New Roman", size: 13, bold: true };
	worksheet.getCell("G1").alignment = { horizontal: "center" };

	worksheet.mergeCells("A2:F2");
	worksheet.mergeCells("G2:L2");
	worksheet.getCell("A2").value = `Địa chỉ: ${report.profile.addressText ?? ""}`;
	worksheet.getCell("G2").value = "(Ban hành theo TT số 133/2016/TT-BTC";
	worksheet.getCell("G2").alignment = { horizontal: "center" };

	worksheet.mergeCells("A3:F3");
	worksheet.mergeCells("G3:L3");
	worksheet.getCell("A3").value = `Mã số thuế: ${report.profile.taxCode ?? ""}`;
	worksheet.getCell("G3").value = "ngày 26/8/2016 của Bộ Tài Chính)";
	worksheet.getCell("G3").alignment = { horizontal: "center" };

	worksheet.mergeCells("A5:L5");
	worksheet.getCell("A5").value = "BẢNG TỔNG HỢP NHẬP XUẤT TỒN KHO";
	worksheet.getCell("A5").font = { name: "Times New Roman", size: 16, bold: true };
	worksheet.getCell("A5").alignment = { horizontal: "left" };

	worksheet.mergeCells("A6:L6");
	worksheet.getCell("A6").value = `(${report.accountCodes})`;
	worksheet.getCell("A6").font = { name: "Times New Roman", size: 13, bold: true };

	worksheet.mergeCells("A7:L7");
	worksheet.getCell("A7").value = `Từ ngày ${formatDate(report.period.startDate)} đến ngày ${formatDate(report.period.endDate)}`;
	worksheet.getCell("A7").font = { name: "Times New Roman", size: 12, bold: true };

	worksheet.mergeCells("K8:L8");
	worksheet.getCell("K8").value = "ĐVT: VNĐ";
	worksheet.getCell("K8").font = { name: "Times New Roman", size: 12, bold: true };
	worksheet.getCell("K8").alignment = { horizontal: "right" };

	worksheet.mergeCells("A9:A10");
	worksheet.mergeCells("B9:B10");
	worksheet.mergeCells("C9:C10");
	worksheet.mergeCells("D9:E9");
	worksheet.mergeCells("F9:G9");
	worksheet.mergeCells("H9:I9");
	worksheet.mergeCells("J9:K9");
	worksheet.mergeCells("L9:L10");

	const headerMap: Array<[string, string]> = [
		["A9", "Mã hiệu"],
		["B9", "Tên VTHH"],
		["C9", "Đơn vị tính"],
		["D9", "Tồn đầu kỳ"],
		["F9", "Nhập trong kỳ"],
		["H9", "Xuất trong kỳ"],
		["J9", "Tồn cuối"],
		["L9", "Đơn giá"],
		["D10", "S.Lượng"],
		["E10", "G.Trị"],
		["F10", "S.Lượng"],
		["G10", "G.Trị"],
		["H10", "S.Lượng"],
		["I10", "G.Trị"],
		["J10", "S.Lượng"],
		["K10", "G.Trị"],
	];
	headerMap.forEach(([cellRef, value]) => {
		const cell = worksheet.getCell(cellRef);
		cell.value = value;
		cell.font = { name: "Times New Roman", size: 11, bold: true };
		cell.alignment = { horizontal: "center", vertical: "middle", wrapText: true };
	});

	for (let row = 9; row <= 10; row += 1) {
		worksheet.getRow(row).eachCell({ includeEmpty: true }, setBorder);
	}

	const startDataRow = 11;
	report.rows.forEach((item, index) => {
		writeRow(worksheet, startDataRow + index, item, {
			index: index + 1,
			itemCode: item.itemCode || String(index + 1),
			itemName: item.itemName,
			unit: item.unit,
			unitPrice: item.unitPrice,
		});
	});

	const totalRow = startDataRow + report.rows.length;
	writeRow(worksheet, totalRow, report.totals, { bold: true });
	worksheet.mergeCells(`A${totalRow}:C${totalRow}`);
	worksheet.getCell(`A${totalRow}`).alignment = { horizontal: "center", vertical: "middle" };

	const footerRow = totalRow + 3;
	worksheet.mergeCells(`B${footerRow}:D${footerRow}`);
	worksheet.mergeCells(`F${footerRow}:H${footerRow}`);
	worksheet.mergeCells(`J${footerRow}:L${footerRow}`);
	worksheet.getCell(`B${footerRow}`).value = "Người lập biểu";
	worksheet.getCell(`F${footerRow}`).value = "Kế toán trưởng";
	worksheet.getCell(`J${footerRow}`).value = "Người đại diện hộ kinh doanh";
	["B", "F", "J"].forEach((col) => {
		const cell = worksheet.getCell(`${col}${footerRow}`);
		cell.font = { name: "Times New Roman", size: 12, bold: true };
		cell.alignment = { horizontal: "center" };
	});

	const noteRow = footerRow + 1;
	worksheet.mergeCells(`B${noteRow}:D${noteRow}`);
	worksheet.mergeCells(`F${noteRow}:H${noteRow}`);
	worksheet.mergeCells(`J${noteRow}:L${noteRow}`);
	["B", "F", "J"].forEach((col) => {
		const cell = worksheet.getCell(`${col}${noteRow}`);
		cell.value = "(Ký, họ tên)";
		cell.font = { name: "Times New Roman", size: 11, italic: true };
		cell.alignment = { horizontal: "center" };
	});

	const buffer = await workbook.xlsx.writeBuffer();
	const fileName = `S08_DNN_TonKho_${safeFilePart(formatDate(report.period.startDate))}_${Date.now()}.xlsx`;
	const fileUri = FileSystem.cacheDirectory + fileName;
	await FileSystem.writeAsStringAsync(fileUri, Buffer.from(buffer).toString("base64"), {
		encoding: FileSystem.EncodingType.Base64,
	});

	if (await Sharing.isAvailableAsync()) {
		await Sharing.shareAsync(fileUri, {
			mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			UTI: "com.microsoft.excel.xlsx",
		});
	}
};

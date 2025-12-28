// types/invoice.ts

// 1) Type chính xác theo JSON backend (raw)
export type RawInvoiceProduct = {
  _id?: string;
  id?: string;
  dgia?: number | null;
  dvtinh?: string;
  ltsuat?: string;
  sluong?: number | null;
  stckhau?: number | null;
  stt?: number | null;
  tchat?: number | null;
  ten?: string;
  thtien?: number | null;
  tlckhau?: number | null;
  tsuat?: number | null;
  sxep?: number | null;
  stbchu?: string | null;
  thtcthue?: number | null;
  tthue?: number | null;
  ttkhac?: Array<{
    ttruong: string;
    kdlieu: string;
    dlieu?: string | null;
    _id?: string;
  }>;
};

export type RawInvoice = {
  _id?: string;
  ownerId?: string;
  nmstatus?: any;
  nbstatus?: any;
  htmlContent?: string | null;
  nbmst?: string;
  khmshdon?: number | string;
  mhdon: string
  khhdon?: string;
  shdon?: number | string;
  cqt?: string;
  cttkhac?: any[];
  dvtte?: string | null;
  hdon?: string;
  hsgcma?: string;
  hsgoc?: string;
  hthdon?: number | null;
  htttoan?: string | null;
  id?: string;
  idtbao?: string | null;
  khdon?: any;
  khhdgoc?: any;  ngayLap?: string;

  khmshdgoc?: any;
  lhdgoc?: any;
  mtdiep?: any;
  mtdtchieu?: string | null;
  nbdchi?: string; // địa chỉ người bán
  nbhdktngay?: any;
  nbhdktso?: any;
  nbhdso?: any;
  nblddnbo?: any;
  nbptvchuyen?: any;
  nbstkhoan?: string | null;
  nbten?: string; // tên người bán
  nbtnhang?: string | null;
  nbtnvchuyen?: string | null;
  nbttkhac?: Array<{
    ttruong: string;
    kdlieu: string;
    dlieu?: string | null;
    _id?: string;
  }>;
  ncma?: string; // create date
  ncnhat?: string;
  ngcnhat?: string;
  nky?: string;
  nmdchi?: string; // địa chỉ người mua
  nmmst?: string; // mst người mua
  nmten?: string; // tên người mua
  nmttkhac?: Array<{
    ttruong: string;
    kdlieu: string;
    dlieu?: string | null;
    _id?: string;
  }>;
  nmsdthoai?: string | null;
  nmdctdtu?: string | null;
  nmcmnd?: string | null;
  nmcks?: string | null;
  ntao?: string;
  ntnhan?: string;
  pban?: string | null;
  ptgui?: number | null;
  tchat?: number | null;
  tdlap?: string | null; // ngày lập
  tgia?: number | null;
  tgtcthue?: number | null; // tổng trước thuế?
  tgtthue?: number | null; // tổng tiền thuế
  tgtttbchu?: string | null; // bằng chữ
  tgtttbso?: number | null; // tổng
  thdon?: string | null;
  thlap?: number | null;
  thttlphi?: any[];
  thttltsuat?: Array<{
    tsuat?: string;
    thtien?: number | null;
    tthue?: number | null;
    _id?: string;
  }>;
  tlhdon?: string | null;
  ttcktmai?: number | null;
  tthai?: number | null;
  ttkhac?: any[];
  tttbao?: number | null;
  ttttkhac?: any[];
  ttxly?: number | null;
  tvandnkntt?: string | null;
  thtttoan?: string | null;
  msttcgp?: string | null;
  gchu?: string | null;
  hdhhdvu?: RawInvoiceProduct[] | null;
  qrcode?: string | null;
  tchatbchu?: string | null;
  tthaibchu?: string | null;
  nbwebsite?: string | null;
  nbcks?: string | null;
  nbsdthoai?: string | null;
  nbdctdtu?: string | null;
  nbfax?: string | null;
  bhphap?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  __v?: number | null;
  // ... nếu backend có thêm trường khác thì vẫn an toàn (index signature)
  [key: string]: any;
};

// 2) Type "chuẩn" dễ dùng trong UI (normalized)
export type InvoiceProduct = {
  _id?: string;
  id?: string;
  name?: string; // product.ten
  unit?: string; // dvtinh
  quantity?: number | null; // sluong
  price?: number | null; // dgia
  amount?: number | null; // thtien
  vatRate?: number | null; // tsuat (0.08)
  vatLabel?: string | null; // ltsuat ("8%")
  meta?: RawInvoiceProduct["ttkhac"] | null;
};

export type InvoiceSummary = {
  _id?: string;
  id?: string;
  kyHieu?: string; // khhdon
  soHoaDon?: number | string;
  mhdon: string;
  mauSo?: number | string;
  ngayLap?: string;
  ngayKy?: string;
  loaiHoaDon?: string;
  maCQT?: string;
  maTraCuu?: string;
  nguoiBan?: {
    ten?: string;
    mst?: string;
    diaChi?: string;
    stk?: string | null;
  };
  nguoiMua?: {
    ten?: string;
    mst?: string;
    diaChi?: string;
  };
  thanhToan?: {
    hinhThuc?: string;
    trangThai?: string;
  };
  tien?: {
    truocThue?: number | null;
    thue?: number | null;
    tong?: number | null;
    bangChu?: string | null;
    thueSuat?: string | null;
    dvtte?: string | null;
  };
  hdhhdvu?: InvoiceProduct[]; // normalized array
  trangThaiHoaDon?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  // optionally keep raw payload if needed
  raw?: RawInvoice;
};

export type InvoiceListResponse = {
  invoices: InvoiceSummary[];
  sync: number;
  skip: number;
  fail: number;
};

export type FormGetCapcha = {
  username: string,
  password: string
}

export type CapchaInfo = {
  success: boolean,
  sessionId: string,
  captchaImage: string
}


export interface InvoiceSyncResponse {
  success: boolean;
  message: string;
  invoices: {
    datas: Invoice[];
    total: number;
    state: any;
    time: number;
  };
}

export interface Invoice {
  id: string;

  // 🔹 Thông tin hóa đơn
  shdon: number;              // Số hóa đơn
  khhdon: string;             // Ký hiệu hóa đơn
  khmshdon: number;           // Mẫu số
  thdon: string;              // Tên loại hóa đơn
  tlhdon: string;             // Loại hóa đơn
  tchat: number;              // Tính chất (1: bình thường, 3: điều chỉnh, ...)

  // 🔹 Thời gian
  tdlap: string;              // Ngày lập (ISO)
  ntạo?: string;
  ncma?: string;

  // 🔹 Người bán
  nbmst: string;              // MST người bán
  nbten: string;              // Tên người bán
  nbdchi?: string;            // Địa chỉ người bán

  // 🔹 Người mua
  nmmst?: string;             // MST người mua
  nmten?: string;             // Tên người mua
  nmdchi?: string;            // Địa chỉ người mua

  // 🔹 Giá trị tiền
  tgtttbso: number;           // Tổng tiền thanh toán
  tgtcthue?: number;          // Tổng tiền trước thuế
  tgtthue?: number;           // Tổng tiền thuế

  // 🔹 Thuế suất
  thttltsuat?: InvoiceTax[];

  // 🔹 Trạng thái
  tthai: number;              // Trạng thái hóa đơn
}
export interface InvoiceTax {
  tsuat: string;   // "10%", "8%", ...
  thtien: number;  // Tiền chưa thuế
  tthue: number;   // Tiền thuế
}
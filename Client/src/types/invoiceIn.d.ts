export type InvoiceSummary = {
  kyHieu: string;
  soHoaDon: string;
  mauSo: string;
  ngayLap: string;
  loaiHoaDon: string;
  maCQT: string;
  maTraCuu: string;

  nguoiBan: {
    ten: string;
    mst: string;
    diaChi: string;
    stk?: string;
  };

  nguoiMua: {
    ten: string;
    mst: string;
    diaChi: string;
  };

  thanhToan: {
    hinhThuc: string;
    trangThai: string;
  };

  tien: {
    truocThue: number;
    thue: number;
    tong: number;
    bangChu: string;
    thueSuat: string;
    dvtte: string;
  };

  ngayKy: string;
  trangThaiHoaDon: string;
};

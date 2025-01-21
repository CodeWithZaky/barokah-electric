type StatusMessage = {
  PENDING: string;
  PROCESSING: string;
  PACKED: string;
  SHIPPED: string;
  DELIVERED: string;
  COMPLETED: string;
  CANCELLED: string;
  RETURN_REQUEST: string;
  RETURNED: string;
  REFUNDED: string;
};

export const statusMessage: StatusMessage = {
  PENDING: "Pesanan sedang menunggu pembayaran.",
  PROCESSING: "Pesanan Anda sedang diproses.",
  PACKED: "Pesanan Anda sedang dikemas.",
  SHIPPED: "Pesanan Anda sedang dalam perjalanan.",
  DELIVERED: "Pesanan sedang dalam proses pengantaran.",
  COMPLETED:
    "Pesanan telah tiba di alamat tujuan dan diterima oleh yang bersangkutan.",
  CANCELLED: "Pesanan telah dibatalkan.",
  RETURN_REQUEST: "Pengajuan pengembalian pesanan sedang diproses.",
  RETURNED: "Pesanan telah berhasil dikembalikan.",
  REFUNDED: "Pengembalian dana untuk pesanan telah selesai.",
};

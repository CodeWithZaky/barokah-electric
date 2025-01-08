import { api } from "@/utils/api";
import { formatRupiah } from "@/utils/formatRupiah";
import { useRouter } from "next/router";
import { useState } from "react";

export default function BankTransfer() {
  const router = useRouter();
  const { orderId } = router.query;
  const [paymentAmount, setPaymentAmount] = useState("");
  const transactionId = Math.floor(Math.random() * 1000000000).toString();

  // Fetch order data based on the given orderId
  const { data: order, isLoading } = api.order.getOrderById.useQuery(
    { orderId: Number(orderId) },
    { enabled: !!orderId },
  );

  // Mutation for confirming payment
  const confirmPayment = api.payment.confirm.useMutation({
    onSuccess: () => {
      alert("Payment successful!");
      router.push("/user/orders");
    },
  });

  // Handle form submission
  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!order) {
      alert("Order data is not available. Please try again.");
      return;
    }

    const paymentAmountNumber = Number(paymentAmount);

    if (isNaN(paymentAmountNumber) || paymentAmountNumber <= 0) {
      alert("Please enter a valid payment amount.");
      return;
    }

    console.log(order.total, paymentAmountNumber);

    if (paymentAmountNumber === order.total) {
      confirmPayment.mutate({
        orderId: Number(orderId),
        transactionId,
        amount: paymentAmountNumber,
      });
    } else {
      alert(
        "The payment amount does not match the order total. Please check and try again.",
      );
    }
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-10 min-h-screen max-w-md rounded-lg p-6 shadow-xl">
      <h1 className="mb-6 text-2xl font-bold">Barokah Pay</h1>

      {order ? (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Detail Pembayaran</h2>
            <p>ID Pesanan: {order.id}</p>
            <p>Nomor Resi: {order.receipt}</p>
            <p>Bank: {order.Payment?.bank}</p>
            <p>Total Tagihan: {formatRupiah(order.total)}</p>
          </div>
          <form onSubmit={handleConfirmPayment} className="space-y-4">
            <div>
              <label
                htmlFor="paymentAmount"
                className="block text-sm font-medium text-gray-700"
              >
                Jumlah Pembayaran
              </label>
              <input
                type="number"
                id="paymentAmount"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                required
                step="0.01"
                min="0"
                className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-green-500 px-4 py-2 text-white transition duration-200 hover:bg-green-600"
            >
              Konfirmasi Pembayaran
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center text-red-500">
          <p>Gagal memuat detail pesanan. Silakan coba lagi.</p>
        </div>
      )}
    </div>
  );
}

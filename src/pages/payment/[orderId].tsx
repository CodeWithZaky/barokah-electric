import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function BankTransfer() {
  const router = useRouter();
  const { orderId } = router.query;
  const [paymentAmount, setPaymentAmount] = useState("");
  const transactionId = Math.floor(Math.random() * 1000000000).toString();

  console.log("paymentAmount", Number(paymentAmount));

  const { data: order } = api.order.getOrderById.useQuery(
    { orderId: Number(orderId) },
    { enabled: !!orderId },
  );

  console.log("total", order?.total);

  const confirmPayment = api.payment.confirm.useMutation({
    onSuccess: () => {
      router.push("/user/orders");
    },
  });

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(paymentAmount) === order?.total) {
      confirmPayment.mutate({
        orderId: Number(orderId),
        transactionId,
        amount: Number(paymentAmount),
      });
    } else {
      alert(
        "The payment amount does not match the order total. Please check and try again.",
      );
    }
  };

  return (
    <div className="mx-auto mt-10 min-h-screen max-w-md rounded-lg p-6 shadow-xl">
      <h1 className="mb-6 text-2xl font-bold">Bank Transfer Payment</h1>

      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold">Payment Details</h2>
          <p>Order ID: {order?.id}</p>
          <p>Amount Due: {order?.total}</p>
        </div>
        <form onSubmit={handleConfirmPayment} className="space-y-4">
          <div>
            <label
              htmlFor="paymentAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Amount
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
            className="w-full rounded bg-green-500 px-4 py-2 text-white transition duration-200 hover:bg-green-600"
          >
            Confirm Payment
          </button>
        </form>
      </div>
    </div>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { useState } from "react";

const FormSchema = z.object({
  receiptNumber: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const orderStatuses: OrderStatus[] = ["SHIPPED", "DELIVERED", "COMPLETED"];
type OrderStatus = "SHIPPED" | "DELIVERED" | "COMPLETED";

export default function Courier() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      receiptNumber: "",
    },
  });

  const [orderByReceipt, setOrderByReceipt] = useState<any>({});

  const response = api.order.getOrderReceipt.useQuery(
    { receipt: form.getValues().receiptNumber },
    { enabled: !!form.getValues().receiptNumber },
  );
  async function onSubmit() {
    setOrderByReceipt(response.data);
  }

  const updateOrderStatus = api.order.updateOrderStatus.useMutation({
    onSuccess: () => response.refetch(),
  });

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-lg p-8 shadow-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="receiptNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Masukan Nomor Resi:</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukan nomor resi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8 w-full max-w-lg">
        {orderByReceipt ? (
          <div className="rounded-lg p-6 shadow-md">
            <h2 className="mb-4 text-lg font-semibold">Detail Order</h2>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-medium">Nomor Resi:</p>
              <p>{orderByReceipt.receipt}</p>
              <p className="font-medium">ID:</p>
              <p>{orderByReceipt.id}</p>
              <p className="font-medium">Metode Pengiriman:</p>
              <p>{orderByReceipt.shippingMethod}</p>
              <p className="font-medium">Status:</p>
              <p>{orderByReceipt.status}</p>
              <p className="font-medium">Total:</p>
              <p>{orderByReceipt.total}</p>
            </div>
            <div className="mt-4">
              <Select
                onValueChange={(value) =>
                  handleStatusChange(orderByReceipt.id, value as OrderStatus)
                }
                defaultValue={orderByReceipt.status}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ubah status" />
                </SelectTrigger>
                <SelectContent>
                  {orderStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-6 text-center shadow-md">
            <p>Belum ada data</p>
          </div>
        )}
      </div>
    </div>
  );
}

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
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { UploadButton } from "@/utils/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const FormSchema = z.object({
  receiptNumber: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

const imageSchema = z.object({
  images: z.array(
    z.object({
      imageURL: z.string().url(),
    }),
  ),
});

const orderStatuses: OrderStatus[] = ["SHIPPED", "DELIVERED"];
type OrderStatus = "SHIPPED" | "DELIVERED";

export default function Courier() {
  /**
   * state and hooks
   */
  const [orderByReceipt, setOrderByReceipt] = useState<any>({});
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      receiptNumber: "",
    },
  });
  const [formData, setFormData] = useState<z.infer<typeof imageSchema>>({
    images: [],
  });

  const { toast } = useToast();

  /**
   * queries and mutations
   */
  const response = api.order.getOrderReceipt.useQuery(
    { receipt: form.getValues().receiptNumber },
    { enabled: !!form.getValues().receiptNumber },
  );

  const updateImageOrder = api.order.updateImageOrder.useMutation({
    onSuccess: () => response.refetch(),
  });

  /**
   * functions handlers
   */
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

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6">
      <div className="w-full max-w-lg rounded-lg p-8 shadow-lg">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="receiptNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-medium">
                    Masukan Nomor Resi:
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Masukan nomor resi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-semibold">
              Submit
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8 w-full max-w-lg">
        {orderByReceipt ? (
          <div className="rounded-lg p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Detail Order</h2>
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

            {orderByReceipt.status === "DELIVERED" && (
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-4">
                  {formData.images.length > 0 ? (
                    formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image.imageURL}
                          alt="Product"
                          width={150}
                          height={150}
                          className="rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2 h-6 w-6 hover:bg-red-600"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))
                  ) : (
                    <>
                      {orderByReceipt.image !== null ? (
                        <div className="relative">
                          <Image
                            src={orderByReceipt.image}
                            alt="Product"
                            width={150}
                            height={150}
                            className="rounded-md border"
                          />
                        </div>
                      ) : (
                        <div className="h-[150px] w-[150px] animate-pulse rounded-md bg-gray-300" />
                      )}
                    </>
                  )}
                </div>

                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      const newImage = {
                        imageURL: res[0]?.url || "",
                      };
                      setFormData((prev) => ({
                        ...prev,
                        images: [...prev.images, newImage],
                      }));
                    }
                  }}
                  onUploadError={(error: Error) => {
                    toast({
                      title: "Upload Error",
                      description: error.message,
                      variant: "destructive",
                    });
                  }}
                />
                <p className="text-sm">Unggah bukti pengiriman di bawah ini:</p>
                <Button
                  type="submit"
                  className="w-full font-semibold"
                  onClick={() =>
                    updateImageOrder.mutate({
                      orderId: orderByReceipt.id,
                      image: formData.images[0]?.imageURL || "",
                    })
                  }
                >
                  Upload Bukti
                </Button>
              </div>
            )}

            <div className="mt-6">
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
          <div className="rounded-lg p-6 text-center shadow-lg">
            <p>Belum ada data</p>
          </div>
        )}
      </div>
    </div>
  );
}

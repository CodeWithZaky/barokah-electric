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
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { formatRupiah } from "@/utils/formatRupiah";
import { UploadButton } from "@/utils/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const FormSchema = z.object({
  receiptNumber: z.string().min(1, {
    message: "input must be at least 1 characters.",
  }),
});

const imageSchema = z.object({
  images: z.array(
    z.object({
      imageURL: z.string().url(),
    }),
  ),
});

export default function Courier() {
  /**
   * state and hooks
   */
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
    response.refetch();
  }

  const updateOrderStatus = api.order.updateOrderStatus.useMutation({
    onSuccess: () => {
      response.refetch();
      toast({
        title: "success",
        description: "bukti berhasil di tambahkan",
      });
    },
  });

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
              Search
            </Button>
          </form>
        </Form>
      </div>

      <div className="mt-8 w-full max-w-lg">
        {response.data ? (
          <div className="rounded-lg p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-bold">Detail Order</h2>
            <div className="grid grid-cols-2 gap-4">
              <p className="font-medium">Nomor Resi:</p>
              <p>{response.data.receipt}</p>
              <p className="font-medium">ID:</p>
              <p>{response.data.id}</p>
              <p className="font-medium">Metode Pengiriman:</p>
              <p>{response.data.shippingMethod}</p>
              <p className="font-medium">Status:</p>
              <p>{response.data.status}</p>
              <p className="font-medium">Total:</p>
              <p>{formatRupiah(response.data.total)}</p>
            </div>

            {response.data.status === "DELIVERED" && (
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
                      {response.data.image !== null ? (
                        <div className="relative">
                          <Image
                            src={response.data.image}
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
                      orderId: response.data?.id || 0,
                      image: formData.images[0]?.imageURL || "",
                    })
                  }
                >
                  Upload Bukti
                </Button>
              </div>
            )}

            <div className="mt-6">
              {response.data.status === "PACKED" && (
                <Button
                  className="w-full font-semibold"
                  onClick={() => {
                    updateOrderStatus.mutateAsync({
                      orderId: response.data?.id || 0,
                      status: "SHIPPED",
                    });
                    response.refetch();
                  }}
                >
                  PACKED TO SHIPPED
                </Button>
              )}
              {response.data.status === "SHIPPED" && (
                <Button
                  className="w-full font-semibold"
                  onClick={() => {
                    updateOrderStatus.mutateAsync({
                      orderId: response.data?.id || 0,
                      status: "DELIVERED",
                    });
                    response.refetch();
                  }}
                >
                  SHIPPED TO DELIVERED
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-lg p-6 text-center text-xl shadow-lg">
            <p>data tidak ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

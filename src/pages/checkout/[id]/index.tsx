import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AddressSection } from "@/components/address-section";
import Loading from "@/components/loading";
import { PaymentMethodSection } from "@/components/payment-method-section";
import { ShippingMethodSection } from "@/components/shipping-method-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { formatRupiah } from "@/utils/formatRupiah";
import { useRouter } from "next/router";

const ShippingMethod = {
  JNE: "JNE",
  JNT: "JNT",
  SICEPAT: "SICEPAT",
  POS_INDONESIA: "POS_INDONESIA",
  TIKI: "TIKI",
} as const;

const PaymentMethod = {
  COD: "COD",
  BANK_TRANSFER: "BANK_TRANSFER",
} as const;

const BankType = {
  BRI: "BRI",
  BNI: "BNI",
  MANDIRI: "MANDIRI",
} as const;

const formSchema = z.object({
  addressId: z.number().min(1, "Pilih alamat pengiriman"),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  bank: z.nativeEnum(BankType).optional(),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createOrder = api.order.createOrder.useMutation();

  console.log(router.query.id);

  const { data: productById, isLoading: isProductByIdLoading } =
    api.product.getById.useQuery({
      id: Number(router.query.id),
    });

  const { data: primaryAddress, isLoading: isPrimaryAddressLoading } =
    api.address.getPrimaryAddress.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressId: 0,
      shippingMethod: ShippingMethod.JNE,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      bank: BankType.BRI,
    },
  });

  useEffect(() => {
    if (primaryAddress) {
      form.setValue("addressId", primaryAddress.id);
    }
  }, [primaryAddress, form]);

  const shippingCosts = {
    [ShippingMethod.JNE]: 15000,
    [ShippingMethod.JNT]: 14000,
    [ShippingMethod.SICEPAT]: 16000,
    [ShippingMethod.POS_INDONESIA]: 18000,
    [ShippingMethod.TIKI]: 17000,
  };

  const shippingCost =
    shippingCosts[
      form.watch("shippingMethod") as keyof typeof ShippingMethod
    ] || shippingCosts[ShippingMethod.JNE];

  const total = productById?.price ?? 0;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!productById) {
        throw new Error("Product not found");
      }

      const orderData = {
        ...values,
        name: primaryAddress?.name || "",
        email: primaryAddress?.email || "",
        phone: primaryAddress?.phone || "",
        address: primaryAddress?.address || "",
        postalCode: primaryAddress?.postalCode || "",
        city: primaryAddress?.city || "",
        province: primaryAddress?.province || "",
        total: total + shippingCost,
        products: [
          {
            productId: productById.id,
            quantity: 1,
          },
        ],
      };

      const result = await createOrder.mutateAsync(orderData);

      toast({
        title: "Pesanan berhasil dibuat",
        description: `ID Pesanan: ${result.id}`,
      });

      router.push("/user/orders");
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal membuat pesanan. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  }

  if (isProductByIdLoading || isPrimaryAddressLoading) {
    return <Loading />;
  }

  return (
    <div className="mx-auto min-h-screen max-w-4xl space-y-4 p-4">
      <AddressSection />

      <div className="rounded-lg shadow-sm">
        <div className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 border-b p-4 text-sm text-muted-foreground">
          <div>Produk</div>
          <div className="text-center">Harga Satuan</div>
          <div className="text-center">Kuantitas</div>
          <div className="text-center">Total Harga</div>
        </div>
        <div className="divide-y">
          {
            <div
              key={productById?.id}
              className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 p-4"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 overflow-hidden rounded border">
                  <Image
                    src={productById?.images[0]?.imageURL || "/placeholder.svg"}
                    alt={productById?.name || ""}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{productById?.name}</p>
                </div>
              </div>
              <div className="text-center">
                Rp{productById?.price.toLocaleString()}
              </div>
              <div className="text-center">1</div>
              <div className="text-center font-medium">
                Rp{productById?.price.toLocaleString()}
              </div>
            </div>
          }
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Pesan untuk penjual..."
              className="max-w-xs"
              {...form.register("notes")}
            />
          </div>
        </div>
      </div>

      <ShippingMethodSection form={form} />
      <PaymentMethodSection form={form} />

      <div className="sticky bottom-0 rounded-lg p-4 shadow-sm backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm text-muted-foreground">
                Total Pesanan :
              </span>
              <span className="text-2xl font-bold text-primary">
                {formatRupiah(total + shippingCost)}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total 1 Produk: Rp{total}
              <br />
              Total Ongkos Kirim: Rp{shippingCost.toLocaleString()}
            </div>
          </div>
          <Button
            size="lg"
            className="px-8"
            onClick={form.handleSubmit(onSubmit)}
            disabled={createOrder.isPending}
          >
            {createOrder.isPending ? "Memproses..." : "Buat Pesanan"}
          </Button>
        </div>
      </div>
    </div>
  );
}

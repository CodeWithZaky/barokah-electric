import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { AddressSection } from "@/components/address-section";
import Loading from "@/components/loading";
import { PaymentMethodSection } from "@/components/payment-method-section";
import { ShippingMethodSection } from "@/components/shipping-method-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { shippingCosts } from "@/data/shipping-costs";
import { useToast } from "@/hooks/use-toast";
import useSelectedItemStore from "@/stores/selected-cart-item-id";
import { api } from "@/utils/api";
import { BankName, PaymentMethod, ShippingMethod } from "@prisma/client";

const formSchema = z.object({
  addressId: z.number().min(1, "Pilih alamat pengiriman"),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  bank: z.nativeEnum(BankName).optional(),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const createOrder = api.order.createOrder.useMutation();
  const { selectedItems } = useSelectedItemStore();

  const { data: carts, isLoading: isCartsLoading } =
    api.cart.getCartItemsByIds.useQuery({
      cartItemIds: selectedItems,
    });

  const { data: primaryAddress, isLoading: isPrimaryAddressLoading } =
    api.address.getPrimaryAddress.useQuery();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      addressId: 0,
      shippingMethod: ShippingMethod.JNE,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      bank: BankName.BRI,
    },
  });

  useEffect(() => {
    if (primaryAddress) {
      form.setValue("addressId", primaryAddress.id);
    }
  }, [primaryAddress, form]);

  const subtotal =
    carts?.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    ) || 0;

  const shippingCost =
    shippingCosts[
      form.watch("shippingMethod") as keyof typeof ShippingMethod
    ] || shippingCosts[ShippingMethod.JNE];
  const total = subtotal + shippingCost;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!carts?.length) {
        toast({
          title: "Error",
          description: "Keranjang belanja kosong",
          variant: "destructive",
        });
        return;
      }

      const orderData = {
        ...values,
        name: primaryAddress?.name ?? "",
        email: primaryAddress?.email ?? "",
        phone: primaryAddress?.phone ?? "",
        address: primaryAddress?.address ?? "",
        postalCode: primaryAddress?.postalCode ?? "",
        city: primaryAddress?.city ?? "",
        province: primaryAddress?.province ?? "",
        total,
        products: carts.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
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

  if (isCartsLoading || isPrimaryAddressLoading) {
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
          {carts?.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[2fr,1fr,1fr,1fr] gap-4 p-4"
            >
              <div className="flex gap-4">
                <div className="h-16 w-16 overflow-hidden rounded border">
                  <Image
                    src={item.product.images[0]?.imageURL ?? ""}
                    alt={item.product.name ?? "product name"}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium">{item.product.name}</p>
                </div>
              </div>
              <div className="text-center">
                Rp{item.product.price.toLocaleString()}
              </div>
              <div className="text-center">{item.quantity}</div>
              <div className="text-center font-medium">
                Rp{(item.quantity * item.product.price).toLocaleString()}
              </div>
            </div>
          ))}
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
                Total Pesanan ({carts?.length || 0} Produk):
              </span>
              <span className="text-2xl font-bold text-primary">
                Rp{total.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              Total Produk: Rp{subtotal.toLocaleString()}
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

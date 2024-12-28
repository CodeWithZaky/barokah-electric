"use client";

import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuFileEdit, LuMapPin } from "react-icons/lu";
import * as z from "zod";

import { AddressModal } from "@/components/address-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import useSelectedItemStore from "@/stores/selected-cart-item-id";

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
  name: z.string().min(2, { message: "Nama harus minimal 2 karakter." }),
  phone: z
    .string()
    .min(6, { message: "Nomor telepon harus minimal 6 karakter." }),
  email: z.string().email({ message: "Alamat email tidak valid." }),
  address: z.string().min(5, { message: "Alamat harus minimal 5 karakter." }),
  postalCode: z
    .string()
    .min(5, { message: "Kode pos harus minimal 5 karakter." }),
  city: z.string().min(2, { message: "Kota harus minimal 2 karakter." }),
  province: z
    .string()
    .min(2, { message: "Provinsi harus minimal 2 karakter." }),
  shippingMethod: z.nativeEnum(ShippingMethod),
  paymentMethod: z.nativeEnum(PaymentMethod),
  bank: z.nativeEnum(BankType).optional(),
  notes: z.string().optional(),
});

const addressFormSchema = z.object({
  name: z.string().min(2, { message: "Nama harus minimal 2 karakter." }),
  phone: z
    .string()
    .min(6, { message: "Nomor telepon harus minimal 6 karakter." }),
  email: z.string().email({ message: "Alamat email tidak valid." }),
  address: z.string().min(5, { message: "Alamat harus minimal 5 karakter." }),
  postalCode: z
    .string()
    .min(5, { message: "Kode pos harus minimal 5 karakter." }),
  city: z.string().min(2, { message: "Kota harus minimal 2 karakter." }),
  province: z
    .string()
    .min(2, { message: "Provinsi harus minimal 2 karakter." }),
});

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const createOrder = api.order.createOrder.useMutation();
  const { selectedItems } = useSelectedItemStore();

  const { data: carts, isLoading } = api.cart.getCartItemsByIds.useQuery({
    cartItemIds: selectedItems,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      postalCode: "",
      city: "",
      province: "",
      shippingMethod: ShippingMethod.JNE,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      bank: BankType.BRI,
    },
  });

  const subtotal =
    carts?.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    ) || 0;

  const shippingCosts = {
    [ShippingMethod.JNE]: 15000,
    [ShippingMethod.JNT]: 14000,
    [ShippingMethod.SICEPAT]: 16000,
    [ShippingMethod.POS_INDONESIA]: 18000,
    [ShippingMethod.TIKI]: 17000,
  };

  const shippingCost = shippingCosts[form.watch("shippingMethod")]
    ? shippingCosts[form.watch("shippingMethod")]
    : shippingCosts[ShippingMethod.JNE];
  // shippingCosts[form.watch("shippingMethod") as keyof typeof ShippingMethod];
  const total = subtotal + shippingCost;

  const handleAddressSubmit = (values: z.infer<typeof addressFormSchema>) => {
    form.reset(values);
    setIsAddressModalOpen(false);
  };

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4 mx-auto p-4 max-w-4xl min-h-screen">
      <div className="shadow-sm p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <div className="flex items-center gap-2">
            <LuMapPin className="w-5 h-5 text-primary" />
            <span className="font-medium">Alamat Pengiriman</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-primary"
            onClick={() => setIsAddressModalOpen(true)}
          >
            <LuFileEdit className="mr-2 w-4 h-4" />
            Ubah
          </Button>
        </div>
        <div className="space-y-1 text-sm">
          <p className="font-medium">{form.watch("name") || "Nama Penerima"}</p>
          <p className="text-muted-foreground">
            {form.watch("phone") || "Nomor Telepon"}
          </p>
          <p className="text-muted-foreground">
            {form.watch("address") || "Alamat Lengkap"}
          </p>
        </div>
      </div>

      <div className="shadow-sm rounded-lg">
        <div className="gap-4 grid grid-cols-[2fr,1fr,1fr,1fr] p-4 border-b text-muted-foreground text-sm">
          <div>Produk</div>
          <div className="text-center">Harga Satuan</div>
          <div className="text-center">Kuantitas</div>
          <div className="text-center">Total Harga</div>
        </div>
        <div className="divide-y">
          {carts?.map((item) => (
            <div
              key={item.id}
              className="gap-4 grid grid-cols-[2fr,1fr,1fr,1fr] p-4"
            >
              <div className="flex gap-4">
                <div className="border rounded w-16 h-16 overflow-hidden">
                  <Image
                    src={item.product.images[0]?.imageURL || "/placeholder.svg"}
                    alt={item.product.name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
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
              <div className="font-medium text-center">
                Rp{(item.quantity * item.product.price).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Pesan untuk penjual..."
              className="max-w-xs"
              {...form.register("notes")}
            />
          </div>
        </div>
      </div>

      <div className="shadow-sm p-4 rounded-lg">
        <div className="mb-4 font-medium">Metode Pengiriman</div>
        <Form {...form}>
          <FormField
            control={form.control}
            name="shippingMethod"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-2"
                  >
                    {Object.entries(shippingCosts).map(([method, cost]) => (
                      <div
                        key={method}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value={method} id={method} />
                          <Label htmlFor={method}>{method}</Label>
                        </div>
                        <span>Rp{cost.toLocaleString()}</span>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </div>

      <div className="shadow-sm p-4 rounded-lg">
        <div className="mb-4 font-medium">Metode Pembayaran</div>
        <Form {...form}>
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={(value) => {
                        field.onChange(value);
                        if (value === PaymentMethod.COD) {
                          form.setValue("bank", undefined);
                        }
                      }}
                      defaultValue={field.value}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem value={PaymentMethod.COD} id="cod" />
                        <Label htmlFor="cod">Bayar di Tempat (COD)</Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem
                          value={PaymentMethod.BANK_TRANSFER}
                          id="bank"
                        />
                        <Label htmlFor="bank">Transfer Bank</Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {form.watch("paymentMethod") === PaymentMethod.BANK_TRANSFER && (
              <FormField
                control={form.control}
                name="bank"
                render={({ field }) => (
                  <FormItem className="ml-6">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="space-y-2"
                      >
                        {Object.values(BankType).map((bank) => (
                          <div
                            key={bank}
                            className="flex items-center space-x-2 p-4 border rounded-lg"
                          >
                            <RadioGroupItem
                              value={bank}
                              id={bank.toLowerCase()}
                            />
                            <Label htmlFor={bank.toLowerCase()}>
                              Bank {bank}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </Form>
      </div>

      <div className="shadow-sm p-4 rounded-lg">
        <div className="mb-4 font-medium">Voucher</div>
        <div className="flex gap-2">
          <Input placeholder="Masukkan kode voucher" />
          <Button variant="outline">Gunakan</Button>
        </div>
      </div>

      <div className="bottom-0 sticky shadow-sm backdrop-blur-md p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-muted-foreground text-sm">
                Total Pesanan ({carts?.length || 0} Produk):
              </span>
              <span className="font-bold text-2xl text-primary">
                Rp{total.toLocaleString()}
              </span>
            </div>
            <div className="text-muted-foreground text-xs">
              Total Produk: Rp{subtotal.toLocaleString()}
              <br />
              Total Ongkos Kirim: Rp
              {shippingCost.toLocaleString()}
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

      <AddressModal
        open={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
        onSubmit={handleAddressSubmit}
        defaultValues={form.getValues()}
      />
    </div>
  );
}

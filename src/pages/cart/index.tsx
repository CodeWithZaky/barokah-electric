"use client";

import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useSelectedItemStore from "@/stores/selected-cart-item-id";
import { api } from "@/utils/api";
import Image from "next/image";
import Link from "next/link";
import { LuTrash2 } from "react-icons/lu";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
};

export default function Cart() {
  // const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const {
    selectedItems,
    setSelectedItems,
    toggleItemSelection,
    clearSelection,
  } = useSelectedItemStore();

  const {
    data: cart,
    refetch: refetchCart,
    isLoading,
  } = api.cart.getCart.useQuery();

  const updateItem = api.cart.updateItem.useMutation({
    onSuccess: () => refetchCart(),
  });

  const removeItem = api.cart.removeItem.useMutation({
    onSuccess: () => refetchCart(),
  });

  const clearCart = api.cart.clearCart.useMutation({
    onSuccess: () => refetchCart(),
  });

  const handleUpdateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate({ cartItemId: item.id, quantity: newQuantity });
  };

  const handleRemoveItem = (item: CartItem) => {
    removeItem.mutate({ cartItemId: item.id });
  };

  const handleClearCart = () => {
    clearCart.mutate();
  };

  // const handleSelectItem = (itemId: number) => {
  //   setSelectedItems((prev) =>
  //     prev.includes(itemId)
  //       ? prev.filter((id) => id !== itemId)
  //       : [...prev, itemId],
  //   );
  // };

  const handleSelectItem = (itemId: number) => {
    toggleItemSelection(itemId);
  };

  // const handleSelectAll = () => {
  //   setSelectedItems(
  //     selectedItems.length === cart?.items.length
  //       ? []
  //       : cart?.items.map((item) => item.id) || [],
  //   );
  // };

  const handleSelectAll = (allItems: number[]) => {
    setSelectedItems(selectedItems.length === allItems.length ? [] : allItems);
  };

  const totalPrice =
    cart?.items
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.quantity * item.product.price, 0) ||
    0;

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Card className="mx-auto min-h-screen w-full max-w-4xl bg-background">
      <CardHeader className="border-b">
        <CardTitle>Keranjang Belanja</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {cart?.items.length === 0 ? (
          <p>Keranjang belanja kamu kosong.</p>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-[auto,2fr,1fr,1fr,auto] items-center gap-4 px-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-4">
                <Checkbox
                  checked={selectedItems.length === cart?.items.length}
                  onCheckedChange={() =>
                    handleSelectAll(cart?.items.map((item) => item.id) || [])
                  }
                />
                <span>Produk</span>
              </div>
              <span />
              <span className="text-center">Harga Satuan</span>
              <span className="text-center">Kuantitas</span>
              <span className="text-center">Total Harga</span>
            </div>
            <Separator />
            <ul className="space-y-4">
              {cart?.items.map((item) => (
                <li
                  key={item.id}
                  className="grid grid-cols-[auto,2fr,1fr,1fr,auto] items-center gap-4 px-4"
                >
                  <div className="flex items-center space-x-4">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                    <div className="h-16 w-16 overflow-hidden rounded border">
                      <Image
                        src={
                          item.product.images[0]?.imageURL || "/placeholder.svg"
                        }
                        alt={item.product.name}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-center">
                    Rp{item.product.price.toLocaleString()}
                  </span>
                  <div className="flex items-center justify-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(item, item.quantity - 1)
                      }
                    >
                      -
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleUpdateQuantity(item, parseInt(e.target.value))
                      }
                      className="h-8 w-16 text-center"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() =>
                        handleUpdateQuantity(item, item.quantity + 1)
                      }
                    >
                      +
                    </Button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-right font-medium text-primary">
                      Rp{(item.quantity * item.product.price).toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <LuTrash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t p-6">
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center space-x-4">
            <Checkbox
              checked={selectedItems.length === cart?.items.length}
              onCheckedChange={() => handleSelectAll}
            />
            <span>Pilih Semua</span>
            <Button
              variant="ghost"
              onClick={handleClearCart}
              disabled={cart?.items.length === 0}
              className="text-destructive"
            >
              Hapus
            </Button>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                Total ({selectedItems.length} produk):
              </p>
              <p className="text-lg font-semibold text-primary">
                Rp{totalPrice.toLocaleString()}
              </p>
            </div>
            <Link href="/checkout">
              <Button
                size="lg"
                disabled={selectedItems.length === 0}
                className="px-8"
              >
                Checkout
              </Button>
            </Link>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}

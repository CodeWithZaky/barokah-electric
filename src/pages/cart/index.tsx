import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import Link from "next/link";
import { useState } from "react";
import { LuLoader2, LuTrash2 } from "react-icons/lu";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    price: number;
  };
};

export default function Cart() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const { data: cart, refetch: refetchCart } = api.cart.getCart.useQuery();

  const addItem = api.cart.addItem.useMutation({
    onSuccess: () => refetchCart(),
  });

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

  const totalPrice =
    cart?.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    ) || 0;

  if (isLoading) {
    return (
      <div className="flex h-64 min-h-screen items-center justify-center">
        <LuLoader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="mx-auto min-h-screen w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Your Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {cart?.items.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-4">
            {cart?.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="font-medium">{item.product.name}</span>
                  <span className="text-sm text-gray-500">
                    ${item.product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
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
                    className="w-16 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleUpdateQuantity(item, item.quantity + 1)
                    }
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveItem(item)}
                  >
                    <LuTrash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
      <Separator className="my-4" />
      <CardFooter className="flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold">
            Total: ${totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={handleClearCart}
            disabled={cart?.items.length === 0}
          >
            Clear Cart
          </Button>
          <Link href="/checkout">
            <Button disabled={cart?.items.length === 0}>Checkout</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

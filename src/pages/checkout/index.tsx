import { api } from "@/utils/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { dummyOrders } from "@/data/order-data";
import { useToast } from "@/hooks/use-toast";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  lastname: z
    .string()
    .min(2, { message: "Last name must be at least 2 characters." }),
  phone: z
    .string()
    .min(6, { message: "Phone number must be at least 6 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  company: z.string(),
  adress: z
    .string()
    .min(5, { message: "Address must be at least 5 characters." }),
  apartment: z.string(),
  postalCode: z
    .string()
    .min(5, { message: "Postal code must be at least 5 characters." }),
  city: z.string().min(2, { message: "City must be at least 2 characters." }),
  country: z
    .string()
    .min(2, { message: "Country must be at least 2 characters." }),
  total: z.number(),
  products: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
    }),
  ),

  orderNotice: z.string().optional(),
  receipt: z.string().optional(),
});

type CheckoutPageProps = {
  products: Array<{
    productId: number;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
};

export default function CheckoutPage({ products, total }: CheckoutPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const createOrder = api.order.createOrder.useMutation();
  // const searchParams = useSearchParams();
  const { data: carts } = api.cart.getCart.useQuery();

  const totalPrice =
    carts?.items.reduce(
      (total, item) => total + item.quantity * item.product.price,
      0,
    ) || 0;

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: dummyOrders[0],
    // defaultValues: {
    //   name: "",
    //   lastname: "",
    //   phone: "",
    //   email: "",
    //   company: "",
    //   adress: "",
    //   apartment: "",
    //   postalCode: "",
    //   city: "",
    //   country: "",
    //   orderNotice: "",
    // },
  });

  const { data: orders } = api.order.getOrders.useQuery();
  console.log(orders);

  useEffect(() => {
    if (carts?.items) {
      form.setValue("total", totalPrice);
      form.setValue(
        "products",
        carts.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      );
    }
  }, [carts, totalPrice, form]);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (!carts || !carts.items) {
        toast({
          title: "Error",
          description:
            "There was an error placing your order. Please try again.",
          variant: "destructive",
        });
      }

      const orderData = {
        ...values,
        total: totalPrice,
        OrderProducts: {
          create: carts?.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      };

      console.log(orderData);

      const result = await createOrder.mutateAsync(orderData);

      toast({
        title: "Order placed successfully",
        description: `Your order ID is: ${result.id}`,
      });

      router.push(`/user/purchase`);
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="company"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="adress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="apartment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apartment (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postalCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postal Code</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="orderNotice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Order Notice (Optional)</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full"
                  // disabled={createOrder.isPending}
                >
                  {createOrder.isPending ? "Processing..." : "Place Order"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {carts?.items.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-4">
                {carts?.items.map((item, index) => (
                  <div key={index} className="flex justify-between py-2">
                    <div className="flex flex-col">
                      <span>{item.product.name}</span>
                      <span>
                        {item.product.price} (x{item.quantity})
                      </span>
                    </div>
                    <span>
                      Rp{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <Separator className="my-4" />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>Rp{totalPrice.toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// export async function getServerSideProps() {
//   // In a real application, you would fetch this data from your API or state management
//   const products = [
//     { productId: 101, name: "Product 1", price: 25, quantity: 2 },
//     { productId: 102, name: "Product 2", price: 50, quantity: 1 },
//   ];

//   const total = products.reduce(
//     (sum, product) => sum + product.price * product.quantity,
//     0,
//   );

//   return {
//     props: {
//       products,
//       total,
//     },
//   };
// }

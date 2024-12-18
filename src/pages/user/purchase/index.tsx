import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export default function PurchasePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");

  const session = useSession();
  const userRole = session.data?.user.role;

  const {
    data: orders,
    isLoading,
    refetch,
  } = api.order.getOrderById.useQuery({
    userId: session.data?.user.id as string,
  });

  const updateOrderStatus = api.order.updateOrderStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const filteredOrders = orders?.filter((order) => order.status === activeTab);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto min-h-screen p-4">
      <h1 className="mb-4 text-2xl font-bold">My Purchases</h1>
      <Tabs
        defaultValue="PENDING"
        onValueChange={(value) => setActiveTab(value as OrderStatus)}
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="PENDING">Pending</TabsTrigger>
          <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
          <TabsTrigger value="SHIPPED">Shipped</TabsTrigger>
          <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
          <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
        </TabsList>
        {Object.values(OrderStatus).map((status) => (
          <TabsContent key={status} value={status}>
            {filteredOrders?.map((order) => (
              <Card key={order.id} className="mb-4">
                <CardHeader>
                  <CardTitle>Order #{order.id}</CardTitle>
                  <CardDescription>
                    Placed on: {new Date(order.dateTime).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Total: ${order.total / 100}</p>
                  <p>Status: {order.status}</p>
                  <ul>
                    {order.orderProducts.map((op) => (
                      <li key={op.id}>
                        {op.product.name} x {op.quantity}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  {userRole === "ADMIN" && (
                    <Select
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value as OrderStatus)
                      }
                      defaultValue={order.status}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Change status" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(OrderStatus).map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Button
                    className="ml-2"
                    onClick={() => router.push(`/order/${order.id}`)}
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

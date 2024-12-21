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
import { useState } from "react";
import DashboardLayout from "../layout";

export default function OrderDashboard() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");

  const session = useSession();
  const userRole = session.data?.user.role;

  const { data: orders, isLoading, refetch } = api.order.getOrders.useQuery();

  const updateOrderStatus = api.order.updateOrderStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const cancelledOrder = api.order.updateOrderStatus.useMutation();

  const filteredOrders = orders?.filter((order) => order.status === activeTab);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
  };

  if (isLoading)
    return (
      <div className="flex min-h-screen w-full animate-pulse items-center justify-center text-5xl">
        Loading...
      </div>
    );

  return (
    <DashboardLayout>
      <div className="container mx-auto min-h-screen p-4">
        <h1 className="mb-4 text-2xl font-bold">My Purchases</h1>
        <Tabs
          defaultValue="PENDING"
          onValueChange={(value) => setActiveTab(value as OrderStatus)}
        >
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="PENDING">Pending</TabsTrigger>
            <TabsTrigger value="PROCESSING">Processing</TabsTrigger>
            <TabsTrigger value="PACKED">Packed</TabsTrigger>
            <TabsTrigger value="SHIPPED">Shipped</TabsTrigger>
            <TabsTrigger value="DELIVERED">Delivered</TabsTrigger>
            <TabsTrigger value="COMPLETED">Completed</TabsTrigger>
            <TabsTrigger value="CANCELLED">Cancelled</TabsTrigger>
          </TabsList>
          {Object.values(OrderStatus).map((status) => (
            <TabsContent key={status} value={status}>
              {filteredOrders?.map((order) => (
                <Card key={order.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>Order #{order.id}</CardTitle>
                    <CardDescription>
                      Placed on:{" "}
                      {new Date(order.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col py-3">
                      <p className="text-lg font-bold">
                        Total: ${order.total / 100}
                      </p>
                      <p>Status: {order.status}</p>
                      <p>Delivery: {order.shippingMethod}</p>
                      <p>Payment: COD only</p>
                    </div>
                    <ul>
                      {order.orderProducts.map((op) => (
                        <li key={op.id}>
                          {op.product.name}{" "}
                          <span className="text-green-500">
                            x {op.quantity}
                          </span>
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
                    {/* <Button
                      className="ml-2"
                      onClick={() => router.push(`/order/${order.id}`)}
                    >
                      View Details
                    </Button> */}
                    <Button
                      className="ml-2"
                      variant={"destructive"}
                      onClick={() =>
                        cancelledOrder.mutate({
                          orderId: order.id,
                          status: "CANCELLED",
                        })
                      }
                    >
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

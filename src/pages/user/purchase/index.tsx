import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { OrderStatus } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

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
    <div className="mx-auto p-4 min-h-screen container">
      <h1 className="mb-4 font-bold text-2xl">My Purchases</h1>
      <Tabs
        defaultValue="PENDING"
        onValueChange={(value) => setActiveTab(value as OrderStatus)}
      >
        <TabsList className="grid grid-cols-7 w-full">
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
                    Placed on: {new Date(order.createdAt).toLocaleDateString()}
                  </CardDescription>
                  <CardDescription>
                    Receipt Number: {order.receipt ?? ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col py-3">
                    <p className="font-bold text-lg">
                      Total: ${order.total / 100}
                    </p>
                    <p>Status: {order.status}</p>
                    <p>Payment: {order.deliveryService}</p>
                  </div>
                  <ul>
                    {order.orderProducts.map((op) => (
                      <Fragment key={op.id}>
                        {/* <li>
                          <Image src={op.product.image[0]} alt="product" />
                        </li> */}
                        <li>
                          {op.product.name}{" "}
                          <span className="text-green-500">
                            x {op.quantity}
                          </span>
                        </li>
                      </Fragment>
                    ))}
                  </ul>
                </CardContent>
                {/* <CardFooter>
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
                </CardFooter> */}
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

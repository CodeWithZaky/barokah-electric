import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/utils/api";
import { OrderStatus } from "@prisma/client";
import {
  Box,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import UserLayout from "../layout";

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");
  const { data: orders, isLoading } = api.order.getOrderUserId.useQuery();

  const filteredOrders = orders?.filter((order) => order.status === activeTab);

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-primary border-t-2 border-b-2 rounded-full w-32 h-32 animate-spin"></div>
      </div>
    );

  const statusIcons = {
    PENDING: <Clock className="w-5 h-5" />,
    PROCESSING: <Package className="w-5 h-5" />,
    PACKED: <Box className="w-5 h-5" />,
    SHIPPED: <Truck className="w-5 h-5" />,
    DELIVERED: <ShoppingBag className="w-5 h-5" />,
    COMPLETED: <CheckCircle className="w-5 h-5" />,
    CANCELLED: <XCircle className="w-5 h-5" />,
  };

  return (
    <UserLayout>
      <div className="p-4 min-h-screen">
        <h1 className="mb-6 font-bold text-3xl text-center text-primary">
          Pesanan Saya
        </h1>
        <Tabs
          defaultValue="PENDING"
          onValueChange={(value) => setActiveTab(value as OrderStatus)}
          className="shadow-lg rounded-lg"
        >
          <TabsList className="gap-2 grid grid-cols-7 w-full">
            {Object.entries(statusIcons).map(([status, icon]) => (
              <TabsTrigger
                key={status}
                value={status}
                className="flex justify-center items-center gap-2"
              >
                {icon}
                <span className="sm:inline hidden">{status}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.values(OrderStatus).map((status) => (
            <TabsContent key={status} value={status}>
              {filteredOrders?.map((order) => (
                <Card
                  key={order.id}
                  className="hover:shadow-xl mb-6 transition-shadow duration-300 overflow-hidden"
                >
                  <CardHeader className="bg-primary/5">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg sm:text-xl">
                        Order #{order.id}
                      </CardTitle>
                      <Badge variant="outline" className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                    <CardDescription className="text-sm sm:text-base">
                      Nomor Resi: {order.receipt ?? "Belum tersedia"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4">
                    <div className="flex sm:flex-row flex-col sm:items-start gap-4">
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">Alamat Tujuan:</h3>
                        <p className="text-sm">{order.name}</p>
                        <p className="text-sm">{order.address}</p>
                        <p className="text-sm">
                          {order.city}, {order.province}, ID, {order.postalCode}
                        </p>
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-2 font-semibold">
                          Informasi Pengiriman:
                        </h3>
                        <p className="text-sm">
                          Metode: {order.shippingMethod}
                        </p>
                        <p className="text-sm">
                          Pembayaran: {order.Payment?.paymentMethod}
                        </p>
                      </div>
                    </div>
                    <Separator />
                    <ul className="space-y-4">
                      {order.orderProducts.map((op) => (
                        <li key={op.id} className="flex items-center gap-4">
                          <Image
                            src={op.product.images[0]?.imageURL as string}
                            alt={op.product.name}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div className="flex-1">
                            <p className="font-medium">{op.product.name}</p>
                            <p className="text-gray-500 text-sm">
                              Qty: {op.quantity}
                            </p>
                          </div>
                          <p className="font-semibold">
                            Rp{op.product.price.toLocaleString()}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <Separator />
                    <div className="flex justify-between items-center pt-2">
                      <p className="font-semibold text-lg">Total Pesanan:</p>
                      <p className="font-bold text-primary text-xl">
                        Rp{(order.total / 100).toLocaleString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </UserLayout>
  );
}

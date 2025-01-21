import { PictureOrderProofModal } from "@/components/picture-order-proof-modal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatRupiah } from "@/utils/formatRupiah";
import { Order, OrderStatus, PaymentMethod, UserRole } from "@prisma/client";
import Image from "next/image";
import { Fragment } from "react";
import { statusIcons } from "../data/status-icons";
import { statusMessage } from "../data/status-message";
import CardFooterContent from "./card-footer-content";

type TypeFilteredOrders = {
  Payment: { paymentMethod: PaymentMethod } | null;
  orderProducts: {
    id: number;
    quantity: number;
    product: {
      images: {
        imageURL: string;
      }[];
      name: string;
      price: number;
    };
  }[];
} & Order;

type Props = {
  filteredOrders: TypeFilteredOrders[] | undefined;
  setActiveTab: (arg0: OrderStatus) => void;
  activeTab: string;
  refetch: () => void;
  title: string;
  userRole: UserRole;
};

export default function OrderDashboard({
  filteredOrders,
  setActiveTab,
  activeTab,
  refetch,
  title,
  userRole,
}: Props) {
  return (
    <div className="mx-auto min-h-screen p-5">
      <h1 className="mb-6 text-center text-3xl font-bold text-primary">
        {title}
      </h1>
      <Tabs
        defaultValue="PENDING"
        onValueChange={(value) => setActiveTab(value as OrderStatus)}
        className="rounded-lg shadow-lg"
      >
        <TabsList className="flex w-full justify-between gap-1">
          {Object.entries(statusIcons).map(([status, icon]) => (
            <TabsTrigger
              key={status}
              value={status}
              className="flex items-center justify-center gap-2"
            >
              {icon}
              <span className="hidden text-xs sm:inline">{status}</span>
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.values(OrderStatus).map((status) => (
          <TabsContent key={status} value={status}>
            {filteredOrders?.length !== 0 ? (
              <Fragment>
                {filteredOrders?.map((order) => (
                  <Card
                    key={order.id}
                    className="mb-6 overflow-hidden transition-shadow duration-300 hover:shadow-xl"
                  >
                    <CardHeader className="bg-primary/5">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg sm:text-xl">
                          Order #{order.id}
                        </CardTitle>
                        <div className="flex gap-3">
                          <p className="text-green-500">
                            {statusMessage[order.status]}
                            {(activeTab === "DELIVERED" ||
                              activeTab === "COMPLETED") && (
                              <PictureOrderProofModal image={order.image ?? ""}>
                                {order.image && (
                                  <span className="cursor-pointer px-1 text-blue-500">
                                    Lihat Bukti Pengiriman
                                  </span>
                                )}
                              </PictureOrderProofModal>
                            )}
                          </p>
                          <Badge variant="outline" className="text-sm">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-sm sm:text-base">
                        Nomor Resi: {order.receipt ?? "Belum tersedia"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-4">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                        <div className="flex-1">
                          <h3 className="mb-2 font-semibold">Alamat Tujuan:</h3>
                          <p className="text-sm">{order.name}</p>
                          <p className="text-sm">{order.address}</p>
                          <p className="text-sm">
                            {order.city}, {order.province}, ID,{" "}
                            {order.postalCode}
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
                              <p className="text-sm text-gray-500">
                                Qty: {op.quantity}
                              </p>
                            </div>
                            <p className="font-semibold">
                              {formatRupiah(op.product.price)}
                            </p>
                          </li>
                        ))}
                      </ul>
                      <Separator />
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-lg font-semibold">Total Pesanan:</p>
                        <p className="text-xl font-bold text-primary">
                          {formatRupiah(order.total)}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <CardFooterContent
                        order={order}
                        userRole={userRole}
                        refetch={refetch}
                      />
                    </CardFooter>
                  </Card>
                ))}
              </Fragment>
            ) : (
              <Fragment>
                <Card className="py-20 text-center text-muted-foreground">
                  <CardContent>
                    <CardTitle className="text-3xl">
                      Status {activeTab} Is Empty!
                    </CardTitle>
                  </CardContent>
                </Card>
              </Fragment>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

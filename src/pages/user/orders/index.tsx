import Loading from "@/components/loading";
import OrderDashboard from "@/features/dashboard/order/components/order-dashboard";
import { api } from "@/utils/api";
import { OrderStatus, UserRole } from "@prisma/client";
import { useState } from "react";
import UserLayout from "../layout";

export default function OrdersDashboardUser() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");
  const {
    data: orders,
    isLoading,
    refetch,
  } = api.order.getOrderUserId.useQuery();

  const filteredOrders = orders?.filter((order) => order.status === activeTab);

  if (isLoading) return <Loading />;

  return (
    <UserLayout>
      <OrderDashboard
        userRole={UserRole.USER}
        refetch={refetch}
        title={"Pesanan Saya"}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredOrders={filteredOrders}
      />
    </UserLayout>
  );
}

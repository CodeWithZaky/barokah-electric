import Loading from "@/components/loading";
import OrderDashboard from "@/features/dashboard/order/components/order-dashboard";
import { api } from "@/utils/api";
import { OrderStatus, UserRole } from "@prisma/client";
import { useState } from "react";
import DashboardLayout from "../layout";

export default function OrderDashboardAdmin() {
  const [activeTab, setActiveTab] = useState<OrderStatus>("PENDING");

  const { data: orders, isLoading, refetch } = api.order.getOrders.useQuery();

  const filteredOrders = orders?.filter((order) => order.status === activeTab);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <DashboardLayout>
      <OrderDashboard
        userRole={UserRole.ADMIN}
        refetch={refetch}
        title={"Pesanan"}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        filteredOrders={filteredOrders}
      />
    </DashboardLayout>
  );
}

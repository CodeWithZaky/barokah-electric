import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/utils/api";
import { Order, UserRole } from "@prisma/client";
import Link from "next/link";

interface Props {
  order: Order;
  userRole: UserRole;
  refetch: () => void;
}

const CardFooterContent = ({ order, userRole, refetch }: Props) => {
  type StatusOrderAdmin = "PROCESSING" | "PACKED" | "CANCELLED";

  const statusOrderAdmin: StatusOrderAdmin[] = [
    "PROCESSING",
    "PACKED",
    "CANCELLED",
  ];

  const updateOrderStatus = api.order.updateOrderStatus.useMutation({
    onSuccess: () => refetch(),
  });

  const handleStatusChange = async (
    orderId: number,
    newStatus: StatusOrderAdmin,
  ) => {
    await updateOrderStatus.mutateAsync({ orderId, status: newStatus });
  };

  return (
    <>
      {userRole === "ADMIN" ? (
        <>
          {(order.status === "PROCESSING" ||
            order.status === "PACKED" ||
            order.status === "CANCELLED") && (
            <>
              <Select
                onValueChange={(value) =>
                  handleStatusChange(order.id, value as StatusOrderAdmin)
                }
                defaultValue={order.status}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Change status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(statusOrderAdmin).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </>
          )}
          {(order.status === "PENDING" ||
            order.status === "PROCESSING" ||
            order.status === "PACKED" ||
            order.status === "CANCELLED") && (
            <>
              <Button
                className="ml-2"
                variant={"destructive"}
                onClick={() =>
                  updateOrderStatus.mutate({
                    orderId: order.id,
                    status: "CANCELLED",
                  })
                }
              >
                Cancel
              </Button>
            </>
          )}
          {order.status === "RETURN_REQUEST" && (
            <>
              <Button
                className="ml-2"
                variant={"destructive"}
                onClick={() =>
                  updateOrderStatus.mutate({
                    orderId: order.id,
                    status: "RETURNED",
                  })
                }
              >
                Accept Return
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          {order.status === "PENDING" && (
            <Link
              href={`/payment/${order.id}`}
              className="rounded bg-green-500 px-4 py-2 text-white"
            >
              Bayar Sekarang
            </Link>
          )}
          {order.status === "DELIVERED" && (
            <div className="space-x-2">
              <Button
                variant="outline"
                onClick={() =>
                  updateOrderStatus.mutateAsync({
                    orderId: order.id,
                    status: "RETURN_REQUEST",
                  })
                }
              >
                Permintaan Pengembalian
              </Button>
              <Button
                onClick={() =>
                  updateOrderStatus.mutateAsync({
                    orderId: order.id,
                    status: "COMPLETED",
                  })
                }
              >
                Pesanan Selesai
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default CardFooterContent;

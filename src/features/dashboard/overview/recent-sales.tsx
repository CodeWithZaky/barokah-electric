import Loading from "@/components/loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/utils/api";
import { formatRupiah } from "@/utils/formatRupiah";

export function RecentSales() {
  const { data, isLoading } = api.dashboard.getCustomersRecentOrders.useQuery();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="my-3 space-y-8">
      {data?.map((customer) => (
        <div className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={customer.user.image || null || undefined}
              alt="Avatar"
            />
            <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{customer.name}</p>
            <p className="text-sm text-muted-foreground">{customer.email}</p>
          </div>
          <div className="ml-auto font-medium">
            +{formatRupiah(customer.total)}
          </div>
        </div>
      ))}
    </div>
  );
}

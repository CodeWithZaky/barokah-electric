import { Button } from "@/components/ui/button";
import Link from "next/link";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="my-5 flex min-h-screen w-full gap-5">
      <Sidebar />
      <div className="w-full rounded-xl border border-border p-5">
        {children}
      </div>
    </div>
  );
};

export default DashboardLayout;
const Sidebar = () => {
  const LINK_DATA = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Product",
      href: "/dashboard/product",
    },
    {
      name: "Order",
      href: "/dashboard/order",
    },
  ];

  return (
    <div className="flex flex-col gap-7 rounded-xl border border-border p-5">
      {LINK_DATA.map((link) => (
        <Link key={link.name} href={link.href}>
          <Button className="w-full">{link.name}</Button>
        </Link>
      ))}
    </div>
  );
};

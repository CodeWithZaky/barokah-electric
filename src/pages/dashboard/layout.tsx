import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  LayoutDashboardIcon,
  LogOut,
  Package,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="ml-auto w-[80%] overflow-y-auto p-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;

const Sidebar = () => {
  const pathname = usePathname();

  const LINK_DATA = [
    {
      name: "Overview",
      href: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      name: "Produk",
      href: "/dashboard/product",
      icon: Package,
    },
    {
      name: "Pesanan",
      href: "/dashboard/order",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="fixed hidden w-[20%] border-r lg:block">
      <div className="flex min-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <LayoutDashboardIcon className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>
        </div>
        <ScrollArea className="flex-1 px-3">
          <nav className="flex flex-col gap-2 py-4">
            {LINK_DATA.map((link) => (
              <Link key={link.name} href={link.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    pathname === link.href && "bg-muted",
                  )}
                >
                  <link.icon className="h-4 w-4" />
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4">
          <Button variant="outline" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

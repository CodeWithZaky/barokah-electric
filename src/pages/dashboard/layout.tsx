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
    <div className="flex bg-background min-h-screen">
      <Sidebar />
      <main className="ml-auto p-8 w-[80%] overflow-y-auto">{children}</main>
    </div>
  );
};

export default DashboardLayout;

const Sidebar = () => {
  const pathname = usePathname();

  const LINK_DATA = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Products",
      href: "/dashboard/product",
      icon: Package,
    },
    {
      name: "Orders",
      href: "/dashboard/order",
      icon: ShoppingCart,
    },
  ];

  return (
    <div className="lg:block fixed hidden border-r w-[20%]">
      <div className="flex flex-col gap-2 min-h-screen">
        <div className="flex items-center px-6 border-b h-[60px]">
          <Link className="flex items-center gap-2 font-semibold" href="/">
            <LayoutDashboardIcon className="w-6 h-6" />
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
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Button>
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="mt-auto p-4">
          <Button variant="outline" className="justify-start gap-2 w-full">
            <LogOut className="w-4 h-4" />
            Log out
          </Button>
        </div>
      </div>
    </div>
  );
};

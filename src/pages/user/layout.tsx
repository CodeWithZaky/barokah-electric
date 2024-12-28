import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Bell,
  Coins,
  CreditCard,
  MapPin,
  Settings,
  Ticket,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-row">
      <Sidebar />
      <div className="ml-auto w-[80%]">{children}</div>
    </div>
  );
}

const Sidebar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;

  const menuItems = [
    { icon: User, label: "Profil", href: "/user/profile" },
    { icon: CreditCard, label: "Bank & Kartu", href: "/user/payment" },
    { icon: MapPin, label: "Alamat", href: "/user/address" },
    {
      icon: Settings,
      label: "Pengaturan Notifikasi",
      href: "/user/notifications/settings",
    },
    { icon: Settings, label: "Pengaturan Privasi", href: "/user/privacy" },
    { icon: Bell, label: "Pesanan Saya", href: "/user/orders" },
    { icon: Bell, label: "Notifikasi", href: "/user/notifications" },
    { icon: Ticket, label: "Voucher Saya", href: "/user/vouchers" },
    { icon: Coins, label: "Koin Shopee Saya", href: "/user/coins" },
  ];

  return (
    <div className="fixed border-r w-[20%] h-screen">
      <div className="flex items-center space-x-3 p-4 border-b">
        <Avatar className="w-12 h-12">
          <AvatarImage src={user?.image || ""} alt={user?.name || ""} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium">{user?.name}</h3>
          <Link
            href="/user/profile"
            className="text-foreground text-sm hover:text-primary"
          >
            Ubah Profil
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3 py-2">
        {menuItems.map((item, idx) => (
          <ul key={idx}>
            <li key={idx}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4  text-sm ${
                  router.pathname === item.href
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2",
                    router.pathname === item.href && "bg-muted",
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
                {/* <item.icon className="w-4 h-4" />
                <span>{item.label}</span> */}
              </Link>
            </li>
          </ul>
        ))}
      </div>
    </div>
  );
};

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Search from "@/features/search";
import { api } from "@/utils/api";
import { Zap } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const { data: session, status } = useSession();
  const { data: cartCount } = api.cart.getCartCount.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 py-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Zap className="h-6 w-6" />
          <span>BarokahElectric</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Search />
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            aria-label="Shopping Cart"
          >
            <Link href="/cart" className="relative">
              <LuShoppingCart className="h-6 w-6" />
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                {cartCount ? cartCount : 0}
              </span>
              <span className="sr-only">Shopping Cart</span>
            </Link>
          </Button>
          {status === "unauthenticated" ? (
            <div className="flex items-center gap-2">
              <Button size="sm">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={session?.user?.image ?? ""}
                      alt={session?.user?.name ?? "User avatar"}
                    />
                    <AvatarFallback>
                      {session?.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem asChild>
                  <Link href="/user/profile">Profil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/orders">Pesanan</Link>
                </DropdownMenuItem>
                {session?.user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/overview">Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => void signOut()}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

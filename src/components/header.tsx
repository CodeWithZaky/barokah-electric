import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { api } from "@/utils/api";
import { Package } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { LuSearch, LuShoppingCart } from "react-icons/lu";
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
          <Package className="h-6 w-6" />
          <span>BarokahElectric</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="w-full max-w-sm items-center md:flex">
            <form className="relative">
              <LuSearch
                className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search products..."
                className="w-full appearance-none bg-transparent pl-8 md:w-[300px] lg:w-[300px]"
              />
            </form>
          </div>
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
              <Button onClick={() => void signIn()} size="sm">
                Login
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
                      src={
                        session?.user?.image ?? "https://github.com/shadcn.png"
                      }
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
                  <Link href="/user/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/user/orders">Orders</Link>
                </DropdownMenuItem>
                {session?.user?.role === "ADMIN" && (
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
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

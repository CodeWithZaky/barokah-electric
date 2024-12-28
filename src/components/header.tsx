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
import { usePathname } from "next/navigation";
import { LuSearch, LuShoppingCart } from "react-icons/lu";
import { ModeToggle } from "./mode-toggle";

const Header = () => {
  const { data: session, status } = useSession();
  const { data: cartCount, refetch } = api.cart.getCartCount.useQuery();

  const pathname = usePathname();

  // if (pathname.startsWith("/dashboard")) {
  //   return null;
  // }

  return (
    <header className="top-0 z-50 sticky bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 border-b w-full">
      <div className="flex items-center h-16 container">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Package className="w-6 h-6" />
          <span>BarokahElectric</span>
        </Link>
        <div className="flex flex-1 justify-end items-center space-x-4">
          <div className="md:flex items-center w-full max-w-sm">
            <form className="relative">
              <LuSearch
                className="top-2.5 left-2.5 absolute w-4 h-4 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                type="search"
                placeholder="Search products..."
                className="bg-transparent pl-8 w-full md:w-[300px] lg:w-[300px] appearance-none"
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
              <LuShoppingCart className="w-6 h-6" />
              <span className="-top-2 -right-2 absolute flex justify-center items-center bg-primary rounded-full w-5 h-5 text-primary-foreground text-xs">
                {cartCount}
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
                  className="relative rounded-full w-8 h-8"
                >
                  <Avatar className="w-8 h-8">
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

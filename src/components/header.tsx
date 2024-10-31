import Search from "@/features/search";
import Link from "next/link";
import { LuShoppingCart } from "react-icons/lu";
import { Avatar } from "./avatar";
import { Button } from "./ui/button";

import { signIn, signOut, useSession } from "next-auth/react";

const Header = () => {
  const session = useSession();

  return (
    <div className="mb-7 mt-5 flex w-full flex-col items-center">
      <div className="flex w-full items-center justify-between p-4">
        <div>
          <Link href="/">BarokahElektrik</Link>
        </div>
        <Search />
        <div className="flex items-center justify-end gap-7">
          <div className="relative">
            <LuShoppingCart className="text-3xl" />
            <p className="absolute -right-3 -top-2 rounded-full border-2 border-background bg-foreground px-1 text-sm text-background">
              99
            </p>
          </div>
          {session.status === "unauthenticated" ? (
            <div className="flex gap-3">
              <Avatar image="https://github.com/shadcn.png" alt="cn" />
              <Button onClick={() => signOut()}>Logout</Button>
            </div>
          ) : (
            <div className="space-x-3">
              <Button onClick={() => signIn()}>Login</Button>
              <Button variant={"outline"}>Register</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Header;

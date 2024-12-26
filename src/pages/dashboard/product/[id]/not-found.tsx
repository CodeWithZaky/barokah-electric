import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ProductNotFound() {
  return (
    <div className="flex flex-col justify-center items-center bg-gray-100 min-h-screen">
      <h1 className="mb-4 font-bold text-4xl">Product Not Found</h1>
      <p className="mb-8 text-xl">
        Sorry, we couldn't find the product you're looking for.
      </p>
      <Button asChild>
        <Link href="/dashboard/product">Back to Products</Link>
      </Button>
    </div>
  );
}

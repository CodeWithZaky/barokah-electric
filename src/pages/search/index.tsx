import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { LuCreditCard, LuShoppingCart } from "react-icons/lu";

export default function SearchPage() {
  const { status } = useSession();

  const params = new URLSearchParams(window.location.search);
  const searchProduct = params.get("query");

  const { data: products, status: productStatus } = api.product.search.useQuery(
    {
      query: searchProduct || "",
    },
    {
      enabled: !!searchProduct,
    },
  );

  console.log(products);

  const { toast } = useToast();

  const { refetch: refetchCart } = api.cart.getCart.useQuery(undefined, {
    enabled: status === "authenticated",
  });

  const addItem = api.cart.addItem.useMutation({
    onSuccess: () => {
      refetchCart();
      toast({
        title: "Product added to cart",
        description: "The product has been successfully added to your cart.",
      });
    },
  });

  if (productStatus === "pending") {
    return <Loading />;
  }

  if (products?.length === 0) {
    return (
      <Card className="mx-auto my-5 flex h-[300px] w-fit items-center justify-center px-20">
        <CardContent>
          <h1 className="text-center text-2xl font-bold">
            Produk Tidak Ditemukan
          </h1>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <main className="container mx-auto flex flex-col gap-5 py-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={
                    product.images[0]
                      ? product.images[0].imageURL
                      : "/placeholder.svg"
                  }
                  alt={product.name}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <h2 className="mb-2 text-lg font-semibold">{product.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    stock : {product.stock}
                  </p>
                  <p className="text-xl font-bold text-green-700">
                    Rp
                    {product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="mt-4 flex justify-between gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      addItem.mutate({
                        productId: product.id,
                        quantity: 1,
                      })
                    }
                  >
                    <LuShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/checkout/${product.id}`}>
                      <LuCreditCard className="mr-2 h-4 w-4" />
                      Buy Now
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

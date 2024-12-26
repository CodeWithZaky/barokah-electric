import { CarouselProduct } from "@/components/carousel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { LuCreditCard, LuShoppingCart } from "react-icons/lu";

export default function Home() {
  const products = api.product.getAll.useQuery();

  const { toast } = useToast();

  const { refetch: refetchCart } = api.cart.getCart.useQuery();

  const addItem = api.cart.addItem.useMutation({
    onSuccess: () => {
      refetchCart();
      toast({
        title: "Product added to cart",
        description: "The product has been successfully added to your cart.",
      });
    },
  });

  return (
    <>
      <Head>
        <title>Product Listing - Your Store Name</title>
        <meta name="description" content="Browse our wide range of products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col gap-5 mx-auto py-8 container">
        <CarouselProduct />
        <h1 className="mt-8 font-bold text-3xl">Our Products</h1>
        <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.data?.map((product) => (
            <Card
              key={product.id}
              className="flex flex-col hover:shadow-lg transition-shadow overflow-hidden"
            >
              <div className="relative w-full h-48 overflow-hidden">
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
              <div className="flex flex-col flex-1 justify-between p-4">
                <div>
                  <h2 className="mb-2 font-semibold text-lg">{product.name}</h2>
                  <p className="font-bold text-green-700 text-xl">
                    Rp{product.price.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="flex justify-between gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() =>
                      addItem.mutate({ productId: product.id, quantity: 1 })
                    }
                  >
                    <LuShoppingCart className="mr-2 w-4 h-4" />
                    Add to Cart
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/checkout?id=${product.id}`}>
                      <LuCreditCard className="mr-2 w-4 h-4" />
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

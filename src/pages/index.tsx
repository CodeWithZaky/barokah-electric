import CardProduct from "@/components/card-product";
import { CarouselProduct } from "@/components/carousel";
import Loading from "@/components/loading";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { Fragment } from "react";

export default function Home() {
  const { status } = useSession();

  const { data: products, status: productStatus } =
    api.product.getAll.useQuery();

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

  return (
    <>
      <Head>
        <title>Product Listing - Your Store Name</title>
        <meta name="description" content="Browse our wide range of products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto flex flex-col gap-5 py-8">
        <CarouselProduct />
        <h1 className="mt-8 text-3xl font-bold">Produk Terbaru</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products?.map((product) => (
            <Fragment key={product.id}>
              <CardProduct product={product} addItem={addItem} />
            </Fragment>
          ))}
        </div>
      </main>
    </>
  );
}

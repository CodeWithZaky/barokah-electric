import CardProduct from "@/components/card-product";
import Loading from "@/components/loading";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { Fragment } from "react";

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
            <Fragment key={product.id}>
              <CardProduct product={product} addItem={addItem} />
            </Fragment>
          ))}
        </div>
      </main>
    </>
  );
}

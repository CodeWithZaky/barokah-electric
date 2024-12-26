import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { api } from "@/utils/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import DashboardLayout from "../../layout";

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = parseInt(params.id, 10);

  if (isNaN(productId)) {
    notFound();
  }

  // try {
  const { data: product } = await api.product.getById.useQuery({
    id: productId,
  });

  return (
    <DashboardLayout>
      <div className="mx-auto py-8 container">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="font-bold text-3xl">
              {product?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              {product?.images.map((image, index) => (
                <Image
                  key={index}
                  src={image.imageURL}
                  alt={`${product?.name} - Image ${index + 1}`}
                  width={300}
                  height={300}
                  className="rounded-lg object-cover"
                />
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl">Description</h2>
              <p className="text-gray-600">{product?.description}</p>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h2 className="font-semibold text-xl">Price</h2>
                <p className="font-bold text-2xl text-green-600">
                  ${product?.price.toFixed(2)}
                </p>
              </div>
              <Badge variant={product?.published ? "default" : "secondary"}>
                {product?.published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold text-xl">Rating</h2>
              <div className="flex items-center">
                <span className="mr-2 font-bold text-2xl">
                  {product?.rate.toFixed(1)}
                </span>
                <span className="text-yellow-500">
                  {"★".repeat(Math.round(Number(product?.rate)))}
                </span>
                <span className="text-gray-300">
                  {"★".repeat(5 - Math.round(Number(product?.rate)))}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
  // } catch (error: any) {
  //   if (error.code === "NOT_FOUND") {
  //     notFound();
  //   }
  //   throw error;
  // }
}

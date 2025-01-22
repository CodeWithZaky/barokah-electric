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

  const { data: product } = api.product.getById.useQuery({
    id: productId,
  });

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8">
        <Card className="mx-auto max-w-3xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">
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
              <h2 className="text-xl font-semibold">Description</h2>
              <p className="text-gray-600">{product?.description}</p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Price</h2>
                <p className="text-2xl font-bold text-green-600">
                  ${product?.price.toFixed(2)}
                </p>
              </div>
              <Badge variant={product?.published ? "default" : "secondary"}>
                {product?.published ? "Published" : "Draft"}
              </Badge>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Rating</h2>
              <div className="flex items-center">
                <span className="mr-2 text-2xl font-bold">
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
}

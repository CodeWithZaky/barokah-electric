import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import useProductIdStore from "@/stores/productId-store";
import { api } from "@/utils/api";
import { UploadButton } from "@/utils/uploadthing";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "./ui/use-toast";

const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(),
  rate: z.number().min(0).max(5),
  published: z.boolean().default(false),
  images: z.array(
    z.object({
      imageURL: z.string().url(),
    }),
  ),
});

export default function ProductForm() {
  const [formData, setFormData] = useState<z.infer<typeof productSchema>>({
    name: "",
    description: "",
    price: 0,
    rate: 0,
    published: true,
    images: [],
  });

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      });
    },
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
    },
  });

  const productId = useProductIdStore((state) => state.productId);

  const { data: productById } = api.product.getById.useQuery(
    {
      id: productId as number,
    },
    {
      enabled: productId !== null,
    },
  );

  useEffect(() => {
    if (productById) {
      setFormData({
        name: productById.name || "",
        description: productById.description || "",
        price: productById.price || 0,
        rate: productById.rate || 0,
        published: productById.published || true,
        images: productById.images || [],
      });
    }
  }, [productById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (productId) {
      updateProduct.mutate({ id: productId, ...formData });
    } else {
      createProduct.mutate(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | boolean,
  ) => {
    if (typeof e === "boolean") {
      setFormData((prev) => ({ ...prev, published: e }));
    } else {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? parseFloat(value) : value,
      }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{productId ? "Edit Product" : "Create Product"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex flex-col gap-5">
            <Label htmlFor="images">Images</Label>
            <div>
              {formData.images.length <= 0 ? (
                <div className="h-[200px] w-[200px] rounded-lg bg-gray-700/80" />
              ) : (
                formData.images.map((image, index) => (
                  <div key={index}>
                    <Image
                      src={image.imageURL}
                      alt="gambar"
                      width={100}
                      height={100}
                    />
                  </div>
                ))
              )}
            </div>
            <UploadButton
              appearance={{
                button: "bg-foreground dark:text-background",
              }}
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  const newImage = {
                    imageURL: res[0]?.url || "",
                  };
                  setFormData((prev) => ({
                    ...prev,
                    images: [...prev.images, newImage],
                  }));
                }
              }}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={formData.published}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="published">Published</Label>
          </div>
          <Button type="submit">
            {productId ? "Update Product" : "Create Product"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

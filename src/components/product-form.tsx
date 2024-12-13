import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/utils/api";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";
import { z } from "zod";

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

const initialFormData: z.infer<typeof productSchema> = {
  name: "",
  description: "",
  price: 0,
  rate: 0,
  published: false,
  images: [],
};

export default function ProductForm({
  productId = null,
}: {
  productId?: number | null;
}) {
  const [formData, setFormData] =
    useState<z.infer<typeof productSchema>>(initialFormData);
  const createProduct = api.product.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    createProduct.mutateAsync(formData);
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
          <div>
            <Label htmlFor="rate">Rate</Label>
            <Input
              id="rate"
              name="rate"
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.rate}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="images">Images</Label>
            <UploadButton
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
                // Do something with the error.
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

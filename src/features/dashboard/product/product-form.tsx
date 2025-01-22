import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { UploadButton } from "@/utils/uploadthing";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string(),
  price: z.number().positive(),
  rate: z.number().min(0).max(5),
  stock: z.number().positive(),
  published: z.boolean().default(false),
  images: z.array(
    z.object({
      imageURL: z.string().url(),
    }),
  ),
});

interface ProductFormProps {
  productId: number | null;
  onClose: () => void;
  onProductCreated: () => void;
}

export default function ProductForm({
  productId,
  onClose,
  onProductCreated,
}: ProductFormProps) {
  const [formData, setFormData] = useState<z.infer<typeof productSchema>>({
    name: "",
    description: "",
    price: 0,
    rate: 0,
    stock: 0,
    published: true,
    images: [],
  });

  const { toast } = useToast();

  const createProduct = api.product.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Product created",
        description: "The product has been successfully created.",
      });
      onProductCreated();
      onClose();
    },
  });

  const updateProduct = api.product.update.useMutation({
    onSuccess: () => {
      toast({
        title: "Product updated",
        description: "The product has been successfully updated.",
      });
      onClose();
    },
  });

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
        name: productById.name ?? "",
        description: productById.description ?? "",
        price: productById.price ?? 0,
        rate: productById.rate ?? 0,
        stock: productById.stock ?? 0,
        published: productById.published ?? true,
        images: productById.images ?? [],
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

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="flex h-[90vh] max-w-[80vw] flex-col">
        <DialogHeader className="h-fit">
          <DialogTitle>
            {productId ? "Edit Product" : "Create Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex h-full w-full gap-5">
          <div className="flex w-1/2 flex-col justify-between gap-3">
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
                className="h-[200px]"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
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
          </div>
          <div className="flex w-1/2 flex-col justify-between gap-3">
            <div className="space-y-2">
              <Label htmlFor="images">Images</Label>
              <div className="flex flex-wrap gap-2">
                {formData.images.length > 0 ? (
                  <>
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <Image
                          src={image.imageURL}
                          alt="Product"
                          width={150}
                          height={150}
                          className="rounded-md bg-gray-500"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -right-2 -top-2 h-6 w-6"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X size={12} />
                        </Button>
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <div className="h-[150px] w-[150px] animate-pulse rounded-md bg-gray-500" />
                    </div>
                  </>
                )}
              </div>
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
                  toast({
                    title: "Upload Error",
                    description: error.message,
                    variant: "destructive",
                  });
                }}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="published"
                  checked={formData.published}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="published">Published</Label>
              </div>
              <Button type="submit" className="w-full">
                {productId ? "Update Product" : "Create Product"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

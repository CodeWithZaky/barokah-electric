import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { formatRupiah } from "@/utils/formatRupiah";
import { Edit, Trash2 } from "lucide-react";
import Image from "next/image";
import React from "react";

interface ProductListProps {
  onEdit: (productId: number) => void;
  onRefetchNeeded: (refetchFunction: () => void) => void;
}

export default function ProductList({
  onEdit,
  onRefetchNeeded,
}: ProductListProps) {
  const { data: products, refetch } = api.product.getAll.useQuery();
  const { toast } = useToast();

  const deleteProduct = api.product.delete.useMutation({
    onSuccess: () => {
      toast({
        title: "Product deleted",
        description: "The product has been successfully deleted.",
      });
      refetch();
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct.mutate({ id });
    }
  };

  React.useEffect(() => {
    onRefetchNeeded(refetch);
  }, [onRefetchNeeded, refetch]);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Gambar</TableHead>
            <TableHead>Nama</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Publik</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products?.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {product.images[0] && (
                  <Image
                    src={product.images[0].imageURL}
                    alt={product.name}
                    width={50}
                    height={50}
                    className="rounded-md"
                  />
                )}
              </TableCell>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>{formatRupiah(product.price)}</TableCell>
              <TableCell>{product.published ? "Iya" : "Tidak"}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(product.id)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

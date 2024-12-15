"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { api } from "@/utils/api";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const { data: products, refetch } = api.product.getAll.useQuery();

  const router = useRouter();

  // useEffect(() => {
  //   router.push(`?id=${selectedProduct}`);
  // }, [selectedProduct]);

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product List</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedProduct(product.id)}
                    className="mr-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

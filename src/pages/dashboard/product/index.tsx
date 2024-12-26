import { Button } from "@/components/ui/button";
import ProductForm from "@/features/management-product/product-form";
import ProductList from "@/features/management-product/product-list";
import { PlusIcon } from "lucide-react";
import { useCallback, useState } from "react";
import DashboardLayout from "../layout";

export default function ProductsDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [refetchProducts, setRefetchProducts] = useState<(() => void) | null>(
    null,
  );

  const openModal = (productId: number | null = null) => {
    setEditingProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
  };

  const handleProductCreated = useCallback(() => {
    if (refetchProducts) {
      refetchProducts();
    }
  }, [refetchProducts]);

  const handleRefetchNeeded = useCallback((refetchFunction: () => void) => {
    setRefetchProducts(() => refetchFunction);
  }, []);

  return (
    <DashboardLayout>
      <div className="mx-auto py-8 container">
        <div className="flex justify-between items-center mb-8">
          <h1 className="font-bold text-3xl">Product Management</h1>
          <Button
            onClick={() => openModal()}
            className="flex items-center gap-2"
          >
            <PlusIcon size={20} />
            Add Product
          </Button>
        </div>
        <ProductList onEdit={openModal} onRefetchNeeded={handleRefetchNeeded} />
        {isModalOpen && (
          <ProductForm
            productId={editingProductId}
            onClose={closeModal}
            onProductCreated={handleProductCreated}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

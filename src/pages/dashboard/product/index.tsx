import ProductForm from "@/features/management-product/product-form";
import ProductList from "@/features/management-product/product-list";
import DashboardLayout from "../layout";

export default function ProductsDashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto py-5 min-h-screen container">
        <h1 className="mb-8 font-bold text-4xl">Product Management</h1>
        <div className="gap-8 grid grid-cols-1 md:grid-cols-2">
          <ProductList />
          <ProductForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

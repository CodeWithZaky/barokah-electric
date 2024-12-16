import ProductForm from "@/components/product-form";
import ProductList from "@/components/product-list";
import DashboardLayout from "../layout";

export default function ProductsDashboard() {
  return (
    <DashboardLayout>
      <div className="container mx-auto min-h-screen py-5">
        <h1 className="mb-8 text-4xl font-bold">Product Management</h1>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <ProductList />
          <ProductForm />
        </div>
      </div>
    </DashboardLayout>
  );
}

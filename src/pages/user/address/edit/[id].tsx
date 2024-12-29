import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import UserLayout from "@/pages/user/layout";
import { api } from "@/utils/api";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditAddressPage() {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  const { data: address, isLoading: isAddressLoading } =
    api.address.getAddressById.useQuery({ id: Number(id) }, { enabled: !!id });

  const updateAddress = api.address.updateAddress.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Alamat berhasil diperbarui.",
      });
      router.push("/user/address");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  });

  useEffect(() => {
    if (address) {
      setFormData({
        id: Number(address.id),
        name: address.name,
        phone: address.phone,
        email: address.email,
        address: address.address,
        city: address.city,
        postalCode: address.postalCode,
        province: address.province,
      });
    }
  }, [address]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateAddress.mutateAsync(formData);
    setIsLoading(false);
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  if (isAddressLoading) {
    return (
      <UserLayout>
        <Loading />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-2xl rounded-lg shadow">
          <div className="border-b p-6">
            <h1 className="text-xl font-medium">Edit Alamat</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Penerima</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Kota/Kabupaten</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="postalCode">Kode Pos</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                name="province"
                value={formData.province}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="flex justify-end gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Batal
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-primary hover:bg-primary/90"
              >
                {isLoading ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </UserLayout>
  );
}

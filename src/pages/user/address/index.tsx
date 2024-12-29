import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import UserLayout from "@/pages/user/layout";
import { api } from "@/utils/api";
import { MapPin, Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function AddressPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const { toast } = useToast();

  const {
    data: address,
    isLoading,
    refetch,
  } = api.address.getAddressByUserId.useQuery(undefined, {
    enabled: !!session,
  });

  const setPrimaryAddress = api.address.setPrimaryAddress.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Alamat utama berhasil diperbarui.",
      });
    },
  });

  const handleSetPrimary = async (id: number) => {
    if (address) {
      await setPrimaryAddress.mutateAsync({ id });
      await refetch();
    }
  };

  const deleteAddress = api.address.deleteAddress.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Alamat berhasil dihapus.",
      });
    },
  });

  const handleDelete = async (id: number) => {
    if (address) {
      if (window.confirm("Apakah Anda yakin ingin menghapus alamat ini?")) {
        await deleteAddress.mutateAsync({ id });
      }
    }
  };

  if (status === "unauthenticated") {
    router.push("/login");
    return null;
  }

  return (
    <UserLayout>
      <div className="flex-1 p-6">
        <div className="mx-auto max-w-4xl rounded-lg shadow">
          <div className="flex items-center justify-between p-6">
            <h1 className="text-xl font-medium">Alamat Saya</h1>
            <Button
              onClick={() => router.push("/user/address/new")}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Tambah Alamat Baru
            </Button>
          </div>

          {isLoading ? (
            <Loading />
          ) : address ? (
            <div>
              {address.map((item, index) => (
                <div className="p-6" key={index}>
                  <div className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.name}</span>
                          <span className="text-gray-500">|</span>
                          <span className="text-gray-500">{item.phone}</span>
                        </div>
                        <div className="text-gray-600">{item.address}</div>
                        <div className="text-gray-600">
                          {item.city}, {item.province} {item.postalCode}
                        </div>
                        {item.isPrimary && (
                          <div className="mt-2 inline-block rounded border border-primary px-2 py-1 text-xs text-primary">
                            Utama
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        <Button
                          variant="link"
                          className="text-primary"
                          onClick={() =>
                            router.push(`/user/address/edit/${item.id}`)
                          }
                        >
                          Ubah
                        </Button>
                        <Button
                          variant="link"
                          className="text-destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                    {!item.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4"
                        onClick={() => handleSetPrimary(item.id)}
                      >
                        Atur sebagai utama
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <MapPin className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">Belum ada alamat tersimpan</p>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
}

import { Button } from "@/components/ui/button";
import { api } from "@/utils/api";
import Link from "next/link";
import { LuFileEdit, LuMapPin } from "react-icons/lu";

export function AddressSection() {
  const { data: primaryAddress } = api.address.getPrimaryAddress.useQuery();

  return (
    <div className="rounded-lg p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-2">
          <LuMapPin className="h-5 w-5 text-primary" />
          <span className="font-medium">Alamat Pengiriman</span>
        </div>
        <div className="space-x-2">
          <Link href="/user/address">
            <Button variant="outline" size="sm">
              Pilih Alamat
            </Button>
          </Link>
          <Link href="/user/address/new">
            <Button variant="ghost" size="sm" className="text-primary">
              <LuFileEdit className="mr-2 h-4 w-4" />
              Tambah Alamat Baru
            </Button>
          </Link>
        </div>
      </div>
      {primaryAddress && (
        <div className="space-y-2">
          <p>{primaryAddress.address}</p>
          <p>{primaryAddress.city}</p>
          <p>{primaryAddress.province}</p>
          <p>{primaryAddress.postalCode}</p>
        </div>
      )}
    </div>
  );
}

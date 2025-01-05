import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";

export function PictureOrderProofModal({
  image,
  children,
}: {
  image?: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Image
          src={image ?? ""}
          width={300}
          height={300}
          alt="bukti pengiriman"
          className="bg-gray-500/50 object-cover"
        />
      </DialogContent>
    </Dialog>
  );
}

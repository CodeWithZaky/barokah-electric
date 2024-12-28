import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/utils/api";
import { UploadButton } from "@/utils/uploadthing";
import { useState } from "react";

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    name?: string;
    email?: string;
    image?: string;
  };
}

export default function UpdateProfileModal({
  isOpen,
  onClose,
  userData,
}: UpdateProfileModalProps) {
  const [formData, setFormData] = useState({
    name: userData.name || "",
    email: userData.email || "",
    image: userData.image || "",
  });

  const { toast } = useToast();

  const updateUser = api.user.updateUserById.useMutation({
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profil berhasil diperbarui.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateUser.mutateAsync(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ubah Profil</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24">
              <AvatarImage src={formData?.image || ""} alt={formData.name} />
              <AvatarFallback>{formData?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={(res) => {
                if (res) {
                  setFormData((prev) => ({
                    ...prev,
                    image: res[0]?.url || prev.image,
                  }));
                  toast({
                    title: "Success",
                    description: "Foto profil berhasil diunggah.",
                  });
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
          <div className="space-y-2">
            <Label htmlFor="name">Nama</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
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
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={updateUser.isPending}>
              {updateUser.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

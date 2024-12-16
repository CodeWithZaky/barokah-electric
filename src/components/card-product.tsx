import Image from "next/image";
import { Card } from "./ui/card";

const CardProduct = (product: any) => {
  const { name, price, description, image } = product;

  return (
    <Card className="flex flex-col gap-1 text-wrap pb-2">
      <Image src={image} alt="gambar" />
      <div className="space-y-1 text-wrap px-2 text-sm">
        <p className="text-green-700">Rp{price.toLocaleString("id-ID")}</p>
        {/* <p>{name.length > 30 ? name.slice(0, 30) + "..." : name}</p> */}
        <p>{name}</p>
        <div className="flex justify-between">
          <p className="rounded-md border bg-primary px-2 text-background">
            +cart
          </p>
          <p className="rounded-md border bg-primary px-2 text-background">
            buy now
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CardProduct;

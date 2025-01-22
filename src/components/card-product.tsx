import Image from "next/image";
import Link from "next/link";
import { LuCreditCard, LuShoppingCart } from "react-icons/lu";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface Props {
  addItem: {
    mutate: ({
      productId,
      quantity,
    }: {
      productId: number;
      quantity: number;
    }) => void;
  };
  product: {
    id: number;
    images: {
      imageURL: string;
    }[];
    name: string;
    stock: number;
    price: number;
  };
}

function CardProduct({ product, addItem }: Props) {
  return (
    <Card
      key={product.id}
      className="flex flex-col overflow-hidden transition-shadow hover:shadow-lg"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={product.images[0] ? product.images[0].imageURL : ""}
          alt={product.name ?? "product name"}
          layout="fill"
          objectFit="cover"
          className="transition-transform hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <h2 className="mb-2 text-lg font-semibold">{product.name}</h2>
          <p className="text-sm text-muted-foreground">
            stock : {product.stock}
          </p>
          <p className="text-xl font-bold text-green-700">
            Rp
            {product.price.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="mt-4 flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() =>
              addItem.mutate({
                productId: product.id,
                quantity: 1,
              })
            }
          >
            <LuShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button asChild size="sm" className="flex-1">
            <Link href={`/checkout/${product.id}`}>
              <LuCreditCard className="mr-2 h-4 w-4" />
              Buy Now
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CardProduct;

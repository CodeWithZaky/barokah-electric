import amd9000 from "@/assets/banners/AMD-9000.jpg";
import huaweiOfficialStore from "@/assets/banners/huawei-official-store.jpg";
import infinix from "@/assets/banners/infinix.jpg";
import megaEelectro from "@/assets/banners/mega-electro.jpg";
import { StaticImageData } from "next/image";

type Banners = {
  src: StaticImageData;
  alt: string;
};

export const BANNERS: Banners[] = [
  {
    src: amd9000,
    alt: "AMD 9000",
  },
  {
    src: huaweiOfficialStore,
    alt: "Huawei Official Store",
  },
  {
    src: infinix,
    alt: "Infinix",
  },
  {
    src: megaEelectro,
    alt: "Mega Electro",
  },
];

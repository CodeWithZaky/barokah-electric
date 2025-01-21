import {
  Box,
  CheckCircle,
  Clock,
  Package,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";

const iconsStyle = "h-2 w-2";

export const statusIcons = {
  PENDING: <Clock className={iconsStyle} />,
  PROCESSING: <Package className={iconsStyle} />,
  PACKED: <Box className={iconsStyle} />,
  SHIPPED: <Truck className={iconsStyle} />,
  DELIVERED: <ShoppingBag className={iconsStyle} />,
  RETURN_REQUEST: <ShoppingBag className={iconsStyle} />,
  RETURNED: <ShoppingBag className={iconsStyle} />,
  COMPLETED: <CheckCircle className={iconsStyle} />,
  CANCELLED: <XCircle className={iconsStyle} />,
};

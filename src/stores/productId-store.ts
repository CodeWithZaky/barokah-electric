import { create } from "zustand";

export type ProductIdState = {
  productId: number | null;
};

export type ProductIdActions = {
  setProductId: (productId: number) => void;
};

export type ProductIdStore = ProductIdState & ProductIdActions;

export const defaultProductIdState: ProductIdState = {
  productId: null,
};

const useProductIdStore = create<ProductIdStore>((set) => ({
  productId: defaultProductIdState.productId,
  setProductId: (productId) => set({ productId }),
}));

export default useProductIdStore;

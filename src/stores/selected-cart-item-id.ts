import { create } from "zustand";

export type SelectedItemState = {
  selectedItems: number[]; // Array untuk menyimpan ID
};

export type SelectedItemActions = {
  setSelectedItems: (items: number[]) => void; // Set seluruh item yang dipilih
  toggleItemSelection: (itemId: number) => void; // Tambah atau hapus item dari array
  clearSelection: () => void; // Kosongkan semua item
};

export type SelectedItemStore = SelectedItemState & SelectedItemActions;

export const defaultSelectedItemState: SelectedItemState = {
  selectedItems: [], // Default array kosong
};

const useSelectedItemStore = create<SelectedItemStore>((set) => ({
  selectedItems: defaultSelectedItemState.selectedItems,

  setSelectedItems: (items) => set({ selectedItems: items }),

  toggleItemSelection: (itemId) =>
    set((state) => {
      const isAlreadySelected = state.selectedItems.includes(itemId);
      return {
        selectedItems: isAlreadySelected
          ? state.selectedItems.filter((id) => id !== itemId) // Hapus jika ada
          : [...state.selectedItems, itemId], // Tambahkan jika belum ada
      };
    }),

  clearSelection: () => set({ selectedItems: [] }),
}));

export default useSelectedItemStore;

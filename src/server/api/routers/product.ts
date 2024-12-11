import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const productRoute = createTRPCRouter({
  postProduct: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        price: z.string(),
        images: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, description, images, price } = input;
      try {
        const productData = { name, description, images, price };

        return {
          type: "success",
          massage: "product succesfully created",
        };
      } catch (error) {
        return {
          type: "failed",
          massage: "product failed created",
        };
      }
    }),
});

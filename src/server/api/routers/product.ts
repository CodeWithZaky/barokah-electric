import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const productRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string(),
        price: z.number().positive(),
        rate: z.number().min(0).max(5),
        published: z.boolean().default(false),
        images: z.array(
          z.object({
            imageURL: z.string().url(),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const product = await ctx.db.product.create({
        data: {
          name: input.name,
          description: input.description,
          price: Number(input.price),
          rate: Number(input.rate),
          published: input.published,
          userId: userId,
          images: {
            create: input.images,
          },
        },
      });

      return product;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
        include: {
          images: true,
        },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      return product;
    }),

  getAll: publicProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.product.findMany({
      include: {
        images: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return products;
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        price: z.number().positive().optional(),
        rate: z.number().min(0).max(5).optional(),
        published: z.boolean().optional(),
        images: z
          .array(
            z.object({
              id: z.number().optional(),
              imageURL: z.string().url(),
            }),
          )
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (product.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to update this product",
        });
      }

      const updatedProduct = await ctx.db.product.update({
        where: { id: input.id },
        data: {
          name: input.name,
          description: input.description,
          price: Number(input.price),
          rate: Number(input.rate),
          published: input.published,
          images: input.images
            ? {
                deleteMany: {},
                create: input.images,
              }
            : undefined,
        },
      });

      return updatedProduct;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const product = await ctx.db.product.findUnique({
        where: { id: input.id },
      });

      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }

      if (product.userId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this product",
        });
      }

      await ctx.db.product.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});

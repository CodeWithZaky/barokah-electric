import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const addressRouter = createTRPCRouter({
  creteAddress: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string(),
        city: z.string(),
        postalCode: z.string(),
        province: z.string(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.address.create({
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          address: input.address,
          city: input.city,
          postalCode: input.postalCode,
          province: input.province,
          userId,
        },
      });
    }),

  updateAddress: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string(),
        phone: z.string(),
        email: z.string().email(),
        address: z.string(),
        city: z.string(),
        postalCode: z.string(),
        province: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const address = await ctx.db.address.findFirst({
        where: { id: input.id, userId },
      });

      if (!address) {
        throw new Error("Address not found");
      }

      return ctx.db.address.update({
        where: { id: input.id },
        data: {
          name: input.name,
          phone: input.phone,
          email: input.email,
          address: input.address,
          city: input.city,
          postalCode: input.postalCode,
          province: input.province,
        },
      });
    }),

  deleteAddress: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const address = await ctx.db.address.findFirst({
        where: { id: input.id, userId },
      });

      if (!address) {
        throw new Error("Address not found");
      }

      return ctx.db.address.delete({
        where: { id: input.id },
      });
    }),

  setPrimaryAddress: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // First, unset all primary addresses
      await ctx.db.address.updateMany({
        where: { userId },
        data: { isPrimary: false },
      });

      // Then set the selected address as primary
      return ctx.db.address.update({
        where: { id: input.id },
        data: { isPrimary: true },
      });
    }),

  getAddressByUserId: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db.address.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        address: true,
        city: true,
        postalCode: true,
        province: true,
        isPrimary: true,
      },
      where: { userId },
      orderBy: { isPrimary: "desc" },
    });
  }),

  getAddressById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const address = await ctx.db.address.findFirst({
        where: { id: input.id, userId },
      });

      if (!address) {
        throw new Error("Address not found");
      }

      return address;
    }),

  getPrimaryAddress: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.session.user.id;
    return ctx.db.address.findFirst({
      where: { userId, isPrimary: true },
    });
  }),
});

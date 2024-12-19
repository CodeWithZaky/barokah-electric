import { receiptGenerator } from "@/utils/receiptGenerator";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  // Create Order
  createOrder: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        lastname: z.string(),
        phone: z.string(),
        email: z.string(),
        company: z.string(),
        adress: z.string(),
        apartment: z.string(),
        postalCode: z.string(),
        city: z.string(),
        country: z.string(),
        orderNotice: z.string().optional(),
        receipt: z.string().optional(),
        total: z.number(),
        products: z.array(
          z.object({
            productId: z.number(),
            quantity: z.number().min(1),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Buat data `order` tanpa menyertakan properti `products`
      const { products, ...orderData } = input;
      const userId = ctx.session.user.id;
      const receiptNumber = receiptGenerator();

      // Buat `order` baru dengan relasi ke `orderProducts`
      const order = await ctx.db.order.create({
        data: {
          ...orderData,
          userId,
          receipt: receiptNumber,
          orderProducts: {
            create: products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          },
        },
        include: {
          orderProducts: { include: { product: true } },
        },
      });

      return order;
    }),

  // Get All Orders
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      include: {
        orderProducts: {
          include: { product: true },
        },
      },
    });

    return orders;
  }),

  // Get Order by ID
  getOrderById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const orders = await ctx.db.order.findMany({
        where: { userId },
        include: {
          orderProducts: {
            include: { product: true },
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return orders;
    }),

  // Update Order Status
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        status: z.nativeEnum(OrderStatus),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updatedOrder = await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: input.status },
      });

      return updatedOrder;
    }),

  // Delete Order
  deleteOrder: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.delete({
        where: { id: input.orderId },
      });

      return { success: true };
    }),

  // // add receipt
  // addReceipt: protectedProcedure
  // .input(z.object({ orderId: z.number(), receipt: z.string() }))
  // .mutation(async ({ ctx, input }) => {
  //   const order = await ctx.db.order.update({
  //     where: { id: input.orderId },
  //     data: { receipt: input.receipt },
  //   });
  //   return order;
  // }),
});

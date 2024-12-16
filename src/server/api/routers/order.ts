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
      const order = await ctx.db.order.create({
        data: {
          ...input,
          OrderProducts: {
            create: input.products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
            })),
          },
        },
        include: {
          OrderProducts: { include: { product: true } },
        },
      });

      return order;
    }),

  // Get All Orders
  getOrders: protectedProcedure.query(async ({ ctx }) => {
    const orders = await ctx.db.order.findMany({
      include: {
        OrderProducts: {
          include: { product: true },
        },
      },
    });

    return orders;
  }),

  // Get Order by ID
  getOrderById: protectedProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ ctx, input }) => {
      const order = await ctx.db.order.findUnique({
        where: { id: input.orderId },
        include: {
          OrderProducts: {
            include: { product: true },
          },
        },
      });

      return order;
    }),

  // Update Order Status
  updateOrderStatus: protectedProcedure
    .input(
      z.object({
        orderId: z.string(),
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
    .input(z.object({ orderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.delete({
        where: { id: input.orderId },
      });

      return { success: true };
    }),
});

import { receiptGenerator } from "@/utils/receiptGenerator";
import { OrderStatus, PaymentMethod, ShippingMethod } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const orderRouter = createTRPCRouter({
  // Create Order
  createOrder: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        address: z.string(),
        postalCode: z.string(),
        city: z.string(),
        province: z.string(),
        notes: z.string().optional(),
        receipt: z.string().optional(),
        total: z.number(),
        paymentMethod: z.nativeEnum(PaymentMethod),
        shippingMethod: z.nativeEnum(ShippingMethod),
        bank: z.string().optional(),
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
      const { products, paymentMethod, bank, ...orderData } = input;
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
          Payment: {
            create: {
              paymentMethod,
              bank,
            },
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
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        Payment: {
          select: {
            paymentMethod: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return orders;
  }),

  // Get Order by user ID
  getOrderUserId: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const orders = await ctx.db.order.findMany({
      where: { userId },
      include: {
        orderProducts: {
          include: {
            product: {
              include: {
                images: true,
              },
            },
          },
        },
        Payment: {
          select: {
            paymentMethod: true,
          },
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
});

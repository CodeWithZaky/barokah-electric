import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const paymentRouter = createTRPCRouter({
  getByOrderId: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ input, ctx }) => {
      return await ctx.db.payment.findUnique({
        where: { orderId: input.orderId },
      });
    }),

  getByReferenceNumber: protectedProcedure
    .input(z.object({ referenceNumber: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const payment = await ctx.db.payment.findFirst({
        where: { transactionId: input.referenceNumber },
        include: { order: true },
      });

      if (!payment) {
        throw new Error("Payment not found");
      }

      return {
        orderId: payment.orderId,
        amount: payment.amount,
        status: payment.status,
      };
    }),

  confirm: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        transactionId: z.string(),
        amount: z.number(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const order = await ctx.db.order.findFirst({
        where: { id: input.orderId },
      });

      if (!order) {
        throw new Error("Payment not found");
      }

      if (order.total !== input.amount) {
        throw new Error("Payment amount does not match");
      }

      const updatedPayment = await ctx.db.payment.update({
        where: { orderId: input.orderId },
        data: {
          status: "COMPLETED",
          transactionId: input.transactionId,
          amount: input.amount,
        },
      });

      await ctx.db.order.update({
        where: { id: input.orderId },
        data: { status: "PROCESSING" },
      });

      return updatedPayment;
    }),
});

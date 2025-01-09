import { createTRPCRouter, protectedProcedure } from "../trpc";

export const dashboardRouter = createTRPCRouter({
  // get total sales
  sumTotalSales: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.aggregate({
      _sum: {
        total: true,
      },
      where: {
        status: "COMPLETED",
      },
    });
  }),

  //   SELECT SUM(op.quantity) AS total_quantity
  // FROM "OrderProduct" op
  // JOIN "Order" o ON op."orderId" = o.id
  // WHERE o.status = 'COMPLETED';

  // get total orders
  sumTotalOrders: protectedProcedure.query(async ({ ctx }) => {
    const totalQuantity = await ctx.db.orderProduct.aggregate({
      _sum: {
        quantity: true,
      },
      where: {
        order: {
          status: "COMPLETED",
        },
      },
    });
    return totalQuantity;
  }),

  // get total users
  sumTotalUsers: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.user.count();
  }),

  // get total customers recent orders
  getCustomersRecentOrders: protectedProcedure.query(async ({ ctx }) => {
    const customer = await ctx.db.order.findMany({
      where: {
        status: "COMPLETED",
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });
    return customer;
  }),

  // get monthly revenue
  getMonthlyRevenue: protectedProcedure.query(async ({ ctx }) => {
    const monthlyRevenue = await ctx.db.order.groupBy({
      by: ["createdAt"],
      _sum: {
        total: true,
      },
      where: {
        status: "COMPLETED",
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Format data ke dalam bentuk yang diinginkan
    const data = Array.from({ length: 12 }, (_, index) => {
      const monthRevenue = monthlyRevenue
        .filter((entry) => new Date(entry.createdAt).getMonth() === index)
        .reduce((sum, entry) => sum + (entry._sum.total || 0), 0);

      return {
        name: months[index],
        total: monthRevenue,
      };
    });

    return data;
  }),
});

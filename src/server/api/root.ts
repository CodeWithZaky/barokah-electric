import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { addressRouter } from "./routers/address";
import { cartRouter } from "./routers/cart";
import { orderRouter } from "./routers/order";
import { productRouter } from "./routers/product";
import { userRoute } from "./routers/user";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRoute,
  product: productRouter,
  cart: cartRouter,
  order: orderRouter,
  address: addressRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);

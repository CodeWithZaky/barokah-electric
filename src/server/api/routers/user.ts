import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRoute = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().trim().min(1, "Name cannot be empty"),
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { name, email, password } = input;

      try {
        // Cek apakah email sudah terdaftar
        const existingUser = await ctx.db.user.findUnique({
          where: { email },
        });

        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already exists. Please use a different email.",
          });
        }

        // Hash password
        let hashedPassword;
        try {
          hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
          console.error("Error hashing password:", err);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to process password. Please try again later.",
          });
        }

        // Buat user baru
        const user = await ctx.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });

        return {
          status: "success",
          message: "User registered successfully",
          user,
        };
      } catch (error) {
        console.error("Unexpected error during registration:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "An error occurred during registration. Please try again later.",
        });
      }
    }),

  // get user by id
  getUserById: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;
    const user = await ctx.db.user.findFirst({
      select: {
        accounts: {
          select: {
            user: {
              select: {
                name: true,
                email: true,
                password: true,
                image: true,
              },
            },
          },
        },
      },
      where: { id: userId },
    });
    return user;
  }),

  // update user by id
  updateUserById: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
        email: z.string().email().optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      return ctx.db.user.update({
        where: { id: userId },
        data: {
          name: input.name,
          email: input.email,
          image: input.image,
        },
      });
    }),

  // update password by id
  updatePasswordById: protectedProcedure
    .input(
      z.object({
        password: z.string().min(8, "Password must be at least 8 characters"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const hashedPassword = await bcrypt.hash(input.password, 10);
      return ctx.db.user.update({
        where: { id: userId },
        data: {
          password: hashedPassword,
        },
      });
    }),
});

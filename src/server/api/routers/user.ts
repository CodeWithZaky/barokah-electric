import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
});

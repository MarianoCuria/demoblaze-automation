import { z } from 'zod';

/**
 * Contrato real de `/entries` en api.demoblaze.com (campos: cat, desc, img).
 */
export const ProductSchema = z.object({
  id: z.coerce.number(),
  title: z.string().min(1),
  price: z.coerce.number(),
  cat: z.string().min(1),
  desc: z.string().min(1),
  img: z.string().min(1),
});

export const EntriesResponseSchema = z.object({
  Items: z.array(ProductSchema).min(1),
});

export type Product = z.infer<typeof ProductSchema>;
export type EntriesResponse = z.infer<typeof EntriesResponseSchema>;

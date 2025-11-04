import { z } from 'zod';

// Zod schema for user form validation
export const userFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
    .trim()
    .nonempty('Le prénom est requis'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères')
    .trim()
    .nonempty('Le nom est requis'),
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne doit pas dépasser 200 caractères")
    .trim()
    .nonempty("L'adresse est requise"),
  phoneNumber: z
    .string()
    .nonempty('Le numéro de téléphone est requis')
    .transform((val) => val.replace(/\s/g, ''))
    .refine(
      (val) => /^(\+33|0)[1-9](\d{2}){4}$/.test(val),
      'Le numéro de téléphone doit être au format français (ex: 0612345678 ou +33612345678)',
    ),
});

// TypeScript types derived from Zod schemas
export type UserFormData = z.infer<typeof userFormSchema>;

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  currentScore?: number;
}

export interface ValidationErrors {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
}

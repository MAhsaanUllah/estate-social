import { z } from 'zod';

export const step1Schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  purpose: z.enum(['Sale', 'Rent'], { required_error: 'Purpose is required' }),
  propertyType: z.enum(['House', 'Plot', 'Commercial', 'Flat', 'Apartment', 'Farmhouse', 'Penthouse'], { required_error: 'Property type is required' }),
});

export const step2Schema = z.object({
  city: z.string().min(1, 'City is required'),
  society: z.string().min(1, 'Society name is required'),
  phase: z.string().optional(),
  block: z.string().optional(),
  possessionStatus: z.string().optional(),
  size: z.union([z.string(), z.number()]).refine(val => Number(val) > 0, 'Size must be greater than 0'),
  sizeUnit: z.enum(['Marla', 'Kanal', 'SqFt', 'SqYd']),
  price: z.union([z.string(), z.number()]).refine(val => Number(val) > 0, 'Price must be greater than 0'),
  beds: z.union([z.string(), z.number(), z.null()]).optional(),
  baths: z.union([z.string(), z.number(), z.null()]).optional(),
  kitchens: z.union([z.string(), z.number(), z.null()]).optional(),
  rentalIncome: z.union([z.string(), z.number(), z.null()]).optional(),
  totalFloors: z.string().optional(),
  roadWidth: z.string().optional(),
  parkingCapacity: z.string().optional(),
  powerBackup: z.string().optional(),
  plotType: z.string().optional(),
  dimensions: z.string().optional(),
  floorLevel: z.string().optional(),
  viewType: z.string().optional(),
  carParking: z.string().optional(),
  landmark: z.string().optional(),
  mapUrl: z.string().optional(),
});

export const step3Schema = z.object({
  isInstallmentAvailable: z.boolean(),
  downPayment: z.union([z.string(), z.number()]).optional(),
  monthlyInstallment: z.union([z.string(), z.number()]).optional(),
  durationMonths: z.union([z.string(), z.number()]).optional(),
}).superRefine((data, ctx) => {
  if (data.isInstallmentAvailable) {
    if (!data.downPayment || Number(data.downPayment) <= 0) {
      ctx.addIssue({ path: ['downPayment'], message: 'Down payment is required', code: 'custom' });
    }
    if (!data.monthlyInstallment || Number(data.monthlyInstallment) <= 0) {
      ctx.addIssue({ path: ['monthlyInstallment'], message: 'Monthly installment is required', code: 'custom' });
    }
    if (!data.durationMonths || Number(data.durationMonths) <= 0) {
      ctx.addIssue({ path: ['durationMonths'], message: 'Duration is required', code: 'custom' });
    }
  }
});

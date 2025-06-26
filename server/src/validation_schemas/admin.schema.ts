import { z } from 'zod';

export const assign_parcel_schema = z.object({
  parcelId: z.string().min(1, "parcelId is required"),
  agentId: z.string().min(1, 'agentId is required')
});

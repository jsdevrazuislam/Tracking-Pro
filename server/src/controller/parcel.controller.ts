import { User } from "@/models";
import { ParcelTimeline } from "@/models/parcel-timeline.models";
import { Parcel } from "@/models/parcel.models";
import ApiResponse from "@/utils/api-response";
import asyncHandler from "@/utils/async-handler";
import { cache } from "@/utils/cache";
import { getStatusDescription } from "@/utils/helper";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export const bookParcel = asyncHandler(async (req: Request, res: Response) => {
    const {
        pickup_address,
        receiver_address,
        parcel_size,
        parcel_type,
        payment_type,
        amount
    } = req.body;

    const parcel = await Parcel.create({
        pickup_address,
        receiver_address,
        parcel_size,
        parcel_type,
        payment_type,
        senderId: req.user.id,
        tracking_code: `PKG${uuidv4().split("-")[0].toUpperCase()}`,
        amount
    });

    await ParcelTimeline.create({
        parcelId: parcel.id,
        status: parcel.status,
        location: pickup_address,
        description: getStatusDescription(parcel.status),
    });

    cache.flushAll()
    return res.json(new ApiResponse(200, parcel, "Parcel Created Successfully"));
});


export const getUserParcels = asyncHandler(
    async (req: Request, res: Response) => {
        const userId = req.user.id;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const cacheKey = `user_parcels_${userId}_page_${page}_limit_${limit}`;
        const cached = cache.get(cacheKey);
        if (cached) {
            return res.json(
                new ApiResponse(200, cached, "Get Parcel Successfully (cached)")
            );
        }

        const { rows: parcels, count: totalItems } = await Parcel.findAndCountAll({
            where: { senderId: userId },
            order: [["createdAt", "DESC"]],
            offset,
            limit,
        });

        const statusToProgress = {
            pending: 0,
            assigned: 25,
            picked: 50,
            in_transit: 75,
            delivered: 100,
            cancelled: 0,
        };

        const calculateProgress = (status: string): number => {
            return statusToProgress[status as keyof typeof statusToProgress] ?? 0;
        };

        const parcelsWithProgress = parcels.map(parcel => ({
            ...parcel.toJSON(),
            progress: calculateProgress(parcel.status),
        }));

        const response = {
            parcels: parcelsWithProgress,
            pagination: {
                totalItems,
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page,
                pageSize: limit,
            },
        };

        cache.set(cacheKey, response);
        return res.json(new ApiResponse(200, response, "Get Parcel Successfully"));
    }
);

export const trackParcel = asyncHandler(async (req: Request, res: Response) => {
  const { tracking_code } = req.params;
  const cacheKey = `track_${tracking_code}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(new ApiResponse(200, cached, "Track Parcel Get Successfully"));
  }

  const parcel = await Parcel.findOne({
    where: { tracking_code },
    include: [
      {
        model: User,
        as: "agent",
        attributes: ["full_name", "email", "id"],
      },
      {
        model: ParcelTimeline,
        as: "timeline",
        order: [["timestamp", "ASC"]],
      },
    ],
  });

  if (!parcel) {
    res.status(404);
    throw new Error("Parcel not found");
  }

  const response = parcel.toJSON()

  cache.set(cacheKey, response);

  return res.json(new ApiResponse(200, response, "Track Parcel Get Successfully"));
});


export const getCustomerStats = asyncHandler(async (req: Request, res: Response) => {
    const senderId = req.user.id;

    const [total, delivered, inTransit, pending, cancelled] = await Promise.all([
        Parcel.count({ where: { senderId } }),
        Parcel.count({ where: { senderId, status: 'delivered' } }),
        Parcel.count({ where: { senderId, status: 'in_transit' } }),
        Parcel.count({ where: { senderId, status: 'pending' } }),
        Parcel.count({ where: { senderId, status: 'cancelled' } }),
    ]);

    const stats = {
        total,
        delivered,
        inTransit,
        pending,
        cancelled
    };

    return res.json(new ApiResponse(200, stats, 'Customer parcel stats'));
});

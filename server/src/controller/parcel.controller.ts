import { USER_ATTRIBUTE } from "@/constants";
import { User } from "@/models";
import { ParcelTimeline } from "@/models/parcel-timeline.models";
import { Parcel } from "@/models/parcel.models";
import ApiError from "@/utils/api-error";
import ApiResponse from "@/utils/api-response";
import asyncHandler from "@/utils/async-handler";
import { cache } from "@/utils/cache";
import { generateBarcodeBase64, getStatusDescription } from "@/utils/helper";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import PDFDocument from "pdfkit";
import { UpdatableParcelFields } from "@/types/parcel";
import { Op, fn, col, literal, QueryTypes } from "sequelize";
import sequelize from "@/config/db";
import { sendEmail } from "@/utils/email";
import sizeOf from "image-size";




export const bookParcel = asyncHandler(async (req: Request, res: Response) => {
  const {
    pickup_address,
    receiver_address,
    parcel_size,
    parcel_type,
    payment_type,
    amount,
  } = req.body;

  const parcel = await Parcel.create({
    pickup_address,
    receiver_address,
    parcel_size,
    parcel_type,
    payment_type,
    senderId: req.user.id,
    tracking_code: `PKG${uuidv4().split("-")[0].toUpperCase()}`,
    amount,
  });

  await ParcelTimeline.create({
    parcelId: parcel.id,
    status: parcel.status,
    location: pickup_address,
    description: getStatusDescription(parcel.status),
  });

  cache.flushAll();
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

    const parcelsWithProgress = parcels.map((parcel) => ({
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


export const updateParcel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const parcel = await Parcel.findOne({ where: { id, senderId: req.user.id } });

  if (!parcel) throw new ApiError(404, "Parcel not found");

  if (parcel.status !== "pending") throw new ApiError(400, "Only pending parcels can be updated");


  const allowedFields: (keyof UpdatableParcelFields)[] = [
    "pickup_address",
    "receiver_address",
    "parcel_size",
    "parcel_type",
    "payment_type",
    "amount",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      parcel.set(field, req.body[field]);
    }
  });


  await parcel.save();
  cache.flushAll();

  return res.json(new ApiResponse(200, parcel, "Parcel updated successfully"));
});

export const deleteParcel = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const parcel = await Parcel.findOne({ where: { id, senderId: req.user.id } });

  if (!parcel) throw new ApiError(404, "Parcel not found");

  if (parcel.status !== "pending") {
    throw new ApiError(400, "Only pending parcels can be deleted");
  }

  await parcel.destroy();

  cache.flushAll();

  return res.json(new ApiResponse(200, null, "Parcel deleted successfully"));
});



export const trackParcel = asyncHandler(async (req: Request, res: Response) => {
  const { tracking_code } = req.params;
  const cacheKey = `track_${tracking_code}`;
  const cached = cache.get(cacheKey);

  if (cached) {
    return res.json(
      new ApiResponse(200, cached, "Track Parcel Get Successfully")
    );
  }

  const parcel = await Parcel.findOne({
    where: { tracking_code },
    include: [
      {
        model: User,
        as: "agent",
        attributes: USER_ATTRIBUTE,
      },
      {
        model: ParcelTimeline,
        as: "timeline",
        order: [["timestamp", "ASC"]],
      },
    ],
  });

  if (!parcel) throw new ApiError(404, 'Parcel not found')

  const response = parcel.toJSON();

  cache.set(cacheKey, response);

  return res.json(
    new ApiResponse(200, response, "Track Parcel Get Successfully")
  );
});

export const getCustomerStats = asyncHandler(
  async (req: Request, res: Response) => {
    const senderId = req.user.id;

    const [total, delivered, inTransit, pending, cancelled] = await Promise.all(
      [
        Parcel.count({ where: { senderId } }),
        Parcel.count({ where: { senderId, status: "delivered" } }),
        Parcel.count({ where: { senderId, status: "in_transit" } }),
        Parcel.count({ where: { senderId, status: "pending" } }),
        Parcel.count({ where: { senderId, status: "cancelled" } }),
      ]
    );

    const stats = {
      total,
      delivered,
      inTransit,
      pending,
      cancelled,
    };

    return res.json(new ApiResponse(200, stats, "Customer parcel stats"));
  }
);

export const getAgentStats = asyncHandler(
  async (req: Request, res: Response) => {
    const agentId = req.user.id;

    const statuses = ["assigned", "picked", "in_transit", "delivered"];

    const stats: Record<string, number> = {};
    for (const status of statuses) {
      stats[status] = await Parcel.count({
        where: { assignedAgentId: agentId, status },
      });
    }

    return res.json(
      new ApiResponse(200, stats, "Agent stats fetched successfully")
    );
  }
);

export const getAgentAssignedParcels = asyncHandler(
  async (req: Request, res: Response) => {
    const agentId = req.user.id;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `agent_parcels_${agentId}_page_${page}_limit_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(
        new ApiResponse(200, cached, "Assigned parcels (cached)")
      );
    }

    const { rows, count: totalItems } = await Parcel.findAndCountAll({
      where: { assignedAgentId: agentId },
      order: [["updatedAt", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: USER_ATTRIBUTE,
          required: false
        }
      ]
    });

    const result = {
      parcels: rows?.map((p) => p.toJSON()),
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      },
    };

    cache.set(cacheKey, result);

    return res.json(
      new ApiResponse(200, result, "Assigned parcels fetched successfully")
    );
  }
);

export const updateParcelStatus = asyncHandler(async (req: Request, res: Response) => {
  const agentId = req.user.id;
  const { parcelId } = req.params;
  const { status, current_location } = req.body;

  const parcel = await Parcel.findOne({
    where: {
      [Op.or]: [
        { id: parcelId },
        { tracking_code: parcelId },
      ],
    },
    include: [
      {
        model: User,
        as: 'sender',
        attributes: USER_ATTRIBUTE
      }
    ]
  });

  if (!parcel) throw new ApiError(404, 'Parcel not found')

  if (parcel.assignedAgentId !== agentId) throw new ApiError(403, 'You are not authorized to update this parcel')

  parcel.status = status;
  parcel.current_location = current_location || parcel.current_location;
  parcel.updatedAt = new Date();
  await parcel.save();

  await ParcelTimeline.create({
    parcelId: parcel.id,
    status,
    location: current_location || "Unknown",
    timestamp: new Date(),
    description: `Status updated to ${status} by agent`,
  });

  await sendEmail(
    "We need to verify your email address",
    parcel?.sender?.email,
    parcel?.sender?.full_name,
    { customer_name: parcel?.sender?.full_name, year: new Date().getFullYear(), tracking_code: parcel?.tracking_code, status:parcel?.status, tracking_url: `${process.env.CLIENT_URL}/customer/track?tracking_code=${parcel?.tracking_code}` },
    12
  );

  cache.flushAll();
  return res.json(new ApiResponse(200, parcel, "Parcel status updated successfully"));
});


export const generateShippingLabel = asyncHandler(async (req: Request, res: Response) => {
  const { parcelId } = req.params;

  const parcel = await Parcel.findByPk(parcelId, {
    include: [
      { model: User, as: "sender", attributes: USER_ATTRIBUTE },
    ],
  });

  if (!parcel) throw new ApiError(404, 'Parcel not found')

  const barcodeBase64 = await generateBarcodeBase64(parcel.tracking_code);
  const base64Data = barcodeBase64.replace(/^data:image\/png;base64,/, "");
  const imageBuffer = Buffer.from(base64Data, "base64");

  const dimensions = sizeOf(imageBuffer);
  const width = dimensions.width || 300;
  const height = dimensions.height || 100;

  const doc = new PDFDocument({
    size: [width + 20, height + 20],
    margin: 0
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename=${parcel.tracking_code}_label.pdf`);

  doc.image(imageBuffer, 10, 10, { width });
  doc.end();
  doc.pipe(res);

});


export const getBookingAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const now = new Date();
  const currentYear = now.getFullYear();

  const [total, delivered, cancelled, codCount, prepaidCount] = await Promise.all([
    Parcel.count(),
    Parcel.count({ where: { status: 'delivered' } }),
    Parcel.count({ where: { status: 'cancelled' } }),
    Parcel.count({ where: { payment_type: 'cod' } }),
    Parcel.count({ where: { payment_type: 'prepaid' } }),
  ]);

  const monthlyStats = await Parcel.findAll({
    attributes: [
      [fn("DATE_TRUNC", "month", col("createdAt")), "month"],
      [fn("COUNT", "*"), "totalBookings"],
      [fn("SUM", literal(`CASE WHEN status = 'delivered' THEN 1 ELSE 0 END`)), "delivered"],
      [fn("SUM", literal(`CASE WHEN payment_type = 'cod' THEN amount::FLOAT ELSE 0 END`)), "codAmount"],
      [fn("SUM", literal(`CASE WHEN payment_type = 'prepaid' THEN amount::FLOAT ELSE 0 END`)), "prepaidAmount"]
    ],
    where: {
      createdAt: {
        [Op.gte]: new Date(`${currentYear}-01-01`),
      },
    },
    group: [fn("DATE_TRUNC", "month", col("createdAt"))],
    order: [[fn("DATE_TRUNC", "month", col("createdAt")), "ASC"]],
    raw: true
  });

  const topZones = await sequelize.query(
    `
    SELECT pickup_address->>'place_name' as pickup_zone,
           COUNT(*) as count
    FROM parcels
    GROUP BY pickup_zone
    ORDER BY count DESC
    LIMIT 5;
    `,
    { type: QueryTypes.SELECT }
  );

  res.json(
    new ApiResponse(200, {
      stats: {
        total,
        delivered,
        cancelled,
        cod: codCount,
        prepaid: prepaidCount,
      },
      monthlyStats,
      topZones,
    }, "Booking analytics fetched")
  );
});

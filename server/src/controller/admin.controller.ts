import { User } from "@/models";
import { Parcel } from "@/models/parcel.models";
import ApiError from "@/utils/api-error";
import ApiResponse from "@/utils/api-response";
import asyncHandler from "@/utils/async-handler";
import { cache } from "@/utils/cache";
import { Request, Response } from "express";
import { col, fn, Op } from "sequelize";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import { UserStatus } from "@/models/user.models";
import { ParcelTimeline } from "@/models/parcel-timeline.models";
import { getStatusDescription } from "@/utils/helper";
import { SocketEventEnum, USER_ATTRIBUTE } from "@/constants";
import { emitSocketEvent } from "@/socket";

export const getAdminStats = asyncHandler(
  async (req: Request, res: Response) => {
    const cacheKey = "admin_stats";
    const cached = cache.get(cacheKey);

    if (cached) {
      return res.json(
        new ApiResponse(200, { stats: cached }, "Admin stats (cached)")
      );
    }

    const today = new Date();
    const startOfToday = new Date(today.setHours(0, 0, 0, 0));
    const endOfToday = new Date(today.setHours(23, 59, 59, 999));

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [
      totalParcels,
      dailyBookings,
      activeAgents,
      codSumRow,
      deliveredToday,
      transitToday,
      pendingToday,
      failedDeliveries,
      monthRevenueRow,
      todayRevenueRow,
    ] = await Promise.all([
      Parcel.count(),
      Parcel.count({
        where: { createdAt: { [Op.between]: [startOfToday, endOfToday] } },
      }),
      Parcel.aggregate("assignedAgentId", "count", {
        distinct: true,
        where: {
          assignedAgentId: { [Op.ne]: null },
          status: { [Op.in]: ["assigned", "in_transit"] },
        },
      }),
      Parcel.findOne({
        attributes: [[fn("SUM", col("amount")), "codSum"]],
        where: { payment_type: "cod" },
        raw: true,
      }),
      Parcel.count({
        where: {
          status: "delivered",
          updatedAt: { [Op.between]: [startOfToday, endOfToday] },
        },
      }),
      Parcel.count({
        where: {
          status: "in_transit",
          updatedAt: { [Op.between]: [startOfToday, endOfToday] },
        },
      }),
      Parcel.count({
        where: {
          status: "pending",
          updatedAt: { [Op.between]: [startOfToday, endOfToday] },
        },
      }),
      Parcel.count({ where: { status: "cancelled" } }),
      Parcel.findOne({
        attributes: [[fn("SUM", col("amount")), "monthRevenue"]],
        where: { status: "delivered", updatedAt: { [Op.gte]: startOfMonth } },
        raw: true,
      }),
      Parcel.findOne({
        attributes: [[fn("SUM", col("amount")), "todayRevenue"]],
        where: {
          status: "delivered",
          updatedAt: { [Op.between]: [startOfToday, endOfToday] },
        },
        raw: true,
      }),
    ]);

    const startOfYesterday = new Date(startOfToday);
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);

    const yesterdayBookings = await Parcel.count({
      where: { createdAt: { [Op.between]: [startOfYesterday, startOfToday] } },
    });

    const codAmount = parseFloat((codSumRow as any)?.codSum || "0");
    const revenueThisMonth = parseFloat(
      (monthRevenueRow as any)?.monthRevenue || "0"
    );
    const todayRevenue = parseFloat(
      (todayRevenueRow as any)?.todayRevenue || "0"
    );

    const growthRate = yesterdayBookings
      ? parseFloat(
        (
          ((dailyBookings - yesterdayBookings) / yesterdayBookings) *
          100
        ).toFixed(2)
      )
      : 0;

    const stats = {
      totalParcels,
      dailyBookings,
      activeAgents,
      codAmount,
      deliveredToday,
      transitToday,
      pendingToday,
      failedDeliveries,
      revenueThisMonth,
      todayRevenue,
      growthRate,
    };

    cache.set(cacheKey, stats);
    return res.json(new ApiResponse(200, { stats }, "Admin stats"));
  }
);

export const getUnassignedParcels = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `unassigned_parcels_page_${page}_limit_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(
        new ApiResponse(200, cached, "Unassigned parcels (cached)")
      );
    }

    const { rows: parcels, count: totalItems } = await Parcel.findAndCountAll({
      where: { assignedAgentId: null },
      order: [["createdAt", "DESC"]],
      limit,
      offset,
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "full_name", "email", "role"],
          where: { role: "customer" },
          required: false,
        },
      ],
    });

    const result = {
      parcels: parcels.map((p) => p.toJSON()),
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      },
    };

    cache.set(cacheKey, result);
    return res.json(new ApiResponse(200, result, "Unassigned parcels"));
  }
);

export const assignAgentToParcel = asyncHandler(
  async (req: Request, res: Response) => {
    const { parcelId, agentId } = req.body;

    const [parcel, agent] = await Promise.all([
      Parcel.findByPk(parcelId),
      User.findOne({ where: { id: agentId, role: "agent" } }),
    ]);

    if (!parcel) throw new ApiError(404, "Parcel not found");
    if (!agent) throw new ApiError(404, "Agent not found or invalid role");

    parcel.assignedAgentId = agentId;
    parcel.status = "assigned";
    await parcel.save();

    const newStatus = await ParcelTimeline.create({
      parcelId: parcel.id,
      status: parcel.status,
      location: parcel.pickup_address || "Unknown",
      description: getStatusDescription(parcel.status),
    });

    emitSocketEvent({ req, roomId: parcel.id, event: SocketEventEnum.CHANGE_STATUS, payload: { data: newStatus?.toJSON() } })

    cache.flushAll();

    return res.json(
      new ApiResponse(200, parcel, "Agent assigned successfully")
    );
  }
);

export const exportBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const format = (req.query.format as string) || "csv";
    const bookings = await Parcel.findAll({
      include: [
        { model: User, as: "sender", attributes: USER_ATTRIBUTE },
        { model: User, as: "agent", attributes: USER_ATTRIBUTE },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (format === "pdf") {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const filename = `bookings_${new Date().toISOString().split("T")[0]}.pdf`;

        res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
        res.setHeader("Content-Type", "application/pdf");

        doc.pipe(res);

        doc.fontSize(20).text("Parcel Bookings Report", { align: "center" }).moveDown();
        doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString()}`, {
          align: "right",
        }).moveDown(2);

        let y = 150;
        doc.font("Helvetica-Bold")
          .text("#", 40, y)
          .text("Tracking", 60, y)
          .text("Pickup", 150, y)
          .text("Delivery", 260, y)
          .text("Status", 370, y)
          .text("Customer", 450, y)
          .text("Agent", 530, y);

        y += 20;
        doc.font("Helvetica");

        bookings.forEach((p, idx) => {
          if (y > 750) {
            doc.addPage();
            y = 50;
          }

          doc
            .text(`${idx + 1}`, 40, y)
            .text(p.tracking_code, 60, y)
            .text(p.pickup_address?.place_name || "-", 150, y, { width: 100 })
            .text(p.receiver_address?.place_name || "-", 260, y, { width: 100 })
            .text(p.status, 370, y)
            .text(p.sender?.full_name || "-", 450, y, { width: 70 })
            .text(p.agent?.full_name || "-", 530, y, { width: 70 });

          y += 20;
        });

        doc.end();
      } catch (error) {
        console.error("PDF generation error:", error);
        res.status(500).json({
          success: false,
          message: "Failed to generate PDF",
        });
      }
    } else {
      try {
        const fields = [
          "tracking_code",
          "pickup",
          "delivery",
          "status",
          "payment",
          "amount",
          "customer",
          "agent",
        ];

        const parser = new Parser({ fields });
        const csv = parser.parse(
          bookings.map((p) => ({
            tracking_code: p.tracking_code,
            "pickup": p.pickup_address?.place_name,
            "delivery": p.receiver_address?.place_name,
            status: p.status,
            payment: p.payment_type,
            amount: p.amount,
            "customer": p.sender?.full_name || "-",
            "agent": p.agent?.full_name || "-",
          }))
        );

        res.header("Content-Type", "text/csv");
        res.attachment("bookings.csv");
        return res.send(csv);
      } catch (err) {
        console.error("CSV export error:", err);
        res.status(500).json({ message: "CSV generation failed" });
      }
    }

  }
);

export const getAllAgents = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const cacheKey = `agents_page_${page}_limit_${limit}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(new ApiResponse(200, cached, "Agent list (cached)"));
    }

    const { rows: agents, count: totalItems } = await User.findAndCountAll({
      where: { role: "agent" },
      attributes: USER_ATTRIBUTE,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const agentIds = agents.map((agent) => agent.id);

    const allParcels = await Parcel.findAll({
      where: { assignedAgentId: agentIds },
      attributes: ["assignedAgentId", "status"],
    });

    const statsMap = agentIds.reduce((acc, id) => {
      acc[id] = { assigned: 0, completed: 0 };
      return acc;
    }, {} as Record<string, { assigned: number; completed: number }>);

    allParcels.forEach((parcel) => {
      const agentId = parcel.assignedAgentId as string;
      if (!agentId || !statsMap[agentId]) return;

      if (parcel.status === "delivered") {
        statsMap[agentId].completed++;
      } else if (parcel.status !== "cancelled") {
        statsMap[agentId].assigned++;
      }
    });

    const enrichedAgents = agents.map((agent) => ({
      ...agent.toJSON(),
      currentDeliveries: statsMap[agent.id]?.assigned || 0,
      completedDeliveries: statsMap[agent.id]?.completed || 0,
    }));

    const result = {
      agents: enrichedAgents,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      },
    };

    cache.set(cacheKey, result);
    return res.json(new ApiResponse(200, result, "Agent list"));
  }
);

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const offset = (page - 1) * limit;

  const cacheKey = `users_stats_page_${page}_limit_${limit}`;
  const cached = cache.get(cacheKey);
  if (cached)
    return res.json(new ApiResponse(200, cached, "Users fetched (cached)"));

  const { rows: users, count: totalItems } = await User.findAndCountAll({
    attributes: USER_ATTRIBUTE,
    order: [["createdAt", "DESC"]],
    limit,
    offset,
  });

  const userIds = users.map((user) => user.id);

  const parcels = await Parcel.findAll({
    where: {
      [Op.or]: [
        { senderId: userIds },
        { assignedAgentId: userIds, status: "delivered" },
      ],
    },
    attributes: ["senderId", "assignedAgentId", "status"],
  });

  const statsMap = userIds.reduce((acc, id) => {
    acc[id] = { completedDeliveries: 0, totalOrders: 0 };
    return acc;
  }, {} as Record<string, { completedDeliveries: number; totalOrders: number }>);

  parcels.forEach((parcel) => {
    const senderId = parcel.senderId;
    const agentId = parcel.assignedAgentId;
    if (senderId && statsMap[senderId]) statsMap[senderId].totalOrders++;
    if (parcel.status === "delivered" && agentId && statsMap[agentId]) {
      statsMap[agentId].completedDeliveries++;
    }
  });

  const enrichedUsers = users.map((user) => {
    const stats = statsMap[user.id] || {
      completedDeliveries: 0,
      totalOrders: 0,
    };

    return {
      ...user.toJSON(),
      ...(user.role === "customer" && { totalOrders: stats.totalOrders }),
      ...(user.role === "agent" && {
        completedDeliveries: stats.completedDeliveries,
      }),
    };
  });

  const result = {
    users: enrichedUsers,
    pagination: {
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      pageSize: limit,
    },
  };

  cache.set(cacheKey, result);
  return res.json(new ApiResponse(200, result, "Users fetched successfully"));
});

export const toggleUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found')
    user.status =
      user.status === UserStatus.ACTIVE
        ? UserStatus.DEACTIVATE
        : UserStatus.ACTIVE;
    await user.save();
    cache.flushAll();
    return res.json(
      new ApiResponse(
        200,
        user,
        `User ${user.status === "active" ? "activated" : "deactivated"
        } successfully`
      )
    );
  }
);

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const user = await User.findByPk(userId);
  if (!user) throw new ApiError(404, 'User not found')
  await user.destroy();
  cache.flushAll();
  return res.json(new ApiResponse(200, null, "User deleted successfully"));
});

export const getAllBookings = asyncHandler(
  async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const status = req.query.status as string | undefined;
    const paymentType = req.query.payment_type as string | undefined;

    const cacheKey = `admin_bookings_page_${page}_limit_${limit}_status_${status || "all"
      }_payment_${paymentType || "all"}`;
    const cached = cache.get(cacheKey);
    if (cached)
      return res.json(
        new ApiResponse(200, cached, "Bookings fetched (cached)")
      );

    const whereClause: any = {};
    if (status) whereClause.status = status;
    if (paymentType) whereClause.payment_type = paymentType;

    const { count: totalItems, rows: bookings } = await Parcel.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "sender",
          attributes: USER_ATTRIBUTE,
        },
        {
          model: User,
          as: "agent",
          attributes: USER_ATTRIBUTE,
        },
      ],
      order: [["createdAt", "DESC"]],
      limit,
      offset,
    });

    const result = {
      bookings: bookings?.map((b) => b.toJSON()),
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
      },
    };

    cache.set(cacheKey, result);
    return res.json(
      new ApiResponse(200, result, "Bookings fetched successfully")
    );
  }
);

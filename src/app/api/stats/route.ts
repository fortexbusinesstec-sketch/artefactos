import { NextResponse } from "next/server";
import { db } from "@/db";
import { artifacts, actionItems } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
    const totalArtifacts = await db
      .select({ count: sql<number>`count(*)` })
      .from(artifacts);

    const byType = await db
      .select({
        type: artifacts.type,
        count: sql<number>`count(*)`,
      })
      .from(artifacts)
      .groupBy(artifacts.type);

    const totalActions = await db
      .select({ count: sql<number>`count(*)` })
      .from(actionItems);

    const byStatus = await db
      .select({
        status: actionItems.status,
        count: sql<number>`count(*)`,
      })
      .from(actionItems)
      .groupBy(actionItems.status);

    const pendingActions = await db
      .select({ count: sql<number>`count(*)` })
      .from(actionItems)
      .where(eq(actionItems.status, "pending"));

    const recentArtifacts = await db
      .select()
      .from(artifacts)
      .orderBy(sql`${artifacts.createdAt} DESC`)
      .limit(5);

    return NextResponse.json({
      totalArtifacts: totalArtifacts[0].count,
      totalActions: totalActions[0].count,
      pendingActions: pendingActions[0].count,
      byType,
      byStatus,
      recentArtifacts,
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

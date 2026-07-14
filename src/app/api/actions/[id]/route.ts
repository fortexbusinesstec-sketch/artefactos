import { NextResponse } from "next/server";
import { db } from "@/db";
import { actionItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    await db
      .update(actionItems)
      .set({
        status: body.status,
        updatedAt: new Date(),
      })
      .where(eq(actionItems.id, Number(id)));

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("PATCH /api/actions/[id] error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

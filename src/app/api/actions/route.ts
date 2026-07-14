import { NextResponse } from "next/server";
import { db } from "@/db";
import { actionItems } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const artifactId = searchParams.get("artifactId");

    const rows = artifactId
      ? await db.select().from(actionItems).where(eq(actionItems.artifactId, artifactId))
      : await db.select().from(actionItems);

    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/actions error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.artifactId || !body.description) {
      return NextResponse.json(
        { error: "artifactId y description son requeridos" },
        { status: 400 }
      );
    }

    const result = await db.insert(actionItems).values({
      artifactId: body.artifactId,
      description: body.description,
      assignedTo: body.assignedTo || null,
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
    }).returning({ id: actionItems.id });

    return NextResponse.json({ id: result[0].id }, { status: 201 });
  } catch (error) {
    console.error("POST /api/actions error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

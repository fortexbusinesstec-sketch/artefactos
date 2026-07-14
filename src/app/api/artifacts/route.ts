import { NextResponse } from "next/server";
import { db } from "@/db";
import { artifacts } from "@/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(artifacts);
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /api/artifacts error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.type || !body.content) {
      return NextResponse.json(
        { error: "title, type y content son requeridos" },
        { status: 400 }
      );
    }

    const slug = body.slug
      || body.title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .slice(0, 80);

    const id = body.id || `${body.type.slice(0, 3)}_${Date.now()}`;

    await db.insert(artifacts).values({
      id,
      title: body.title,
      slug,
      type: body.type,
      content: body.content,
      metadata: body.metadata ? JSON.stringify(body.metadata) : null,
      tags: body.tags ? JSON.stringify(body.tags) : null,
      filePath: body.filePath || null,
    });

    return NextResponse.json({ id, slug }, { status: 201 });
  } catch (error) {
    console.error("POST /api/artifacts error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

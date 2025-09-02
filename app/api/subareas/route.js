import { NextResponse } from "next/server";
import { sql } from "@/lib/db";


export async function POST(req) {
  try {
    const { areaId, subareaName } = await req.json();

    if (!areaId || !subareaName?.trim()) {
      return NextResponse.json(
        { error: "Missing areaId or subareaName" },
        { status: 400 }
      );
    }

    const result = await sql(
      "INSERT INTO subareas (area_id, name) VALUES (?, ?)",
      [areaId, subareaName.trim()]
    );

    return NextResponse.json({
      ok: true,
      subareaId: result.insertId,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const areaId = searchParams.get("areaId");

    if (!areaId) {
      return new Response(JSON.stringify({ error: "areaId required" }), { status: 400 });
    }

   const subareas = await sql(
  "SELECT id AS subarea_id, name AS subarea_name FROM subareas WHERE area_id = ?",
  [areaId]
);

    return new Response(JSON.stringify({ data: subareas }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch subareas" }), { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { subareaId, newSubareaName } = await req.json();

    if (!subareaId || !newSubareaName?.trim()) {
      return NextResponse.json(
        { error: "Missing subareaId or newSubareaName" },
        { status: 400 }
      );
    }

    const result = await sql(
      "UPDATE subareas SET name = ? WHERE id = ?",
      [newSubareaName.trim(), subareaId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Subarea not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      subarea_id: subareaId,
      subarea_name: newSubareaName.trim(),
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

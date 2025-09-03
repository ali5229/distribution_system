import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Unit name is required" }, { status: 400 });
    }

    const result = await sql("INSERT INTO units (unit_name) VALUES (?)", [name.trim()]);
    const newUnit = { id: result.insertId, name: name.trim() };

    return NextResponse.json({ ok: true, data: newUnit });
  } catch (err) {
    console.error("Error creating unit:", err);
    return NextResponse.json({ error: "Failed to create unit" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await sql(
      "SELECT unit_id, unit_name FROM units ORDER BY unit_id"
    );
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


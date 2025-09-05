import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Missing salesman ID" }, { status: 400 });
    }

    const result = await sql(
      `SELECT a.id AS area_id, a.name AS area_name
       FROM salesman_areas sa
       JOIN areas a ON sa.area_id = a.id
       WHERE sa.salesman_id = ?`,
      [id]
    );
    return NextResponse.json({ areas: result });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT: overwrite assigned areas for a salesman
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { areaIds } = body; // array of area_id integers

    if (!Array.isArray(areaIds)) {
      return NextResponse.json({ error: "areaIds must be an array" }, { status: 400 });
    }

    // Start overwrite process
    await sql("DELETE FROM salesman_areas WHERE salesman_id = ?", [id]);

    if (areaIds.length > 0) {
      // Build bulk insert query dynamically
      const values = areaIds.map(() => "(?, ?)").join(", ");
      const paramsArray = [];
      areaIds.forEach((areaId) => {
        paramsArray.push(id, areaId);
      });

      await sql(
        `INSERT INTO salesman_areas (salesman_id, area_id) VALUES ${values}`,
        paramsArray
      );
    }

    return NextResponse.json({ ok: true, salesman_id: id, areas: areaIds });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

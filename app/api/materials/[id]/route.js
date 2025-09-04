import { sql } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const result = await sql(
      `SELECT 
        product_id,
        product_name_eng,
        product_name_urd,
        packing_no,
        unit_id,
        reorder_level,
        sales_mc,
        purchase_price,
        sale_price,
        type_id,
        company_id,
        location
       FROM materials
       WHERE product_id = ?`,
      [id]
    );

    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const body = await req.json();

    const {
      product_name_eng,
      product_name_urd,
      packing_no,
      unit_id,
      reorder_level,
      sales_mc,
      purchase_price,
      sale_price,
      type_id,
      company_id,
      location,
    } = body;

    const result = await sql(
      `UPDATE materials 
       SET product_name_eng = ?,
           product_name_urd = ?,
           packing_no = ?,
           unit_id = ?,
           reorder_level = ?,
           sales_mc = ?,
           purchase_price = ?,
           sale_price = ?,
           type_id = ?,
           company_id = ?,
           location = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE product_id = ?`,
      [
        product_name_eng,
        product_name_urd || null,
        packing_no,
        unit_id,
        reorder_level,
        sales_mc,
        purchase_price,
        sale_price,
        type_id,
        company_id,
        location || null,
        id,
      ]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, productId: id });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

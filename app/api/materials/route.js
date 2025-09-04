import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req) {
  try {
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

    if (!product_name_eng || !packing_no || !unit_id || !reorder_level || !sales_mc || !purchase_price || !sale_price || !type_id || !company_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sql(
      `INSERT INTO materials 
      (product_name_eng, product_name_urd, packing_no, unit_id, reorder_level, sales_mc, purchase_price, sale_price, type_id, company_id, location) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_name_eng, product_name_urd || null, packing_no, unit_id, reorder_level, sales_mc, purchase_price, sale_price, type_id, company_id, location || null]
    );

    return NextResponse.json({ id: result.insertId, ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}



export async function GET() {
  try {
    
    const products = await sql(`
      SELECT 
        product_id, 
        product_name_eng 
      FROM materials 
      ORDER BY product_id
    `);


    const nextIdResult = await sql( "SELECT AUTO_INCREMENT as next_id FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'materials'");
    const nextId = nextIdResult[0]?.next_id || 1;

    return NextResponse.json({ products, nextId });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}




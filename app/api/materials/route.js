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
    } = body;

    if (!product_name_eng || !packing_no || !unit_id || !reorder_level || !sales_mc || !purchase_price || !sale_price || !type_id || !company_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const result = await sql(
      `INSERT INTO materials 
      (product_name_eng, product_name_urd, packing_no, unit_id, reorder_level, sales_mc, purchase_price, sale_price, type_id, company_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [product_name_eng, product_name_urd || null, packing_no, unit_id, reorder_level, sales_mc, purchase_price, sale_price, type_id, company_id]
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


// export async function GET(req, { params }) {
//   try {
//     const { id } = params;

//     const result = await sql(`
//       SELECT 
//         m.*,
//         u.unit_name,
//         t.type_name,
//         c.company_name
//       FROM materials m
//       JOIN units u ON m.unit_id = u.unit_id
//       JOIN types t ON m.type_id = t.type_id
//       JOIN companies c ON m.company_id = c.company_id
//       WHERE m.product_id = ?
//     `, [id]);

//     if (!result.length) {
//       return NextResponse.json({ error: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json(result[0]);
//   } catch (err) {
//     return NextResponse.json({ error: err.message }, { status: 500 });
//   }
// }




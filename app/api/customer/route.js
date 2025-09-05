import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(){
    try {
        const customer_data = await sql(`SELECT customer_id, customer_name FROM customers ORDER BY customer_id`);
        const nextIdResult = await sql( "SELECT AUTO_INCREMENT as next_id FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'customers'");

    const nextCustomerId = nextIdResult[0]?.next_id || 1;
        return NextResponse.json({ customer_data, nextCustomerId });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      customer_name,
      customer_contact,
      customer_address,
      customer_shop_name,
      customer_credit_limit,
      subarea_id,
    } = body;
    if (
      !customer_name ||
      !customer_contact ||
      !customer_address ||
      !customer_shop_name ||
      !customer_credit_limit ||
      !subarea_id
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await sql(
      `INSERT INTO customers 
      (customer_name, customer_contact, customer_address, customer_shop_name, customer_credit_limit, subarea_id) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [customer_name, customer_contact, customer_address, customer_shop_name, customer_credit_limit, subarea_id]
    );
    return NextResponse.json({ id: result.insertId, ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

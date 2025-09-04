import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      salesman_name,
      salesman_bld_grp,
      salesman_contact,
      salesman_emg_contact,
      salesman_address,
      salesman_reference,
    } = body;
    if (
      !salesman_name ||
      !salesman_contact ||
      !salesman_emg_contact ||
      !salesman_address ||
      !salesman_bld_grp
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const result = await sql(
      `INSERT INTO salesman 
      (salesman_name, salesman_contact, salesman_emg_contact, salesman_address, salesman_bld_grp, salesman_reference) 
      VALUES (?, ?, ?, ?, ?, ?)`,
      [salesman_name, salesman_contact, salesman_emg_contact, salesman_address, salesman_bld_grp, salesman_reference]
    );
    return NextResponse.json({ id: result.insertId, ok: true });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


export async function GET(){
    try {
        const salesman_data = await sql(`SELECT salesman_id, salesman_name FROM salesman ORDER BY salesman_id`);
        const nextIdResult = await sql( "SELECT AUTO_INCREMENT as next_id FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'salesman'");

    const nextSalesmanId = nextIdResult[0]?.next_id || 1;
        return NextResponse.json({ salesman_data, nextSalesmanId });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }

}
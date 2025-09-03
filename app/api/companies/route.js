import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(req) {
  try {
    const { name } = await req.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "Company name is required" }, { status: 400 });
    }

    const result = await sql("INSERT INTO companies (company_name) VALUES (?)", [name.trim()]);
    const newCompany = { id: result.insertId, name: name.trim() };

    return NextResponse.json({ ok: true, data: newCompany });
  } catch (err) {
    console.error("Error creating company:", err);
    return NextResponse.json({ error: "Failed to create company" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const data = await sql(
      "SELECT company_id, company_name FROM companies ORDER BY company_id"
    );
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}


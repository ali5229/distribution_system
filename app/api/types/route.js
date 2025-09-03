import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';

export async function POST(req){
    try{
        const { name } = await req.json();
        if(!name?.trim()){
            return NextResponse.json({ error: "Type name is required" }, { status: 400 });
        }
        const result = await sql("INSERT INTO types (type_name) VALUES (?)", [name.trim()]);
        const newType = { id: result.insertId, name: name.trim() };
        
        return NextResponse.json({ ok: true, data: newType });
        
    } catch(err){
        console.error("Error creating type:", err);
        return NextResponse.json({ error: "Failed to create type" }, { status: 500 });
    }
}

export async function GET() {
  try {
    const data = await sql(
      "SELECT type_id, type_name FROM types ORDER BY type_id"
    );
    return NextResponse.json({ data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

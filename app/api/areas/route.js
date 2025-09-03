import { NextResponse } from "next/server";
import {sql, withTransaction} from "@/lib/db";

export async function POST(req){
    const {areaName } = await req.json();
    
    if(!areaName){
            return NextResponse.json({error: "Missing areaName"}, {status: 400});
        }

    try{
        const result = await withTransaction(async (conn) =>{
            const [areaRes] = await conn.execute(
                "INSERT INTO areas (name) VALUES (?)", [areaName.trim()]
            );

            const areaId = areaRes.insertId;
            return {areaId};
        });
        return NextResponse.json({ok:true, ...result});
    } catch(err){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function GET(){
    try{
        const data = await sql(
            "SELECT id AS area_id, name AS area_name FROM areas ORDER BY id" 
        );
        const nextIdres =  await sql(
            "SELECT AUTO_INCREMENT as nextId FROM information_schema.TABLES WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'areas'"
        );
        
         const nextId = nextIdres[0]?.nextId || 1;
        return NextResponse.json({data, nextId});
     }catch(err){
        return NextResponse.json({error: err.message}, {status: 500});
    }
}

export async function PUT(req){
    try{
        const {areaId, newAreaName} = await req.json();
        console.log("Received data:", { areaId, newAreaName });
         if (!areaId || !newAreaName) {
        return new Response(JSON.stringify({ error: "Area ID and new name are required" }), { status: 400 });
            }
            const result = await sql(
            "UPDATE areas SET name = ? WHERE id = ?",
            [newAreaName, areaId] );

            if (result.affectedRows === 0) {
            return new Response(JSON.stringify({ error: "Area not found" }), { status: 404 });
            }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
       } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to update area" }), { status: 500 });
     }

}

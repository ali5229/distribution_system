import {NextResponse} from "next/server";
import { sql } from '@/lib/db'

export async function GET( req, { params } ) {
    try {
    const { id } = await params;
    const result = await sql('SELECT salesman_id, salesman_name, salesman_bld_grp, salesman_contact, salesman_emg_contact, salesman_address, salesman_reference FROM salesman WHERE salesman_id = ?', [id]);
    if (!result || result.length === 0) {
      return NextResponse.json({ error: "Salesman not found" }, { status: 404 });
    }
    return NextResponse.json(result[0]);
    
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

export async function PUT( req, { params } ) {
    try{
        const { id } = await params;
        const body = await req.json();
        const { salesman_name, salesman_bld_grp, salesman_contact, salesman_emg_contact, salesman_address, salesman_reference } = body;
        const result = await sql('UPDATE salesman SET salesman_name = ?, salesman_bld_grp = ?, salesman_contact = ?, salesman_emg_contact = ?, salesman_address = ?, salesman_reference = ? WHERE salesman_id = ?', [salesman_name, salesman_bld_grp, salesman_contact, salesman_emg_contact, salesman_address, salesman_reference || null, id]);
        if (result.affectedRows === 0) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
                }
       return NextResponse.json({ ok: true, productId: id });

    } catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
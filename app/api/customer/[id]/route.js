import {NextResponse} from "next/server";
import { sql } from '@/lib/db'

export async function GET( req, { params } ) {
    try {
    const { id } = await params;
    const result = await sql
    ('SELECT c.customer_id, c.customer_name, c.customer_contact, c.customer_address, c.customer_shop_name, c.customer_credit_limit, c.subarea_id, s.area_id FROM customers c JOIN subareas s ON c.subarea_id=s.id WHERE customer_id = ?', [id]);
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
        const { customer_name, customer_contact, customer_address, customer_shop_name, customer_credit_limit, subarea_id } = body;
        const result = await sql('UPDATE customers SET customer_name = ?, customer_contact = ?, customer_address = ?, customer_shop_name = ?, customer_credit_limit = ?, subarea_id = ? WHERE customer_id = ?', [customer_name, customer_contact, customer_address, customer_shop_name, customer_credit_limit, subarea_id, id]);
        if (result.affectedRows === 0) {
                return NextResponse.json({ error: "Product not found" }, { status: 404 });
                }
       return NextResponse.json({ ok: true, productId: id });

    } catch(err){
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
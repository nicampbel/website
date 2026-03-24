// app/api/data/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

// ----------------------------------------------------------------------
// 1. GET: Fetch guests
// ----------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    // PRO-TIP: Because you set up Foreign Keys, Supabase can automatically 
    // fetch the text values from your lookup tables in a single query!
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        lookup_category ( category ),
        lookup_rsvp_status ( category )
      `)
      .order('surname', { ascending: true }); // Alphabetical order is nice for UI

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 2. PATCH: Update RSVP Status, Dietary Reqs, and Song Requests
// ----------------------------------------------------------------------
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // We need to know WHICH user is updating their RSVP
    const { user_id, rsvp_status_id, dietary_req, song_request } = body;

    if (!user_id) {
      return NextResponse.json({ success: false, error: "user_id is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('users')
      .update({ 
        rsvp_status_id, 
        dietary_req, 
        song_request,
        updated_at: new Date().toISOString() // Manually update the timestamp
      })
      .eq('user_id', user_id)
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ----------------------------------------------------------------------
// 3. POST: Create a new guest (Usually for a +1)
// ----------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Grab the incoming data. If this is a +1, it should include the main guest's ID
    const { name, surname, email, phone, plus_one_user_id, category_id } = body;

    const { data, error } = await supabase
      .from('users')
      .insert([{ 
        name, 
        surname, 
        email, 
        phone, 
        plus_one_user_id, 
        category_id: category_id || 3, // Default to 3 ('+1' category) if not provided
        rsvp_status_id: 1 // If they are adding a +1, we can assume the +1 is a 'YES'
      }])
      .select();

    if (error) throw error;
    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
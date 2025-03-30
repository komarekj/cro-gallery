import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Store from '@/models/Store';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get the search params (for future filtering)
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Build the query
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Fetch stores with filter if provided
    const stores = await Store.find(query).sort({ title: 1 }).lean();
    
    return NextResponse.json({ 
      success: true, 
      stores: stores
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Store from '@/models/Store';

export async function GET(request) {
  try {
    await connectToDatabase();
    
    // Get the search params
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 12;
    
    // Ensure page and limit are valid numbers
    const validPage = isNaN(page) || page < 1 ? 1 : page;
    const validLimit = isNaN(limit) || limit < 1 || limit > 50 ? 12 : limit;
    
    // Calculate skip value for pagination
    const skip = (validPage - 1) * validLimit;
    
    // Build the query
    const query = {};
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Count total documents for pagination metadata
    const totalStores = await Store.countDocuments(query);
    
    // Fetch stores with pagination
    const stores = await Store.find(query)
      .sort({ title: 1 })
      .skip(skip)
      .limit(validLimit)
      .lean();
    
    return NextResponse.json({ 
      success: true, 
      stores: stores,
      pagination: {
        page: validPage,
        limit: validLimit,
        totalStores,
        totalPages: Math.ceil(totalStores / validLimit)
      }
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
} 
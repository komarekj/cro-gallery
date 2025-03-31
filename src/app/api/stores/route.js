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
    
    // Ensure page is a valid number
    const validPage = isNaN(page) || page < 1 ? 1 : page;
    
    // Calculate skip value for pagination
    const skip = (validPage - 1) * limit;
    
    // Build the query
    const query = {
      isShopify: true,
      'metadata.analysis': { $exists: true }
    };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    console.log('Query parameters:', {
      page,
      validPage,
      skip,
      limit,
      category,
      query
    });
    
    // Count total documents for pagination metadata
    const totalStores = await Store.countDocuments(query);
    console.log('Total stores:', totalStores);
    
    // Fetch stores with pagination
    const stores = await Store.find(query)
      .sort({ title: 1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    
    console.log('Stores returned:', stores.length);
    console.log('First store:', stores[0]?.title);
    console.log('Last store:', stores[stores.length - 1]?.title);
    
    // Calculate total pages
    const totalPages = Math.ceil(totalStores / limit);
    
    // Ensure we don't return more pages than we have
    const currentPage = Math.min(validPage, totalPages);
    
    return NextResponse.json({ 
      success: true, 
      stores: stores,
      pagination: {
        page: currentPage,
        limit: limit,
        totalStores,
        totalPages
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
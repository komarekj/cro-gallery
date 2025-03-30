import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Store from '@/models/Store';

export async function GET() {
  try {
    await connectToDatabase();
    
    // Get all stores that match the base criteria (same as the stores endpoint)
    const baseQuery = {
      isShopify: true,
      'metadata.analysis': { $exists: true }
    };
    
    // Get total count for "All" category
    const totalStores = await Store.countDocuments(baseQuery);
    
    // Use MongoDB aggregation to count stores by category
    const categoryCounts = await Store.aggregate([
      { $match: baseQuery },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    // Format the response
    const categories = [
      { name: "All", count: totalStores }
    ];
    
    // Add each category with its count
    categoryCounts.forEach(category => {
      if (category._id) { // Skip null/undefined categories
        categories.push({
          name: category._id,
          count: category.count
        });
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      categories
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
} 
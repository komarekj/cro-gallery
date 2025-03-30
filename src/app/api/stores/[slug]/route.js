import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Store from '@/models/Store';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug is required' },
        { status: 400 }
      );
    }
    
    const store = await Store.findOne({ slug }).lean();
    
    if (!store) {
      return NextResponse.json(
        { success: false, error: 'Store not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      store: store
    });
  } catch (error) {
    console.error('Error fetching store:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch store' },
      { status: 500 }
    );
  }
} 
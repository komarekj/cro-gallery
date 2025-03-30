import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Store from '@/models/Store';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID is required' },
        { status: 400 }
      );
    }
    
    let store;
    try {
      store = await Store.findOne({ _id: new ObjectId(id) }).lean();
    } catch (error) {
      return NextResponse.json(
        { success: false, error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
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
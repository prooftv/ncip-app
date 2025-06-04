import { auth } from '@lib/firebase/config';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple Firebase check
    await auth.currentUser;
    
    return NextResponse.json({
      success: true,
      status: 'Firebase is working'
    });
  } catch (error: any) {
    console.error("Firebase test error:", error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error'
    }, { status: 500 });
  }
}

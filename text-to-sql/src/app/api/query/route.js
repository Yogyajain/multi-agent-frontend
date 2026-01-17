import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { question } = await request.json();

    // Replace this with your actual multi-agent system endpoint
    const response = await fetch('YOUR_BACKEND_API_URL', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    // Expected response format:
    // { sql: "SELECT * FROM ...", data: [{...}, {...}] }
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || 'Failed to process query' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        const json = await request.json();
        console.log(json);
        return NextResponse.json({ message: 'Data received successfully' });
    } catch (error) {
        console.error('Error parsing JSON:', error);
        return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
}
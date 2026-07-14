import { NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    execSync('git checkout src/components/Experiment.tsx');
    return NextResponse.json({ success: true, message: 'Successfully restored Experiment.tsx' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';

const leaderboard = [
  { name: 'Byte Knight', xp: 12450, streak: 9, badge: 'Logic Legend' },
  { name: 'Pixel Sage', xp: 11680, streak: 7, badge: 'Bug Slayer' },
  { name: 'Null Ninja', xp: 9820, streak: 6, badge: 'Compiler Whisperer' },
  { name: 'Hash Hero', xp: 8610, streak: 5, badge: 'Data Ranger' },
];

export async function GET() {
  return NextResponse.json({ leaderboard });
}

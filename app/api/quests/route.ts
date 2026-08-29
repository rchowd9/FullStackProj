import { NextResponse } from 'next/server';

const quests = [
  {
    id: 'binary-bounty',
    title: 'Binary Bounty',
    difficulty: 'Beginner',
    xp: 120,
    concept: 'Binary & Bits',
    prompt: 'What does the binary number 1010 represent in base 10?',
    choices: ['2', '8', '10', '16'],
    correctAnswer: '10',
    explanation: 'Binary is powers of 2: 1010 = 8 + 2 = 10.'
  },
  {
    id: 'loop-lab',
    title: 'Loop Lab',
    difficulty: 'Intermediate',
    xp: 240,
    concept: 'Loops',
    prompt: 'Which loop structure is best if you already know exactly how many times you want to repeat something?',
    choices: ['while loop', 'for loop', 'if statement', 'switch statement'],
    correctAnswer: 'for loop',
    explanation: 'A for loop is designed for a known iteration count and keeps code cleaner.'
  },
  {
    id: 'sort-vs-scan',
    title: 'Sort vs. Scan',
    difficulty: 'Advanced',
    xp: 500,
    concept: 'Algorithms',
    prompt: 'Which algorithm is typically faster for finding a value in a sorted list?',
    choices: ['Linear scan', 'Binary search', 'Bubble sort', 'Selection sort'],
    correctAnswer: 'Binary search',
    explanation: 'Binary search halves the search space each step, making it efficient for sorted arrays.'
  }
];

export async function GET() {
  return NextResponse.json({ quests });
}

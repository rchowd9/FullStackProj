import { NextResponse } from 'next/server';

const quests = [
  {
    id: 'ai-agent-goal',
    title: 'Agent Intent',
    difficulty: 'Beginner',
    xp: 120,
    category: 'AI',
    concept: 'Agents',
    prompt: 'What is the primary goal of an AI agent?',
    choices: ['To store data only', 'To perform tasks toward a goal using available inputs', 'To replace all software engineers', 'To avoid using models entirely'],
    correctAnswer: 'To perform tasks toward a goal using available inputs',
    explanation: 'AI agents are designed to interpret context and act to accomplish a goal, often using tools or reasoning.'
  },
  {
    id: 'ai-search',
    title: 'Search Strategy',
    difficulty: 'Intermediate',
    xp: 240,
    category: 'AI',
    concept: 'Reasoning',
    prompt: 'Which approach is most associated with AI systems that reason over multiple steps before responding?',
    choices: ['One-shot lookup', 'Chain-of-thought style planning', 'Manual spreadsheet entry', 'Hard-coded HTML'],
    correctAnswer: 'Chain-of-thought style planning',
    explanation: 'Modern AI systems often break a problem into intermediate reasoning steps before giving a final answer.'
  },
  {
    id: 'ml-supervised',
    title: 'Labeled Learning',
    difficulty: 'Beginner',
    xp: 150,
    category: 'Machine Learning',
    concept: 'Supervised Learning',
    prompt: 'Which type of machine learning relies on labeled examples during training?',
    choices: ['Unsupervised learning', 'Supervised learning', 'Data mining only', 'Rule-based scripting'],
    correctAnswer: 'Supervised learning',
    explanation: 'Supervised learning uses labeled inputs and outputs so the model learns a mapping from examples to target labels.'
  },
  {
    id: 'ml-overfitting',
    title: 'Bias vs Variance',
    difficulty: 'Advanced',
    xp: 500,
    category: 'Machine Learning',
    concept: 'Model Evaluation',
    prompt: 'What is the main issue when a model performs very well on training data but poorly on new data?',
    choices: ['Underfitting', 'Overfitting', 'Data leakage', 'Feature scaling'],
    correctAnswer: 'Overfitting',
    explanation: 'Overfitting happens when the model learns noise or memorizes the training set instead of generalizing to unseen examples.'
  },
  {
    id: 'mining-association',
    title: 'Pattern Mining',
    difficulty: 'Intermediate',
    xp: 270,
    category: 'Data Mining',
    concept: 'Association Rules',
    prompt: 'What is the goal of association rule mining?',
    choices: ['To generate executable code', 'To find frequent relationships among items in data', 'To compress images', 'To compare CPU speeds'],
    correctAnswer: 'To find frequent relationships among items in data',
    explanation: 'Association rule mining discovers patterns like “customers who buy A also often buy B.”'
  },
  {
    id: 'mining-dimensions',
    title: 'Feature Clutter',
    difficulty: 'Advanced',
    xp: 420,
    category: 'Data Mining',
    concept: 'Dimensionality Reduction',
    prompt: 'Why is dimensionality reduction useful in data mining?',
    choices: ['It creates more labels automatically', 'It reduces noise and makes high-dimensional data easier to analyze', 'It turns all data into binary form', 'It guarantees perfect predictions'],
    correctAnswer: 'It reduces noise and makes high-dimensional data easier to analyze',
    explanation: 'Dimensionality reduction helps simplify large feature spaces while preserving the important structure in the data.'
  }
];

export async function GET() {
  return NextResponse.json({ quests });
}

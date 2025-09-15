import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST() {
  try {
    console.log('Starting data seeding...');

    // First, check if we already have subjects (to avoid duplicates)
    const { count: subjectCount } = await supabaseAdmin
      .from('subjects')
      .select('*', { count: 'exact', head: true });

    if (subjectCount && subjectCount > 0) {
      return NextResponse.json({
        success: true,
        message: `Database already contains ${subjectCount} subjects. Skipping seed data.`
      });
    }

    // Define sample subjects
    const subjects = [
      {
        id: '1',
        name: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        icon: '📚',
        color: 'blue',
        order_index: 1,
        is_active: true
      },
      {
        id: '2', 
        name: 'React Development',
        description: 'Master React components and hooks',
        icon: '⚛️',
        color: 'green',
        order_index: 2,
        is_active: true
      },
      {
        id: '3',
        name: 'TypeScript',
        description: 'Type-safe JavaScript development',
        icon: '🔷',
        color: 'purple',
        order_index: 3,
        is_active: true
      },
      {
        id: '4',
        name: 'Node.js Backend',
        description: 'Server-side JavaScript development',
        icon: '🟢',
        color: 'emerald',
        order_index: 4,
        is_active: true
      }
    ];

    // Insert subjects
    const { error: subjectsError } = await supabaseAdmin
      .from('subjects')
      .insert(subjects);

    if (subjectsError) {
      throw subjectsError;
    }

    console.log('Subjects inserted successfully');

    // Define sample lessons
    const lessons = [
      // JavaScript Fundamentals lessons
      {
        id: '1',
        subject_id: '1',
        title: 'Variables and Data Types',
        description: 'Learn about JavaScript variables and different data types',
        content: JSON.stringify({
          type: 'multiple_choice',
          question: 'What is the correct way to declare a variable in JavaScript?',
          options: ['var x = 5', 'variable x = 5', 'v x = 5', 'declare x = 5'],
          correctAnswer: 'var x = 5',
          explanation: 'In JavaScript, variables are declared using var, let, or const keywords.'
        }),
        order_index: 1,
        xp_reward: 10,
        is_active: true
      },
      {
        id: '2',
        subject_id: '1',
        title: 'Functions and Scope',
        description: 'Understanding function declarations and variable scope',
        content: JSON.stringify({
          type: 'fill_blank',
          question: 'Complete the function to return the sum of two numbers: function add(a, b) { ___ }',
          correctAnswer: 'return a + b',
          explanation: 'Functions use the return keyword to send a value back to the caller.'
        }),
        order_index: 2,
        xp_reward: 15,
        is_active: true
      },
      {
        id: '3',
        subject_id: '1',
        title: 'Arrays and Objects',
        description: 'Working with arrays and objects in JavaScript',
        content: JSON.stringify({
          type: 'multiple_choice',
          question: 'Which method adds an element to the end of an array?',
          options: ['push()', 'pop()', 'shift()', 'unshift()'],
          correctAnswer: 'push()',
          explanation: 'The push() method adds one or more elements to the end of an array.'
        }),
        order_index: 3,
        xp_reward: 12,
        is_active: true
      },
      {
        id: '4',
        subject_id: '1',
        title: 'Control Flow',
        description: 'Learn about if statements, loops, and control flow',
        content: JSON.stringify({
          type: 'translation',
          question: 'Write an if statement that checks if a number is greater than 10',
          correctAnswer: 'if (number > 10) { }',
          explanation: 'If statements use comparison operators to evaluate conditions.'
        }),
        order_index: 4,
        xp_reward: 18,
        is_active: true
      },

      // React Development lessons
      {
        id: '5',
        subject_id: '2',
        title: 'React Components',
        description: 'Creating your first React component',
        content: JSON.stringify({
          type: 'translation',
          question: 'Convert this HTML to JSX: <div class="container">Hello World</div>',
          correctAnswer: '<div className="container">Hello World</div>',
          explanation: 'In JSX, class attribute becomes className to avoid conflicts with JavaScript keywords.'
        }),
        order_index: 1,
        xp_reward: 20,
        is_active: true
      },
      {
        id: '6',
        subject_id: '2',
        title: 'Props and State',
        description: 'Understanding component props and state management',
        content: JSON.stringify({
          type: 'multiple_choice',
          question: 'Which hook is used to manage state in functional components?',
          options: ['useEffect', 'useState', 'useContext', 'useMemo'],
          correctAnswer: 'useState',
          explanation: 'useState is the primary hook for managing component state in React functional components.'
        }),
        order_index: 2,
        xp_reward: 25,
        is_active: true
      },
      {
        id: '7',
        subject_id: '2',
        title: 'Event Handling',
        description: 'Learn how to handle events in React',
        content: JSON.stringify({
          type: 'fill_blank',
          question: 'Complete the click handler: <button onClick={___}>Click me</button>',
          correctAnswer: 'handleClick',
          explanation: 'Event handlers in React are typically functions passed as props to elements.'
        }),
        order_index: 3,
        xp_reward: 15,
        is_active: true
      },

      // TypeScript lessons
      {
        id: '8',
        subject_id: '3',
        title: 'Type Annotations',
        description: 'Basic type annotations in TypeScript',
        content: JSON.stringify({
          type: 'fill_blank',
          question: 'Add type annotation to this variable: let name___ = "John";',
          correctAnswer: ': string',
          explanation: 'TypeScript uses colon syntax to add type annotations to variables.'
        }),
        order_index: 1,
        xp_reward: 12,
        is_active: true
      },
      {
        id: '9',
        subject_id: '3',
        title: 'Interfaces',
        description: 'Defining object shapes with interfaces',
        content: JSON.stringify({
          type: 'multiple_choice',
          question: 'What keyword is used to define an interface in TypeScript?',
          options: ['class', 'type', 'interface', 'struct'],
          correctAnswer: 'interface',
          explanation: 'The interface keyword is used to define the structure of objects in TypeScript.'
        }),
        order_index: 2,
        xp_reward: 18,
        is_active: true
      },

      // Node.js Backend lessons
      {
        id: '10',
        subject_id: '4',
        title: 'Creating a Server',
        description: 'Set up your first Node.js server',
        content: JSON.stringify({
          type: 'translation',
          question: 'Complete this Express server setup',
          correctAnswer: 'const express = require("express"); const app = express();',
          explanation: 'Express is a popular framework for creating web servers in Node.js.'
        }),
        order_index: 1,
        xp_reward: 22,
        is_active: true
      }
    ];

    // Insert lessons
    const { error: lessonsError } = await supabaseAdmin
      .from('lessons')
      .insert(lessons);

    if (lessonsError) {
      throw lessonsError;
    }

    console.log('Lessons inserted successfully');

    // Create some sample achievements
    const achievements = [
      {
        id: '1',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🎯',
        category: 'lessons',
        requirement: 1,
        xp_reward: 10,
        is_active: true,
        order_index: 1
      },
      {
        id: '2',
        name: 'Getting Started',
        description: 'Complete 5 lessons',
        icon: '📚',
        category: 'lessons',
        requirement: 5,
        xp_reward: 25,
        is_active: true,
        order_index: 2
      },
      {
        id: '3',
        name: 'Dedicated Learner',
        description: 'Complete 10 lessons',
        icon: '🏆',
        category: 'lessons',
        requirement: 10,
        xp_reward: 50,
        is_active: true,
        order_index: 3
      },
      {
        id: '4',
        name: 'Streak Starter',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        category: 'streak',
        requirement: 3,
        xp_reward: 15,
        is_active: true,
        order_index: 4
      },
      {
        id: '5',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '⚡',
        category: 'streak',
        requirement: 7,
        xp_reward: 35,
        is_active: true,
        order_index: 5
      },
      {
        id: '6',
        name: 'XP Hunter',
        description: 'Earn 100 XP',
        icon: '💎',
        category: 'xp',
        requirement: 100,
        xp_reward: 20,
        is_active: true,
        order_index: 6
      }
    ];

    // Insert achievements
    const { error: achievementsError } = await supabaseAdmin
      .from('achievements')
      .insert(achievements);

    if (achievementsError) {
      throw achievementsError;
    }

    console.log('Achievements inserted successfully');

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully!',
      data: {
        subjects: subjects.length,
        lessons: lessons.length,
        achievements: achievements.length
      }
    });

  } catch (error: any) {
    console.error('Seeding error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        message: 'Failed to seed database'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to seed the database with sample data",
    instructions: [
      "1. Ensure the database schema is initialized first",
      "2. Send a POST request to this endpoint to populate with sample data"
    ]
  });
}
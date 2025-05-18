import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Lesson {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  duration: string;
  category: string;
}

const LessonTracker: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([
    {
      id: 1,
      title: "Introduction to React",
      description: "Learn the basics of React including components, props, and state",
      completed: true,
      duration: "45 minutes",
      category: "Web Development"
    },
    {
      id: 2,
      title: "React Hooks Deep Dive",
      description: "Master useState, useEffect, useContext and custom hooks",
      completed: false,
      duration: "60 minutes",
      category: "Web Development"
    },
    {
      id: 3,
      title: "TypeScript Fundamentals",
      description: "Understand types, interfaces, and TypeScript configuration",
      completed: false,
      duration: "55 minutes",
      category: "Programming"
    },
    {
      id: 4,
      title: "CSS Grid & Flexbox",
      description: "Modern layout techniques for responsive design",
      completed: true,
      duration: "40 minutes",
      category: "Web Design"
    }
  ]);

  const toggleLessonCompletion = (id: number) => {
    setLessons(prev => 
      prev.map(lesson => 
        lesson.id === id ? { ...lesson, completed: !lesson.completed } : lesson
      )
    );
  };

  // Group lessons by category
  const lessonsByCategory = lessons.reduce((acc, lesson) => {
    if (!acc[lesson.category]) {
      acc[lesson.category] = [];
    }
    acc[lesson.category].push(lesson);
    return acc;
  }, {} as Record<string, Lesson[]>);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">Lesson Tracker</h1>
      <p className="text-gray-600 dark:text-gray-300 mb-6">Track your progress through various lessons and courses</p>
      
      <div className="mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Your Progress</h2>
            <div className="mt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Completed Lessons</span>
                <span className="text-sm font-medium text-gray-800 dark:text-white">
                  {lessons.filter(l => l.completed).length} / {lessons.length}
                </span>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                <div 
                  style={{ width: `${(lessons.filter(l => l.completed).length / lessons.length) * 100}%` }} 
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {Object.entries(lessonsByCategory).map(([category, categoryLessons]) => (
        <div key={category} className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{category}</h2>
          <div className="space-y-4">
            {categoryLessons.map(lesson => (
              <div 
                key={lesson.id} 
                className={`p-5 rounded-lg shadow border-l-4 ${
                  lesson.completed 
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/10' 
                    : 'border-yellow-500 bg-white dark:bg-gray-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">{lesson.title}</h3>
                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{lesson.description}</p>
                    <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <span className="mr-2">Duration: {lesson.duration}</span>
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => toggleLessonCompletion(lesson.id)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        lesson.completed
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                      }`}
                    >
                      {lesson.completed ? 'Completed' : 'Mark Complete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default LessonTracker;
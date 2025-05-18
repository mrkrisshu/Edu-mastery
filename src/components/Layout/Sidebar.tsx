import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  CheckSquare, 
  Calendar, 
  BookCopy, 
  FileText, 
  Video, 
  Clock,
  BarChart3,
  BookOpenCheck, // Added for Lesson Tracker (if not available, use another appropriate icon)
} from 'lucide-react';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', icon: Home, path: '/app' },
  { name: 'Flashcards', icon: BookOpen, path: '/app/flashcards' },
  { name: 'Quizzes', icon: BarChart3, path: '/app/quiz' },
  { name: 'Habits', icon: CheckSquare, path: '/app/habits' },
  { name: 'Courses', icon: BookCopy, path: '/app/courses' },
  { name: 'Reading Log', icon: BookOpen, path: '/app/reading' },
  { name: 'Notes', icon: FileText, path: '/app/notes' },
  { name: 'Videos', icon: Video, path: '/app/videos' },
  { name: 'Schedule', icon: Calendar, path: '/app/schedule' },
  { name: 'Lesson Tracker', icon: BookOpenCheck, path: '/app/lessons' }, // Added Lesson Tracker
];

const Sidebar: React.FC = () => {
  return (
    <motion.div 
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen sticky top-0 pt-16"
    >
      <div className="flex-1 overflow-y-auto py-8 px-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/app'}
              className={({ isActive }) => 
                `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' 
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon 
                    className={`mr-3 h-5 w-5 ${
                      isActive 
                        ? 'text-primary-600 dark:text-primary-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`} 
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <Clock className="w-5 h-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h3 className="text-sm font-semibold text-primary-700 dark:text-primary-300">Study Streak</h3>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">7 Days</p>
              <p className="text-xs text-primary-600/70 dark:text-primary-400/70">Keep it up!</p>
            </div>
            <div className="flex space-x-1">
              {[...Array(7)].map((_, i) => (
                <div 
                  key={i} 
                  className={`h-8 w-1.5 rounded-full ${
                    i < 7 
                      ? 'bg-primary-500 dark:bg-primary-400' 
                      : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
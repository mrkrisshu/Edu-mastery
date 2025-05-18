import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  flashcardsData, 
  quizzesData, 
  habitsData, 
  coursesData, 
  readingLogsData,
  notesData,
  videosData,
  lessonsData,
} from '../data/mockData';

interface AppContextType {
  flashcards: any[];
  quizzes: any[];
  habits: any[];
  courses: any[];
  readingLogs: any[];
  notes: any[];
  videos: any[];
  lessons: any[];
  userData: {
    name: string;
    email: string;
    avatar: string;
    progress: {
      completedCourses: number;
      totalCourses: number;
      completedFlashcards: number;
      totalFlashcards: number;
      streak: number;
    };
  };
  updateFlashcards: (updatedFlashcards: any[]) => void;
  updateQuizzes: (updatedQuizzes: any[]) => void;
  updateHabits: (updatedHabits: any[]) => void;
  updateCourses: (updatedCourses: any[]) => void;
  updateReadingLogs: (updatedReadingLogs: any[]) => void;
  updateNotes: (updatedNotes: any[]) => void;
  updateVideos: (updatedVideos: any[]) => void;
  updateLessons: (updatedLessons: any[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [flashcards, setFlashcards] = useState<any[]>(flashcardsData);
  const [quizzes, setQuizzes] = useState<any[]>(quizzesData);
  const [habits, setHabits] = useState<any[]>(habitsData);
  const [courses, setCourses] = useState<any[]>(coursesData);
  const [readingLogs, setReadingLogs] = useState<any[]>(readingLogsData);
  const [notes, setNotes] = useState<any[]>(notesData);
  const [videos, setVideos] = useState<any[]>(videosData);
  const [lessons, setLessons] = useState<any[]>(lessonsData);
  
  const [userData] = useState({
    name: 'Krishna Bantola',
    email: 'mrkrisshu@gmail.com',
    avatar: 'https://drive.google.com/file/d/1s8ZzOpYle8kEh1T4rYoxxOHpBMVsUyQa',
    progress: {
      completedCourses: 3,
      totalCourses: 12,
      completedFlashcards: 128,
      totalFlashcards: 300,
      streak: 7,
    },
  });

  // Save data to localStorage when updated
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem('quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('habits', JSON.stringify(habits));
  }, [habits]);

  // Functions to update data
  const updateFlashcards = (updatedFlashcards: any[]) => {
    setFlashcards(updatedFlashcards);
  };

  const updateQuizzes = (updatedQuizzes: any[]) => {
    setQuizzes(updatedQuizzes);
  };

  const updateHabits = (updatedHabits: any[]) => {
    setHabits(updatedHabits);
  };

  const updateCourses = (updatedCourses: any[]) => {
    setCourses(updatedCourses);
  };

  const updateReadingLogs = (updatedReadingLogs: any[]) => {
    setReadingLogs(updatedReadingLogs);
  };

  const updateNotes = (updatedNotes: any[]) => {
    setNotes(updatedNotes);
  };

  const updateVideos = (updatedVideos: any[]) => {
    setVideos(updatedVideos);
  };

  const updateLessons = (updatedLessons: any[]) => {
    setLessons(updatedLessons);
  };

  return (
    <AppContext.Provider value={{
      flashcards,
      quizzes,
      habits,
      courses,
      readingLogs,
      notes,
      videos,
      lessons,
      userData,
      updateFlashcards,
      updateQuizzes,
      updateHabits,
      updateCourses,
      updateReadingLogs,
      updateNotes,
      updateVideos,
      updateLessons,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import FlashcardSystem from './pages/FlashcardSystem';
import QuizEngine from './pages/QuizEngine';
import HabitTracker from './pages/HabitTracker';
import CoursesCatalog from './pages/CoursesCatalog';
import ReadingLog from './pages/ReadingLog';
import NoteEditor from './pages/NoteEditor';
import VideoPlayer from './pages/VideoPlayer.tsx';
import LessonTracker from './pages/LessonTracker.tsx';
import Schedule from './pages/Schedule.tsx'; // Import the Schedule component
import LandingPage from './pages/LandingPage';
import LoadingScreen from './components/UI/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate initial loading of data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/app" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="flashcards" element={<FlashcardSystem />} />
                <Route path="quiz" element={<QuizEngine />} />
                <Route path="habits" element={<HabitTracker />} />
                <Route path="courses" element={<CoursesCatalog />} />
                <Route path="reading" element={<ReadingLog />} />
                <Route path="notes" element={<NoteEditor />} />
                <Route path="videos" element={<VideoPlayer videoUrl="https://www.youtube.com/watch?v=v9bOWjwdTlg&t=6073s" />} />
                <Route path="videos/tutorial" element={<VideoPlayer videoUrl="https://www.youtube.com/watch?v=ix9cRaBkVe0&t=16328s" />} />
                <Route path="schedule" element={<Schedule />} />
                <Route path="lessons" element={<LessonTracker />} /> {/* Added Lesson Tracker route */}
              </Route>
            </Routes>
          </AnimatePresence>
        </Router>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
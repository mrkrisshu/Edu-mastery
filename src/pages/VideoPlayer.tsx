// src/pages/VideoPlayer.tsx
import React, { useState, useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { motion } from 'framer-motion';
import { Clock, Volume2, VolumeX, Maximize, Minimize, PlayCircle, PauseCircle, SkipForward, SkipBack, MessageSquare } from 'lucide-react';

// Define types for our component
interface Comment {
  id: number;
  timestamp: number;
  text: string;
  author: string;
  createdAt: string;
}

interface VideoPlayerProps {
  videoUrl: string;
}

// Helper function for time formatting
const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl }) => {
  const playerRef = useRef<ReactPlayer>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [showCommentForm, setShowCommentForm] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.7);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [controlsVisible, setControlsVisible] = useState<boolean>(true);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  
  // Load comments from localStorage on initial render
  useEffect(() => {
    const savedComments = localStorage.getItem(`video-comments-${videoUrl}`);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (error) {
        console.error('Failed to parse saved comments', error);
      }
    }
  }, [videoUrl]);

  // Save comments to localStorage when they change
  useEffect(() => {
    localStorage.setItem(`video-comments-${videoUrl}`, JSON.stringify(comments));
  }, [comments, videoUrl]);

  // Handle video metadata loaded and progress
  const handleDuration = (duration: number): void => {
    setDuration(duration);
  };

  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }): void => {
    setCurrentTime(state.playedSeconds);
  };

  // Toggle play/pause
  const togglePlay = (): void => {
    setIsPlaying(!isPlaying);
  };

  // Handle progress bar click
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (!playerRef.current) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / rect.width;
    const newTime = clickPosition * duration;
    
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  // Add a new comment at current timestamp
  const addComment = (): void => {
    if (newComment.trim() === '') return;
    
    const newCommentObj: Comment = {
      id: Date.now(),
      timestamp: currentTime,
      text: newComment,
      author: 'You', // Could be dynamic based on user authentication
      createdAt: new Date().toISOString()
    };
    
    setComments(prevComments => [...prevComments, newCommentObj]);
    setNewComment('');
    setShowCommentForm(false);
  };

  // Jump to timestamp
  const jumpToTimestamp = (timestamp: number): void => {
    if (!playerRef.current) return;
    
    playerRef.current.seekTo(timestamp);
    setCurrentTime(timestamp);
    if (!isPlaying) setIsPlaying(true);
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  // Handle playback rate change
  const handlePlaybackRateChange = (rate: number): void => {
    setPlaybackRate(rate);
  };

  // Toggle fullscreen
  const toggleFullScreen = (): void => {
    if (!videoContainerRef.current) return;
    
    if (!isFullScreen) {
      if (videoContainerRef.current.requestFullscreen) {
        videoContainerRef.current.requestFullscreen();
      } else if ((videoContainerRef.current as any).webkitRequestFullscreen) {
        (videoContainerRef.current as any).webkitRequestFullscreen();
      } else if ((videoContainerRef.current as any).msRequestFullscreen) {
        (videoContainerRef.current as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (
        e.target instanceof HTMLElement && 
        (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT')
      ) return;
      
      if (!playerRef.current) return;
      
      switch(e.key) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          playerRef.current.seekTo(currentTime + 10);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          playerRef.current.seekTo(currentTime - 10);
          break;
        case 'f':
          e.preventDefault();
          toggleFullScreen();
          break;
        case 'm':
          e.preventDefault();
          setVolume(volume === 0 ? 0.7 : 0);
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, currentTime, volume]);

  // Listen for fullscreen change events
  useEffect(() => {
    const handleFullScreenChange = (): void => {
      setIsFullScreen(
        !!document.fullscreenElement || 
        !!(document as any).webkitFullscreenElement || 
        !!(document as any).msFullscreenElement
      );
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullScreenChange);
    document.addEventListener('msfullscreenchange', handleFullScreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullScreenChange);
      document.removeEventListener('msfullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Sort comments by timestamp
  const sortedComments = [...comments].sort((a, b) => a.timestamp - b.timestamp);

  // Check if there are comments around the current timestamp
  const activeComments = sortedComments.filter(
    comment => Math.abs(comment.timestamp - currentTime) < 3
  );

  // Hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const handleMouseMove = () => {
      setControlsVisible(true);
      clearTimeout(timeout);
      
      timeout = setTimeout(() => {
        if (isPlaying) {
          setControlsVisible(false);
        }
      }, 3000);
    };
    
    const videoContainer = videoContainerRef.current;
    if (videoContainer) {
      videoContainer.addEventListener('mousemove', handleMouseMove);
      videoContainer.addEventListener('mouseenter', handleMouseMove);
      videoContainer.addEventListener('mouseleave', () => {
        if (isPlaying) {
          setControlsVisible(false);
        }
      });
    }
    
    return () => {
      clearTimeout(timeout);
      if (videoContainer) {
        videoContainer.removeEventListener('mousemove', handleMouseMove);
        videoContainer.removeEventListener('mouseenter', handleMouseMove);
        videoContainer.removeEventListener('mouseleave', () => {});
      }
    };
  }, [isPlaying]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6"
    >
      <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Interactive Video Player</h1>
      
      <div 
        ref={videoContainerRef}
        className="relative overflow-hidden rounded-lg shadow-lg bg-black mb-6"
        style={{ aspectRatio: '16/9' }}
      >
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        )}
        
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          playbackRate={playbackRate}
          onDuration={handleDuration}
          onProgress={handleProgress}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onBuffer={() => setIsBuffering(true)}
          onBufferEnd={() => setIsBuffering(false)}
          config={{
            youtube: {
              playerVars: { 
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                controls: 0,
                disablekb: 1
              }
            },
            file: {
              attributes: {
                controlsList: 'nodownload'
              }
            }
          }}
        />
        
        {activeComments.length > 0 && (
          <div className="absolute bottom-20 left-4 right-4 bg-gray-900 bg-opacity-75 text-white p-3 rounded-lg z-20 shadow-lg">
            {activeComments.map(comment => (
              <div key={comment.id} className="mb-1 last:mb-0">
                <span className="font-semibold text-primary-400">{comment.author}:</span> {comment.text}
              </div>
            ))}
          </div>
        )}
        
        <div 
          className={`absolute inset-0 flex items-center justify-center cursor-pointer transition-opacity duration-300 ${
            !isPlaying && !controlsVisible ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={togglePlay}
        >
          <div className="rounded-full bg-gray-900 bg-opacity-75 p-4">
            <PlayCircle size={50} className="text-white" />
          </div>
        </div>
        
        <div 
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent px-4 py-3 transition-opacity duration-300 ${
            controlsVisible || !isPlaying ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Progress bar with comment markers */}
          <div className="relative mb-2 h-1 group" onClick={handleProgressClick}>
            <div className="absolute inset-0 rounded-full bg-gray-600 overflow-hidden">
              <div 
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            
            {/* Comment markers */}
            {sortedComments.map((comment) => (
              <div
                key={comment.id}
                className="absolute top-0 bottom-0 w-1 bg-yellow-400 cursor-pointer hover:scale-150 transition-transform"
                style={{ left: `${(comment.timestamp / duration) * 100}%`, transform: 'translateX(-50%)' }}
                title={`${comment.author}: ${comment.text}`}
                onClick={(e) => {
                  e.stopPropagation();
                  jumpToTimestamp(comment.timestamp);
                }}
              />
            ))}
            
            {/* Hover progress preview */}
            <div className="absolute inset-0 rounded-full h-1 scale-y-0 group-hover:scale-y-150 transition-transform bg-gray-600 opacity-0 group-hover:opacity-100" />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Play/Pause button */}
              <button
                className="text-white hover:text-primary-400 transition-colors focus:outline-none"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <PauseCircle size={22} /> : <PlayCircle size={22} />}
              </button>
              
              {/* Skip backward/forward buttons */}
              <button
                className="text-white hover:text-primary-400 transition-colors focus:outline-none"
                onClick={() => playerRef.current?.seekTo(currentTime - 10)}
                aria-label="Rewind 10 seconds"
              >
                <SkipBack size={18} />
              </button>
              
              <button
                className="text-white hover:text-primary-400 transition-colors focus:outline-none"
                onClick={() => playerRef.current?.seekTo(currentTime + 10)}
                aria-label="Forward 10 seconds"
              >
                <SkipForward size={18} />
              </button>
              
              {/* Time display */}
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Comment button */}
              <button
                className="text-white hover:text-primary-400 transition-colors focus:outline-none"
                onClick={() => setShowCommentForm(!showCommentForm)}
                aria-label="Add comment"
              >
                <MessageSquare size={18} />
              </button>
              
              {/* Volume control */}
              <div className="flex items-center">
                <button
                  className="text-white hover:text-primary-400 transition-colors focus:outline-none mr-2"
                  onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
                  aria-label={volume === 0 ? 'Unmute' : 'Mute'}
                >
                  {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 rounded-lg appearance-none bg-gray-600 cursor-pointer"
                />
              </div>
              
              {/* Playback speed */}
              <select
                value={playbackRate}
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="bg-transparent text-white text-sm border border-gray-600 rounded px-1 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="0.5" className="bg-gray-800">0.5x</option>
                <option value="0.75" className="bg-gray-800">0.75x</option>
                <option value="1" className="bg-gray-800">1x</option>
                <option value="1.25" className="bg-gray-800">1.25x</option>
                <option value="1.5" className="bg-gray-800">1.5x</option>
                <option value="2" className="bg-gray-800">2x</option>
              </select>
              
              {/* Fullscreen button */}
              <button
                className="text-white hover:text-primary-400 transition-colors focus:outline-none"
                onClick={toggleFullScreen}
                aria-label={isFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
              >
                {isFullScreen ? <Minimize size={18} /> : <Maximize size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Comment form */}
      {showCommentForm && (
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Add Comment</h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">at {formatTime(currentTime)}</span>
          </div>
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="What did you think about this part of the video?"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            rows={3}
          />
          
          <div className="mt-3 flex justify-end space-x-3">
            <button
              onClick={() => setShowCommentForm(false)}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            
            <button
              onClick={addComment}
              disabled={!newComment.trim()}
              className={`px-4 py-2 text-white rounded-lg transition-colors ${
                newComment.trim() 
                  ? 'bg-primary-600 hover:bg-primary-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              Save Comment
            </button>
          </div>
        </div>
      )}
      
      {/* Comments section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Video Comments</h2>
        </div>
        
                {sortedComments.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            <MessageSquare className="mx-auto mb-3 h-10 w-10" />
            <p>No comments yet. Add one to highlight important parts of the video!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedComments.map(comment => (
              <div key={comment.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                  <button
                    onClick={() => jumpToTimestamp(comment.timestamp)}
                    className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Clock size={14} className="mr-1" />
                    {formatTime(comment.timestamp)}
                  </button>
                </div>
                
                <p className="text-gray-700 dark:text-gray-300 mb-2">{comment.text}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleString()}
                  </span>
                  
                  <button
                    onClick={() => setComments(comments.filter(c => c.id !== comment.id))}
                    className="text-sm text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Keyboard shortcuts info */}
      <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Keyboard Shortcuts</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          <div className="flex items-center">
            <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm font-mono mr-2">Space</span>
            <span className="text-gray-700 dark:text-gray-300">Play/Pause</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm font-mono mr-2">←</span>
            <span className="text-gray-700 dark:text-gray-300">Rewind 10s</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm font-mono mr-2">→</span>
            <span className="text-gray-700 dark:text-gray-300">Forward 10s</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm font-mono mr-2">F</span>
            <span className="text-gray-700 dark:text-gray-300">Fullscreen</span>
          </div>
          <div className="flex items-center">
            <span className="inline-block bg-gray-200 dark:bg-gray-700 rounded px-2 py-1 text-sm font-mono mr-2">M</span>
            <span className="text-gray-700 dark:text-gray-300">Mute/Unmute</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VideoPlayer;
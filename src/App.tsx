import React from 'react';
import { QuizProvider, useQuiz } from './context/QuizContext';
import WelcomeScreen from './screens/WelcomeScreen';
import CameraSetupScreen from './screens/CameraSetupScreen';
import QuizScreen from './screens/QuizScreen';
import ResultsScreen from './screens/ResultsScreen';

function AppRouter() {
  const { state } = useQuiz();
  const { screen } = state;

  if (screen === 'welcome') return <WelcomeScreen />;
  if (screen === 'camera-setup') return <CameraSetupScreen />;
  if (screen === 'quiz' || screen === 'feedback') return <QuizScreen />;
  if (screen === 'results') return <ResultsScreen />;
  return <WelcomeScreen />;
}

export default function App() {
  return (
    <QuizProvider>
      <AppRouter />
    </QuizProvider>
  );
}

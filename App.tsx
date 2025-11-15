import React, { useState, createContext, useContext, ReactNode } from 'react';
import type { User, Question } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import LoginPage from './components/LoginPage';
import UserView from './components/UserView';
import AdminView from './components/AdminView';

const ADMIN_PHONE = '13693263577';

interface AppContextType {
  currentUser: User | 'ADMIN' | null;
  users: User[];
  questions: Question[];
  login: (nickname: string, phone: string) => boolean;
  logout: () => void;
  register: (nickname: string, phone: string) => boolean;
  addQuestion: (text: string) => void;
  deleteQuestion: (questionId: string) => void;
  answerQuestion: (questionId: string, answer: string) => void;
  getUserById: (id: string) => User | undefined;
}

const AppContext = createContext<AppContextType | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useLocalStorage<User[]>('qa_users', []);
  const [questions, setQuestions] = useLocalStorage<Question[]>('qa_questions', []);
  const [currentUser, setCurrentUser] = useLocalStorage<User | 'ADMIN' | null>('qa_currentUser', null);

  const login = (nickname: string, phone: string): boolean => {
    if (phone === ADMIN_PHONE) {
      setCurrentUser('ADMIN');
      return true;
    }
    
    // Prioritize phone number for login, as it's a more unique identifier.
    const userByPhone = phone ? users.find(u => u.phone === phone) : undefined;
    if (userByPhone) {
      setCurrentUser(userByPhone);
      return true;
    }

    // If no user is found by phone, try nickname.
    const userByNickname = nickname ? users.find(u => u.nickname.toLowerCase() === nickname.toLowerCase()) : undefined;
    if (userByNickname) {
      setCurrentUser(userByNickname);
      return true;
    }
    
    return false;
  };

  const register = (nickname: string, phone: string): boolean => {
    // Ensure both nickname and phone are unique before registering.
    if (users.some(u => u.nickname.toLowerCase() === nickname.toLowerCase() || u.phone === phone)) {
      return false; // User with this nickname or phone already exists
    }
    const newUser: User = { id: Date.now().toString(), nickname, phone };
    setUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const addQuestion = (text: string) => {
    if (currentUser && currentUser !== 'ADMIN') {
      const newQuestion: Question = {
        id: Date.now().toString(),
        text,
        authorId: currentUser.id,
        timestamp: Date.now(),
        deletedByUser: false,
      };
      setQuestions(prev => [newQuestion, ...prev]);
    }
  };

  const deleteQuestion = (questionId: string) => {
    setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, deletedByUser: true } : q));
  };
  
  const answerQuestion = (questionId: string, answer: string) => {
      setQuestions(prev => prev.map(q => q.id === questionId ? { ...q, answer } : q));
  };

  const getUserById = (id: string) => users.find(u => u.id === id);

  const value = {
    currentUser,
    users,
    questions,
    login,
    logout,
    register,
    addQuestion,
    deleteQuestion,
    answerQuestion,
    getUserById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const Main = () => {
    const { currentUser } = useApp();
    return (
        <div className="min-h-screen bg-background">
            {currentUser === null && <LoginPage />}
            {currentUser === 'ADMIN' && <AdminView />}
            {currentUser && typeof currentUser === 'object' && <UserView />}
        </div>
    );
}

function App() {
  return (
    <AppProvider>
      <Main />
    </AppProvider>
  );
}

export default App;

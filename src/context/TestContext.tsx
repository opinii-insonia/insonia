import React, { createContext, useContext, useState } from 'react';

export type UserInfo = {
  nome: string;
  idade: string;
  sexo: string;
  cidade: string;
};

export type ContactInfo = {
  telefone: string;
  email: string;
};

interface TestContextType {
  userInfo: UserInfo;
  setUserInfo: (info: UserInfo) => void;
  epworthAnswers: number[];
  setEpworthAnswers: (answers: number[]) => void;
  insomniaAnswers: number[];
  setInsomniaAnswers: (answers: number[]) => void;
  contactInfo: ContactInfo;
  setContactInfo: (info: ContactInfo) => void;
  resetTest: () => void;
}

const defaultUserInfo = { nome: '', idade: '', sexo: '', cidade: '' };
const defaultContactInfo = { telefone: '', email: '' };

const TestContext = createContext<TestContextType | undefined>(undefined);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo>(defaultUserInfo);
  const [epworthAnswers, setEpworthAnswers] = useState<number[]>(Array(8).fill(-1));
  const [insomniaAnswers, setInsomniaAnswers] = useState<number[]>(Array(7).fill(-1));
  const [contactInfo, setContactInfo] = useState<ContactInfo>(defaultContactInfo);

  const resetTest = () => {
    setUserInfo(defaultUserInfo);
    setEpworthAnswers(Array(8).fill(-1));
    setInsomniaAnswers(Array(7).fill(-1));
    setContactInfo(defaultContactInfo);
  };

  return (
    <TestContext.Provider value={{
      userInfo, setUserInfo,
      epworthAnswers, setEpworthAnswers,
      insomniaAnswers, setInsomniaAnswers,
      contactInfo, setContactInfo,
      resetTest
    }}>
      {children}
    </TestContext.Provider>
  );
};

export const useTestContext = () => {
  const context = useContext(TestContext);
  if (!context) throw new Error("useTestContext must be used within a TestProvider");
  return context;
};
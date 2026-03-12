import React, { createContext, useContext, useState, useEffect } from 'react';

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

const LOCAL_STORAGE_KEY = '@insonia_draft';

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // Inicializa o state a partir do localStorage ou usa os valores default
  const [userInfo, setUserInfo] = useState<UserInfo>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_user`);
    return saved ? JSON.parse(saved) : defaultUserInfo;
  });
  
  const [epworthAnswers, setEpworthAnswers] = useState<number[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_epworth`);
    return saved ? JSON.parse(saved) : Array(8).fill(-1);
  });
  
  const [insomniaAnswers, setInsomniaAnswers] = useState<number[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_insomnia`);
    return saved ? JSON.parse(saved) : Array(7).fill(-1);
  });
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_contact`);
    return saved ? JSON.parse(saved) : defaultContactInfo;
  });

  // Salva no localStorage sempre que algum valor mudar
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_user`, JSON.stringify(userInfo));
  }, [userInfo]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_epworth`, JSON.stringify(epworthAnswers));
  }, [epworthAnswers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_insomnia`, JSON.stringify(insomniaAnswers));
  }, [insomniaAnswers]);

  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_contact`, JSON.stringify(contactInfo));
  }, [contactInfo]);

  const resetTest = () => {
    setUserInfo(defaultUserInfo);
    setEpworthAnswers(Array(8).fill(-1));
    setInsomniaAnswers(Array(7).fill(-1));
    setContactInfo(defaultContactInfo);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_user`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_epworth`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_insomnia`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_contact`);
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
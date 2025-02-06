import { createContext, useState } from 'react';

// Separate context creation
export const LanguageContext = createContext();

// Make component export default
export default function LanguageContextProvider({children}) {
    const [language, setLanguage] = useState('Eus');

    function toggleLanguage() {
        language === "Eus" ? setLanguage("Es") : setLanguage("Eus");
    }

    return (
        <LanguageContext.Provider value={{language, toggleLanguage}}>
            {children}
        </LanguageContext.Provider>
    )
}
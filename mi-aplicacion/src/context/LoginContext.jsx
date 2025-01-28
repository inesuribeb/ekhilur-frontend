import { createContext, useState, useContext } from "react";
import { LanguageContext } from "./LanguageContext";
import "./LoginContext.css";

export const LoginContext = createContext();

export default function LoginContextProvider({children}) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const { language } = useContext(LanguageContext);

    const checkAuth = () => {
        const cookies = document.cookie.split(';');
        const hasToken = cookies.some(cookie => cookie.trim().startsWith('token='));
        
        if (!hasToken && isLoggedIn) {
            setShowModal(true);
            setIsLoggedIn(false);
            window.location.href = '/'; // Usamos window.location en lugar de useNavigate
        }
        
        setIsLoggedIn(hasToken);
    };

    const handleModalClose = () => {
        setShowModal(false);
        window.location.href = '/'; // Usamos window.location en lugar de useNavigate
    };

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, checkAuth }}>
            {children}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3 className="modal-title">{translate.sessionExpired[language]}</h3>
                        <p className="modal-text">{translate.inactivityDetected[language]}</p>
                        <button 
                            onClick={handleModalClose}
                            className="modal-button"
                        >
                            {translate.accept[language]}
                        </button>
                    </div>
                </div>
            )}
        </LoginContext.Provider>
    );
}
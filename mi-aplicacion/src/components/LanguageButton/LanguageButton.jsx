import { useContext } from 'react';
import { LanguageContext } from '../../context/LanguageContext';

const LanguageButton = ({ isBlinking }) => {
    const { language, toggleLanguage } = useContext(LanguageContext);
    return (
        <button
            className={`language-toggle-button-${language.toLowerCase()} ${isBlinking ? 'blink' : ''}`}
        >
            {language === 'Eus' ? 'Es' : 'Eus'}
        </button>
    );
};

export default LanguageButton;
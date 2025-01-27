import {useContext} from 'react';
import {LanguageContext} from '../../context/LanguageContext';

const LanguageButton = ({}) => {
    const {language, toggleLanguage} = useContext(LanguageContext);
    return (
        <button onClick={toggleLanguage}
        className = 'language-toggle-button'>
            {language === 'Eus' ? 'Es' : 'Eus'}
        </button>
    );
};

export default LanguageButton;

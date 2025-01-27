import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';
import {login} from '../../utils/apiController'
import './Login.css';

const LoginForm = () => {
    const {language, toggleLanguage} = useContext(LanguageContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const validateForm = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'El correo electrónico es obligatorio';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'El correo electrónico no es válido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            setIsLoading(true);
            try {
                const response = await login(formData.email, formData.password);
                
                if (response.success) {
                    setSuccessMessage('Inicio de sesión exitoso');
                    setFormData({
                        email: '',
                        password: ''
                    });
                    navigate('/mapak');
                } else {
                    setErrors({ submit: response.message || 'Error al iniciar sesión' });
                }
            } catch (error) {
                setErrors({ submit: 'Error al procesar la solicitud' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="login-container-dsk">
                <h2>{translate.login[language]}</h2>
                <button onClick={toggleLanguage} className='language-toggle-button'>{language === "Eus" ? "Castellano" : "Euskara"}</button>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-dsk">
                        <label htmlFor="email">{translate.email[language]}</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>
                    <div className="form-group-dsk">
                        <label htmlFor="password">{translate.password[language]}</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={isLoading}
                        />
                        {errors.password && <span className="error">{errors.password}</span>}
                    </div>
                    {errors.submit && <div className="error">{errors.submit}</div>}
                    <button className="login-button-dsk" type="submit" disabled={isLoading}>
                        {isLoading ? translate.loading[language]:translate.login[language]}
                    </button>
                </form>
                {successMessage && <p className="success-dsk">{successMessage}</p>}
                <p>
                    <button className="link-button">{translate.loginQuestion[language]}</button>
                </p>
            </div>
        </div>
    );
}

export default LoginForm;
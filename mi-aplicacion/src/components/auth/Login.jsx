import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageContext } from '../../context/LanguageContext';
import translate from '../../utils/language';
import { login, verify2FA } from '../../utils/apiController';
import './Login.css';

const LoginForm = () => {
    const { language } = useContext(LanguageContext);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        twoFactorCode: ''
    });

    const [step, setStep] = useState('credentials');
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [secret, setSecret] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (step === 'credentials') {
            if (!formData.email) {
                newErrors.email = 'El correo electrónico es obligatorio';
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = 'El correo electrónico no es válido';
            }
            if (!formData.password) {
                newErrors.password = 'La contraseña es obligatoria';
            }
        } else if (step === 'verifyCode') {
            if (!formData.twoFactorCode) {
                newErrors.twoFactorCode = 'El código de verificación es obligatorio';
            }
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
                if (step === 'credentials') {
                    console.log('Enviando credenciales...');
                    const response = await login(formData.email, formData.password);
                    console.log('Respuesta del servidor:', response);
                    
                    if (response.success) {
                        // Si hay secreto, es un nuevo usuario y necesitamos mostrarlo
                        if (response.secret) {
                            console.log('Nuevo usuario, mostrando secreto');
                            setSecret(response.secret);
                            setStep('showSecret');
                        } else {
                            // Usuario existente, ir directamente a verificación
                            console.log('Usuario existente, pidiendo código');
                            setStep('verifyCode');
                        }
                    } else {
                        setErrors({ submit: response.message || 'Error al iniciar sesión' });
                    }
                } else if (step === 'verifyCode') {
                    const response = await verify2FA(formData.twoFactorCode, formData.email);
                    
                    if (response.success) {
                        setSuccessMessage('Inicio de sesión exitoso');
                        navigate('/menu');
                    } else {
                        setErrors({ submit: response.message || 'Código de verificación inválido' });
                    }
                }
            } catch (error) {
                console.error('Error en handleSubmit:', error);
                setErrors({ submit: 'Error al procesar la solicitud' });
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="login-container-dsk">
            <h2>{translate.login[language]}</h2>
            <form onSubmit={handleSubmit}>
                {step === 'credentials' && (
                    <>
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
                    </>
                )}

                {step === 'showSecret' && (
                    <div className="form-group-dsk">
                        <div className="secret-info">
                            <p>Para completar la configuración de la autenticación de dos factores:</p>
                            <ol>
                                <li>Descarga Google Authenticator en tu dispositivo móvil</li>
                                <li>Abre la aplicación y añade una nueva cuenta</li>
                                <li>Introduce este código: <strong>{secret}</strong></li>
                                <li>Guarda este código en un lugar seguro, lo necesitarás si cambias de dispositivo</li>
                            </ol>
                        </div>
                        <button 
                            type="button" 
                            className="login-button-dsk"
                            onClick={() => setStep('verifyCode')}
                        >
                            Continuar
                        </button>
                    </div>
                )}

                {step === 'verifyCode' && (
                    <div className="form-group-dsk">
                        <label htmlFor="twoFactorCode">Código de verificación</label>
                        <input
                            type="text"
                            id="twoFactorCode"
                            name="twoFactorCode"
                            value={formData.twoFactorCode}
                            onChange={handleChange}
                            disabled={isLoading}
                            placeholder="Introduce el código de Google Authenticator"
                        />
                        {errors.twoFactorCode && <span className="error">{errors.twoFactorCode}</span>}
                    </div>
                )}

                {errors.submit && <div className="error">{errors.submit}</div>}
                
                {(step === 'credentials' || step === 'verifyCode') && (
                    <button className="login-button-dsk" type="submit" disabled={isLoading}>
                        {isLoading ? translate.loading[language] : translate.login[language]}
                    </button>
                )}
            </form>
            {successMessage && <p className="success-dsk">{successMessage}</p>}
        </div>
    );
};

export default LoginForm;
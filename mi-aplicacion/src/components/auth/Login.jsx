import { useState, useContext } from 'react';
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
    const [isLoading, setIsLoading] = useState(false);
    const [secret, setSecret] = useState('');

    const validateForm = () => {
        const newErrors = {};
        if (step === 'credentials') {
            if (!formData.email) {
                newErrors.email = { key: 'emailRequired' };
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                newErrors.email = { key: 'emailInvalid' };
            }
            if (!formData.password) {
                newErrors.password = { key: 'passwordRequired' };
            }
        } else if (step === 'verifyCode') {
            if (!formData.twoFactorCode) {
                newErrors.twoFactorCode = { key: 'verificationCodeRequired' };
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
                    const response = await login(formData.email, formData.password);
                    console.log('Login response:', response);

                    if (response.success) {
                        // Verificamos primero los mensajes de error estructurados
                        if (response.data.message?.ES === "Usuario no encontrado" ||
                            response.data.message?.EUS === "Ez da erabiltzailea aurkitu") {
                            setErrors({
                                email: { key: 'userNotFound' }
                            });
                            return;
                        }
                        
                        if (response.data.message?.ES === "Contraseña incorrecta" ||
                            response.data.message?.EUS === "Pasahitz okerra") {
                            setErrors({ 
                                password: {key: 'invalidPassword'}
                            });
                            return;
                        }

                        // Si hay un error en la respuesta
                        if (response.data.error || (response.data.message && !response.data.success)) {
                            setErrors({
                                submit: { key: 'loginError' }
                            });
                            return;
                        }

                        // Si la autenticación fue exitosa
                        if (response.data.success) {
                            // Comprobamos si el backend nos pide el código de verificación
                            if (response.data.message === 'Please enter your verification code') {
                                setStep('verifyCode');
                                return;
                            }

                            // Si hay secret, es la primera vez que configura 2FA
                            if (response.data.secret) {
                                setSecret(response.data.secret);
                                setStep('showSecret');
                                return;
                            }
                        }
                    } else {
                        setErrors({
                            submit: { key: 'requestError' }
                        });
                    }
                } else if (step === 'verifyCode') {
                    const response = await verify2FA(formData.twoFactorCode, formData.email);

                    if (response.success) {
                        if (response.data.error || !response.data.success) {
                            setErrors({
                                submit: { key: 'invalidCode' }
                            });
                            return;
                        }

                        if (response.data.success) {
                            navigate('/menu');
                        } else {
                            setErrors({
                                submit: { key: 'invalidCode' }
                            });
                        }
                    } else {
                        setErrors({
                            submit: { key: 'requestError' }
                        });
                    }
                }
            } catch (error) {
                console.error('Error en handleSubmit:', error);
                setErrors({
                    submit: { key: 'requestError' }
                });
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
                            {errors.email &&
                                <span className="error">
                                    {translate[errors.email.key][language]}
                                </span>
                            }
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
                            {errors.password &&
                                <span className="error">
                                    {translate[errors.password.key][language]}
                                </span>
                            }
                        </div>
                        <button className="login-button-dsk" type="submit" disabled={isLoading}>
                            {isLoading ? translate.loading[language] : translate.login[language]}
                        </button>
                    </>
                )}

                {step === 'showSecret' && (
                    <div className="form-group-dsk">
                        <div className="secret-info">
                            <p>{translate.twoFactorTitle[language]}</p>
                            <ol>
                                <li>{translate.twoFactorStep1[language]}</li>
                                <li>{translate.twoFactorStep2[language]}</li>
                                <li>{translate.twoFactorStep3[language]} <strong>{secret}</strong></li>
                                <li>{translate.twoFactorStep4[language]}</li>
                            </ol>
                        </div>
                        <button
                            type="button"
                            className="login-button-dsk"
                            onClick={() => setStep('verifyCode')}
                        >
                            {translate.continue[language]}
                        </button>
                    </div>
                )}

                {step === 'verifyCode' && (
                    <>
                        <div className="form-group-dsk">
                            <label htmlFor="twoFactorCode">
                                {translate.verificationCode[language]}
                            </label>
                            <input
                                type="text"
                                id="twoFactorCode"
                                name="twoFactorCode"
                                value={formData.twoFactorCode}
                                onChange={handleChange}
                                disabled={isLoading}
                                placeholder={translate.codePlaceholder[language]}
                            />
                            {errors.twoFactorCode &&
                                <span className="error">
                                    {translate[errors.twoFactorCode.key][language]}
                                </span>
                            }
                        </div>
                        <button className="login-button-dsk" type="submit" disabled={isLoading}>
                            {isLoading ? translate.loading[language] : translate.login[language]}
                        </button>
                    </>
                )}

                {errors.submit &&
                    <div className="error">
                        {errors.submit.message || translate[errors.submit.key][language]}
                    </div>
                }
            </form>
        </div>
    );
};

export default LoginForm;
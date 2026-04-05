'use client'
import Input from "../Input/Input";
import styles from './ContactForm.module.scss';
import Inputmask from "inputmask";
import Button from "../Button/Button";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Checkbox from '../Checkbox/Checkbox';

interface ContactFormProps {
    buttonText?: string;
    onSuccess?: () => void;
}

function ContactForm({ buttonText, onSuccess }: ContactFormProps) {
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [marketingConsent, setMarketingConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [agreementError, setAgreementError] = useState(false);
    const [nameError, setNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const [nameDirty, setNameDirty] = useState(false);
    const [phoneDirty, setPhoneDirty] = useState(false);

    // Функция отправки данных в Mindbox
    const sendToMindbox = (userName: string, userPhone: string, hasMarketingConsent: boolean) => {
        console.log('[Mindbox] Attempting to send CallBackFooter event...');
        console.log('[Mindbox] Data:', {
            userName,
            userPhone: userPhone.replace(/\D/g, ''),
            hasMarketingConsent
        });

        if (typeof window !== 'undefined' && window.mindbox) {
            console.log('[Mindbox] mindbox object found, sending request...');
            
            const mindboxData = {
                operation: 'CallBackFooter',
                data: {
                    customer: {
                        mobilePhone: userPhone.replace(/\D/g, ''),
                        firstName: userName,
                        subscriptions: [
                            {
                                pointOfContact: 'Sms',
                                isSubscribed: hasMarketingConsent ? 'true' : 'false',
                            },
                        ],
                    },
                },
                onSuccess: () => {
                    console.log('[Mindbox] CallBackFooter SUCCESS!');
                },
                onError: (error: unknown) => {
                    console.error('[Mindbox] CallBackFooter ERROR:', error);
                },
            };

            console.log('[Mindbox] Full request payload:', JSON.stringify(mindboxData, null, 2));
            
            window.mindbox('async', mindboxData);
        } else {
            console.warn('[Mindbox] mindbox object not found on window!');
            console.log('[Mindbox] window.mindbox:', typeof window !== 'undefined' ? window.mindbox : 'window undefined');
        }
    };

    const agreementHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setAgreement(evt.target.checked);
        setAgreementError(false);
    };

    const marketingHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        setMarketingConsent(evt.target.checked);
    };

    const nameHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setName(value);

        const hasNumbers = /\d/.test(value);
        setNameError(value.trim().length < 2 || hasNumbers);
    };


    const phoneHandler = (evt: React.ChangeEvent<HTMLInputElement>) => {
        const value = evt.target.value;
        setPhone(value);

        const digits = value.replace(/\D/g, '');
        setPhoneError(digits.length !== 11);
    };

   
 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('[Form] Submit started');

        setNameDirty(true);
        setPhoneDirty(true);

        // Проверяем имя
        const hasNumbers = /\d/.test(name);
        const isNameInvalid = name.trim().length < 2 || hasNumbers;
        setNameError(isNameInvalid);

        // Проверяем телефон
        const digits = phone.replace(/\D/g, '');
        const isPhoneInvalid = digits.length !== 11;
        setPhoneError(isPhoneInvalid);

        if (!agreement) {
            setAgreementError(true);
        }

        if (isNameInvalid || isPhoneInvalid || !name || !phone || !agreement) {
            console.log('[Form] Validation failed:', { isNameInvalid, isPhoneInvalid, agreement });
            return;
        }

        console.log('[Form] Validation passed, submitting...');
        setIsSubmitting(true);

        // Формируем данные для отправки
        const data: Record<string, string> = {
            name,
            phone,
            message: '',
        };

        // Маркетинговые рассылки (как отдельное поле)
        data.marketing_consent = marketingConsent ? '1' : '0';

        // Отправка через Comagic
        if (typeof window !== 'undefined' && window.Comagic?.addOfflineRequest) {
            console.log('[Comagic] Sending request...');
            window.Comagic.addOfflineRequest(
                data,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (o: any) => {
                    const response = JSON.parse(o.response);
                    console.log('[Comagic] Response:', response);
                    if (response.success) {
                        console.log('[Comagic] Success! Now sending to Mindbox...');
                        // Отправляем данные в Mindbox
                        sendToMindbox(name, phone, marketingConsent);
                        if (onSuccess) {
                            onSuccess();
                        } else {
                            router.push('/success');
                        }
                    } else {
                        console.error('[Comagic] Request failed');
                        setIsSubmitting(false);
                    }
                }
            );
        } else {
            console.warn('[Comagic] Not available, sending only to Mindbox...');
            sendToMindbox(name, phone, marketingConsent);
            if (onSuccess) {
                onSuccess();
            }
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (inputRef.current) {
            const im = new Inputmask('+7 999 999 99 99', {
                placeholder: 'X',
                showMaskOnHover: false
            });
            im.mask(inputRef.current);
        }
    }, []);


    return (
        <>
            
            <form className={styles.contact_form} onSubmit={handleSubmit}>
                <Input 
                    type='text' 
                    placeholder="Имя"
                    name="name"
                    value={name}
                    onChange={nameHandler}
                    onBlur={() => setNameDirty(true)}
                    error={nameDirty && nameError}
                />

                <Input 
                    type='tel' 
                    ref={inputRef}
                    placeholder="+7 ХХХ ХХХ ХХ ХХ"
                    name="phone"
                    value={phone}
                    onChange={phoneHandler}
                    onBlur={() => setPhoneDirty(true)}
                    error={phoneDirty && phoneError}
                />
                <div className=""> 
                <Checkbox checked={agreement} onChange={agreementHandler} error={agreementError}>
                    Соглашаюсь на <Link href="https://www.mr-group.ru/personal-data/" target="_blank" rel="noopener noreferrer">обработку персональных данных</Link>
                </Checkbox>

                <Checkbox
                    checked={marketingConsent}
                    onChange={marketingHandler}
                >
                    Подписаться на <Link href="#!Link">маркетинговые и&nbsp;рекламные рассылки</Link>
                </Checkbox>
                </div>
                <Button 
                    type='submit'>
                        {isSubmitting ? 'Отправка...' : (buttonText || 'Отправить')}
                </Button>
    
            </form>
        </>
    )
}

export default ContactForm;
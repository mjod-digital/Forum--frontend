'use client'

import { useState } from 'react';
import styles from './Ready.module.scss';
import classNames from 'classnames';
import ContactForm from '@/app/components/ui/ContactForm/ContactForm';

const PRESENTATION_URL = '/files/forum-pres.pdf';

interface ReadyModalProps {
    onClose?: () => void;
}

export default function ReadyModal({ onClose }: ReadyModalProps) {
    const [isSuccess, setIsSuccess] = useState(false);

    const handleOpenPresentation = () => {
        window.open(PRESENTATION_URL, '_blank');
    };

    const handleFormSuccess = (data: { name: string; phone: string; marketingConsent: boolean }) => {
        setIsSuccess(true);

        fetch('/api/send-presentation-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        }).catch((err) => console.error('[Email] Send failed:', err));
    };

    return (
        <div className={styles.modal}>
            <div className={styles.modalContent}>
                <button className={styles.close} onClick={onClose}>
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M14.1385 11.9461L25.8102 0.279657L27.7203 2.18977L16.0513 13.8589L28 25.8076L26.0899 27.7177L14.1411 15.769L1.91275 27.9974L0 26.0872L12.2284 13.8562L0.282295 1.91011L2.19241 0L14.1385 11.9461Z" fill="#232323" />
                    </svg>
                </button>
                {!isSuccess ? (
                    <div className={styles.modalForm}>
                        <p className={classNames(styles.modalTitle, 'title-b')}>
                            ОСтавьте контакты и получите <span>презентацию</span>
                        </p>
                        <ContactForm
                            buttonText="Получить презентацию"
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                ) : (
                    <div className={styles.success}>
                        <p className={classNames(styles.successText, 'title-b')}>приятного <span>просмотра</span></p>
                        <button className={styles.successBtn} onClick={handleOpenPresentation}>
                            открыть презентацию
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

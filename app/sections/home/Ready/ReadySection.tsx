'use client'

import { useState } from 'react';
import Ready from './Ready';
import ReadyModal from './ReadyModal';

export default function ReadySection() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Ready onOpen={() => setIsOpen(true)} />
            {isOpen && <ReadyModal onClose={() => setIsOpen(false)} />}
        </>
    );
}

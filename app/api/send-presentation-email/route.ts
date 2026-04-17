import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const RECIPIENTS = [
    'afanasieva_a@mr-group.ru',
    'yuzvenko_e@mr-group.ru',
];

export async function POST(request: Request) {
    try {
        const { name, phone, marketingConsent } = await request.json();

        if (!name || !phone) {
            return NextResponse.json(
                { error: 'Имя и телефон обязательны' },
                { status: 400 }
            );
        }

        const transporter = nodemailer.createTransport({
            host: 'localhost',
            port: 25,
            secure: false,
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.sendMail({
            from: 'noreply@forum.mr-group.ru',
            to: RECIPIENTS.join(', '),
            subject: 'Заявка на презентацию Forum',
            html: `
                <p>Получена заявка на презентацию Forum от пользователя</p>
                <br/>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Согласие на получение маркетинговых рассылок:</strong> ${marketingConsent ? 'да' : 'нет'}</p>
            `,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[Email] Send failed:', error);
        return NextResponse.json(
            { error: 'Не удалось отправить письмо' },
            { status: 500 }
        );
    }
}

import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Die Funktion behandelt Health-Check Anfragen und gibt den Status der Anwendung zurück.
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
    return res.status(200).json({
        ok: true,
        service: 'serverless-todo-app',
        time: new Date().toISOString(),
    });
}
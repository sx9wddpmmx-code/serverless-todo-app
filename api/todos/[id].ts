import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as service from '../lib/services/todoService.js';
import { UpdateTodoDto } from '../lib/models/todo.js';

/**
 * Die Funktion behandelt Anfragen für einzelne Todos, identifiziert durch ihre ID.
 * Sie unterstützt das Aktualisieren (PATCH) und Löschen (DELETE) von Todos.
 * 
 * Die Funktion ist als serverlose API innerhalb der Vercel-Plattform implementiert.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const READ_ONLY = process.env.READ_ONLY === 'true';

        res.setHeader('Cache-Control', 'no-store');

        const id = String(req.query.id ?? '').trim();

        // PATCH: Bestehendes Todo aktualisieren
        if (req.method === 'PATCH') {
            if (READ_ONLY)
                return res.status(403).json({ message: 'Read-only demo.' });
            const patch = (req.body ?? {}) as UpdateTodoDto;
            const updated = await service.updateTodo(id, patch);
            return res.status(200).json(updated);
        }

        // DELETE: Bestehendes Todo löschen
        if (req.method === 'DELETE') {
            if (READ_ONLY)
                return res.status(403).json({ message: 'Read-only demo.' });
            await service.removeTodo(id);
            return res.status(204).send('');
        }

        res.setHeader('Allow', 'PATCH, DELETE');
        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (e: any) {
        return res.status(e.statusCode ?? 500).json({ message: e.message ?? 'Server error' });
    }
}
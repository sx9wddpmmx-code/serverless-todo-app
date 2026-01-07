import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as service from '../lib/services/todoService.js';
import { CreateTodoDto } from '../lib/models/todo.js';

/**
 * Die Funktion behandelt Anfragen für die Sammlung aller Todos. Sie unterstützt das
 * Abrufen (GET) und Erstellen (POST) von Todos.
 * 
 * Die Funktion ist als serverlose API innerhalb der Vercel-Plattform implementiert.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const READ_ONLY = process.env.READ_ONLY === 'true';

        res.setHeader('Cache-Control', 'no-store');

        // GET: Alle Todos abrufen
        if (req.method === 'GET') {
            const todos = await service.getTodos();
            return res.status(200).json(todos);
        }

        // POST: Neues Todo erstellen
        if (req.method === 'POST') {
            if (READ_ONLY) 
                return res.status(403).json({ message: 'Read-only demo.' });
            
            const dto = (req.body ?? {}) as CreateTodoDto;
            const created = await service.createTodo(dto);
            return res.status(201).json(created);
        }

        res.setHeader('Allow', 'GET, POST');
        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (e: any) {
        return res.status(e.statusCode ?? 500).json({ message: e.message ?? 'Server error' });
    }
}
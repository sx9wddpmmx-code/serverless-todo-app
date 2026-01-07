import { CreateTodoDto, Todo, UpdateTodoDto } from '../models/todo.js';
import * as repo from '../repositories/todoRepository.js';

/**
 * Die Funktion erzeugt einen HTTP-Fehler mit dem angegebenen Statuscode und der Nachricht.
 */
function httpError(statusCode: number, message: string): never {
    const err: any = new Error(message);
    err.statusCode = statusCode;
    throw err;
}

/**
 * Die Funktion liefert alle gespeicherten Todos zurück.
 * @returns Ein Promise, das ein Array von Todo-Objekten enthält
 */
export async function getTodos(): Promise<Todo[]> {
    return repo.listTodos();
}

/**
 * Die Funktion erstellt ein neues Todo mit den angegebenen Daten. 
 * @param dto die Daten für das zu erstellende Todo
 * @returns das erstellte Todo-Objekt als Promise
 */
export async function createTodo(dto: CreateTodoDto): Promise<Todo> {
    const title = String(dto?.title ?? '').trim();
    if (!title) 
        httpError(400, 'title required');

    const description = dto.description ?? null;
    const deadline = dto.deadline ?? null;

    return repo.insertTodo({ title, description, deadline });
}

/**
 * Die Funktion aktualisiert ein bestehendes Todo mit den angegebenen Änderungen.
 * @param id die ID des zu aktualisierenden Todos
 * @param patch die Änderungen, die angewendet werden sollen
 * @returns das aktualisierte Todo-Objekt als Promise
 */
export async function updateTodo(id: string, patch: UpdateTodoDto): Promise<Todo> {
    if (!id) 
        httpError(400, 'id required');

    if (patch.title !== undefined) {
        const clean = String(patch.title).trim();
        if (!clean) 
            httpError(400, 'title must not be empty');
        patch.title = clean;
    }

    // deadline: optional ISO string, oder null zum löschen
    if (patch.deadline !== undefined && patch.deadline !== null) {
        const iso = String(patch.deadline);
        // Minimalcheck: Date parsebar
        if (Number.isNaN(Date.parse(iso))) 
            httpError(400, 'deadline must be ISO date string');
        patch.deadline = iso;
    }

    const updated = await repo.patchTodo(id, patch);
    if (!updated) 
        httpError(404, 'todo not found');
    return updated;
}

/**
 * Die Funktion löscht ein bestehendes Todo anhand seiner ID.
 * @param id die ID des zu löschenden Todos
 */
export async function removeTodo(id: string): Promise<void> {
    const ok = await repo.deleteTodo(id);
    if (!ok) 
        httpError(404, 'todo not found');
}
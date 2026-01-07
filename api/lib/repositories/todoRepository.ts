import { sql } from '@vercel/postgres';
import { Todo, CreateTodoDto, UpdateTodoDto } from '../models/todo';

/**
 * Die Funktion listet alle vorhandenen Todos auf 
 * @returns ein Promise, das ein Array von Todo-Objekten enthält
 */
export async function listTodos(): Promise<Todo[]> {
    const { rows } = await sql`
    select id, title, description, deadline, completed
    from todos
    order by created_at desc`;
    return rows as unknown as Todo[];
}

/**
 * Die Funktion fügt ein neues Todo in die Datenbank ein.
 * @param input die Daten des zu erstellenden Todos
 * @returns das erstellte Todo-Objekt als Promise
 */
export async function insertTodo(input: CreateTodoDto): Promise<Todo> {
    const id = crypto.randomUUID();

    const description = input.description ?? null;
    const deadline = input.deadline ?? null;

    const { rows } = await sql`
    insert into todos (id, title, description, deadline, completed)
    values (${id}, ${input.title}, ${description}, ${deadline}, false)
    returning id, title, description, deadline, completed`;

    return rows[0] as unknown as Todo;
}

/**
 * Die Funktion aktualisiert ein bestehendes Todo mit den angegebenen Änderungen.
 * @param id die ID des zu aktualisierenden Todos
 * @param patch die Änderungen, die angewendet werden sollen
 * @returns das aktualisierte Todo-Objekt als Promise, oder null wenn nicht gefunden
 */
export async function patchTodo(id: string, patch: UpdateTodoDto): Promise<Todo | null> {
    const hasTitle = patch.title !== undefined;
    const hasDescription = patch.description !== undefined;
    const hasDeadline = patch.deadline !== undefined;
    const hasCompleted = patch.completed !== undefined;

    const titleVal = hasTitle ? String(patch.title) : null;

    // darf string oder null sein (null = Feld löschen)
    const descriptionVal = hasDescription ? (patch.description === null ? null : String(patch.description)) : null;

    // deadline als ISO-String oder null (niemals Date-Objekt!)
    const deadlineVal = hasDeadline ? (patch.deadline === null ? null : String(patch.deadline)) : null;

    const completedVal = hasCompleted ? Boolean(patch.completed) : null;

    const { rows } = await sql`
    update todos
    set
      title = case when ${hasTitle} then ${titleVal} else title end,
      description = case when ${hasDescription} then ${descriptionVal} else description end,
      deadline = case when ${hasDeadline} then ${deadlineVal} else deadline end,
      completed = case when ${hasCompleted} then ${completedVal} else completed end,
      updated_at = now()
    where id = ${id}
    returning id, title, description, deadline, completed`;

    return rows[0] ? (rows[0] as unknown as Todo) : null;
}

/**
 * Die Funktion löscht ein bestehendes Todo anhand seiner ID.
 * @param id die ID des zu löschenden Todos
 * @returns true, wenn das Todo gelöscht wurde, sonst false
 */
export async function deleteTodo(id: string): Promise<boolean> {
    const { rows } = await sql`
    delete from todos
    where id = ${id}
    returning id`;
    return rows.length > 0;
}
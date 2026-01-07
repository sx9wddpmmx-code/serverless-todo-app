/**
 * Das Todo-Modell repräsentiert eine Aufgabe in der Todo-Anwendung.
 */
export type Todo = {
    id: string;
    title: string;
    description?: string | null;
    deadline?: string | null;
    completed: boolean;
};

/**
 * Die DTO für die Erstellung eines neuen Todos.
 */
export type CreateTodoDto = {
    title: string;
    description?: string | null;
    deadline?: string | null;
};

/**
 * Die DTO für die Aktualisierung eines bestehenden Todos.
 */
export type UpdateTodoDto = Partial<{
    title: string;
    description: string | null;
    deadline: string | null;
    completed: boolean;
}>;
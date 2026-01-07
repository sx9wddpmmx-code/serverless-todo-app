import { Injectable } from "@angular/core";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { Todo } from "../models/todo.model";
import { TodoApiService } from "./todo-api.service";

/**
 * Der Service verwaltet den Zustand der Todo-Liste und stellt Methoden zum Ändern der Todos
 * bereit.
 */
@Injectable({ providedIn: 'root' })
export class TodoStoreService {

    /** Internes BehaviorSubject, das die Liste der Todos hält */
    private readonly _todos$ = new BehaviorSubject<Todo[]>([]);

    constructor(private readonly api: TodoApiService) { }

    /**
     * Öffentliches Observable der Todo-Liste
     */
    public readonly todos$ = this._todos$.asObservable();

    /** Snapshot der aktuellen Todo-Liste */
    private get todos(): Todo[] {
        return this._todos$.value;
    }

    /**
     * Die Methode lädt die Todos vom Server und aktualisiert den internen Zustand. 
     */
    public async loadTodos(): Promise<void> {
        const todos = await firstValueFrom(this.api.list());
        this._todos$.next(todos);
    }

    /**
     * Die Methode toggelt den Abschlussstatus eines Todos.
     * @param id Identifikator des zu ändernden Todos
     */
    public async toggleCompleted(id: string): Promise<void> {
        const current = this.todos.find(t => t.id === id);
        if (!current) return;

        const updated = await firstValueFrom(
            this.api.update(id, { completed: !current.completed })
        );

        this.updateLocal(updated);
    }

    /**
     * Die Methode löscht ein Todo anhand seiner ID.
     * @param id Identifikator des zu löschenden Todos
     */
    public async deleteTodo(id: string): Promise<void> {
        await firstValueFrom(this.api.delete(id));
        this._todos$.next(this.todos.filter(t => t.id !== id));
    }

    /**
     * Die Methode fügt ein neues Todo zur Liste hinzu.
     * @param todo das hinzuzufügende Todo
     */
    public async addTodo(todo: Pick<Todo, 'title' | 'description' | 'deadline'>): Promise<void> {
        const created = await firstValueFrom(this.api.create(todo));
        this._todos$.next([created, ...this.todos]);
    }

    /**
     * Die Methode aktualisiert ein bestehendes Todo.
     * @param updatedTodo das zu aktualisierende Todo
     */
    public async updateTodo(updatedTodo: Todo): Promise<void> {
        const updated = await firstValueFrom(
            this.api.update(updatedTodo.id, {
                title: updatedTodo.title,
                description: updatedTodo.description,
                deadline: updatedTodo.deadline,
                completed: updatedTodo.completed
            })
        );
        this.updateLocal(updated);
    }

    /**
     * Die Methode prüft, ob ein Todo mit der gegebenen ID existiert.
     * @param id die ID des zu prüfenden Todos
     * @returns true, wenn das Todo existiert, sonst false
     */
    public hasTodo(id: string): boolean {
        return this.todos.some(t => t.id === id);
    }

    private updateLocal(updatedTodo: Todo): void {
        const updated = this.todos.map(t =>
            t.id === updatedTodo.id ? { ...t, ...updatedTodo } : t
        );
        this._todos$.next(updated);
    }

}
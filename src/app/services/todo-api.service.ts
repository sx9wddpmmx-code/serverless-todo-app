import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Todo } from '../models/todo.model';

/**
 * Die DTOs (Data Transfer Objects) definieren die Struktur der Daten, die für die
 * Erstellung und Aktualisierung von Todos verwendet werden.
 */
export type CreateTodoDto = Pick<Todo, 'title' | 'description' | 'deadline'>;
export type UpdateTodoDto = Partial<Pick<Todo, 'title' | 'description' | 'deadline' | 'completed'>>;

/**
 * Der Service stellt Methoden zur Kommunikation mit der Todo-API bereit.
 * Er ermöglicht das Abrufen, Erstellen, Aktualisieren und Löschen von Todos.
 */
@Injectable({ providedIn: 'root' })
export class TodoApiService {
    private readonly baseUrl = '/api/todos';

    constructor(private readonly http: HttpClient) { }

    /**
     * Die Methode ruft die Liste aller Todos von der API ab.
     * @returns 
     */
    public list(): Observable<Todo[]> {
        return this.http.get<Todo[]>(this.baseUrl);
    }

    /**
     * Die Methode erstellt ein neues Todo über die API.
     * @param dto die Daten des zu erstellenden Todos
     * @returns das erstellte Todo
     */
    public create(dto: CreateTodoDto): Observable<Todo> {
        return this.http.post<Todo>(this.baseUrl, dto);
    }

    /**
     * Die Methode aktualisiert ein bestehendes Todo über die API.
     * @param id die ID des zu aktualisierenden Todos
     * @param dto die zu aktualisierenden Daten
     * @returns das aktualisierte Todo
     */
    public update(id: string, dto: UpdateTodoDto): Observable<Todo> {
        return this.http.patch<Todo>(`${this.baseUrl}/${id}`, dto);
    }

    /**
     * Die Methode löscht ein Todo über die API.
     * @param id die ID des zu löschenden Todos
     * @returns ein Observable, das den Abschluss der Löschoperation signalisiert
     */
    public delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.baseUrl}/${id}`);
    }
}

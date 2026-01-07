import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TodoList } from '../todo-list/todo-list';
import { TodoStoreService } from '../../services/todo-store.service';

import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Todo } from '../../models/todo.model';
import { ConfirmationService } from 'primeng/api';
import { TodoDialogComponent } from '../todo-dialog/todo-dialog';

/**
 * Die Komponente dient als Hauptseite der Todo-Anwendung und verwaltet die Anzeige und Interaktion
 * mit der Todo-Liste.
 */
@Component({
    selector: 'app-todo-page',
    imports: [
        CommonModule, 
        TodoList, 
        ConfirmDialogModule, 
        TodoDialogComponent
    ],
    templateUrl: './todo-page.html',
    styleUrl: './todo-page.css',
})
export class TodoPage implements OnInit{

    private readonly todoStore = inject(TodoStoreService);
    private readonly confirmationService = inject(ConfirmationService);

    readonly todos$ = this.todoStore.todos$;

    protected dialogOpen = false;
    protected editingTodo: Todo | null = null;

    public ngOnInit(): void {
        this.todoStore.loadTodos();
    }

    /**
     * Die Methode öffnet den Dialog zum Erstellen eines neuen Todos.
     */
    protected openCreateDialog(): void {
        this.editingTodo = null;
        this.dialogOpen = true;
    }

    /**
     * Die Methode öffnet den Dialog zum Bearbeiten eines bestehenden Todos.
     * @param todo 
     */
    protected openEditDialog(todo: Todo): void {
        this.editingTodo = todo;
        this.dialogOpen = true;
    }

    /**
     * Die Methode behandelt das Umschalten des Abschlussstatus eines Todos.
     * @param id 
     */
    protected onToggleTodo(id: string): void {
        this.todoStore.toggleCompleted(id);
    }

    /**
     * Die Methode speichert ein neues oder bearbeitetes Todo.
     * @param todo das zu speichernde Todo
     */
    protected onSaveTodo(todo: Todo): void {
        if (this.todoStore.hasTodo(todo.id)) 
            this.todoStore.updateTodo(todo);
        else 
            this.todoStore.addTodo(todo);
    }

    /**
     * Die Methode zeigt eine Bestätigungsdialog zum Löschen eines Todos an. Bei Bestätigung
     * wird das Todo gelöscht.
     * @param todo das zu löschende Todo
     */
    protected onRequestDelete(todo: Todo): void {
        this.confirmationService.confirm({
            header: 'Todo löschen',
            message: `Willst du "${todo.title}" wirklich löschen?`,
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Löschen',
            rejectLabel: 'Abbrechen',
            accept: () => this.todoStore.deleteTodo(todo.id),
        });
    }
}

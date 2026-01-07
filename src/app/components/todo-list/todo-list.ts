import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TodoItem } from '../todo-item/todo-item';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';
import { TagModule } from 'primeng/tag';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

/**
 * Die Komponente stellt eine Liste von Todos dar und ermöglicht die Interaktion mit diesen.
 */
@Component({
    selector: 'app-todo-list',
    imports: [CommonModule, TagModule, CheckboxModule, ButtonModule, TableModule, TodoItem],
    templateUrl: './todo-list.html',
    styleUrl: './todo-list.css',
})
export class TodoList {

    readonly dummyTodo: Todo = {
        id: 'dummy',
        title: '',
        completed: false,
    };

    @Input({ required: true }) todos: Todo[] = [];
    @Output() toggleTodo = new EventEmitter<string>();
    @Output() editTodo = new EventEmitter<Todo>();
    @Output() requestDelete = new EventEmitter<Todo>();
    @Output() openCreate = new EventEmitter<void>();

    @ViewChild(TodoItem, { static: true }) private readonly itemComp!: TodoItem;

    /**
     * Die Getter-Methode gibt die Zeilenvorlage der Todo-Element-Komponente zurück.
     */
    protected get rowTemplate() {
        return this.itemComp.rowTemplate;
    }

    /**
     * Die Getter-Methode gibt die Anzahl der offenen (nicht abgeschlossenen) Todos zurück.
     */
    protected get openCount(): number {
        return this.todos.filter(t => !t.completed).length;
    }

    /**
     * Die Getter-Methode gibt die Anzahl der erledigten (abgeschlossenen) Todos zurück.
     */
    protected get doneCount(): number {
        return this.todos.filter(t => t.completed).length;
    }
}

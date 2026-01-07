import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { Todo } from '../../models/todo.model';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';

/**
 * Die Komponente stellt ein einzelnes Todo-Element dar und ermöglicht die Interaktion mit diesem.
 */
@Component({
    selector: 'app-todo-item',
    imports: [
        CommonModule,
        CheckboxModule,
        ButtonModule,
        TagModule,
        FormsModule,
        CardModule
    ],
    templateUrl: './todo-item.html',
    styleUrl: './todo-item.css',
})
export class TodoItem {

    @Input({ required: true }) todo!: Todo;
    @Output() toggle = new EventEmitter<string>();
    @Output() edit = new EventEmitter<Todo>();
    @Output() requestDelete = new EventEmitter<Todo>();

    @ViewChild('row', { static: true }) rowTemplate!: TemplateRef<any>;

    /**
     * Die Methode formatiert das Fälligkeitsdatum eines Todos für die Anzeige.
     * @param deadline Fälligkeitsdatum als ISO-String 
     * @returns formatiertes Datum oder ein Gedankenstrich, wenn kein Datum vorhanden ist
     */
    protected formatDeadline(deadline?: string): string {
        if (!deadline) 
            return '—';
        const d = new Date(deadline);
        return Number.isNaN(d.getTime()) ? deadline : d.toLocaleDateString();
    }
}

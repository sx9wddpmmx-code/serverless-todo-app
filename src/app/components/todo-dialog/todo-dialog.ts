import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { Todo } from '../../models/todo.model';

import { TextareaModule } from 'primeng/textarea';

/**
 * Der Typ repräsentiert einen Entwurf für ein Todo-Objekt, das im Dialog erstellt oder bearbeitet
 * wird.
 */
type TodoDraft = {
    title: string;
    description: string;
    deadline: Date | null;
};

/**
 * Die Komponente stellt einen Dialog zum Erstellen oder Bearbeiten eines Todos dar.
 */
@Component({
    selector: 'app-todo-dialog',
    imports: [
        CommonModule,
        FormsModule,
        DialogModule,
        ButtonModule,
        InputTextModule,
        TextareaModule,
        DatePickerModule,
    ],
    templateUrl: './todo-dialog.html',
    styleUrl: './todo-dialog.css',
})
export class TodoDialogComponent implements OnChanges {

    @Input({ required: true }) visible = false;
    @Input() todo: Todo | null = null;
    @Output() visibleChange = new EventEmitter<boolean>();
    @Output() save = new EventEmitter<Todo>();
    @Output() cancel = new EventEmitter<void>();

    draft: TodoDraft = { title: '', description: '', deadline: null };

    public ngOnChanges(): void {
        if (!this.visible) 
            return;

        this.draft = {
            title: this.todo?.title ?? '',
            description: this.todo?.description ?? '',
            deadline: this.todo?.deadline ? new Date(this.todo.deadline) : null,
        };
    }

    /**
     * Die Getter-Methode gibt zurück, ob der Dialog zum Bearbeiten eines bestehenden Todos
     * geöffnet ist.
     */
    protected get isEdit(): boolean {
        return !!this.todo;
    }

    /**
     * Die Getter-Methode gibt den Header-Text des Dialogs zurück, abhängig davon, ob ein neues
     * Todo erstellt oder ein bestehendes bearbeitet wird.
     */
    protected get headerText(): string {
        return this.isEdit ? 'Todo bearbeiten' : 'Neues Todo';
    }

    /**
     * Die Methode schließt den Dialog und emit­tiert das Abbrechen-Ereignis.
     */
    protected close(): void {
        this.visibleChange.emit(false);
        this.cancel.emit();
    }

    /**
     * Die Methode übermittelt das gespeicherte Todo-Objekt und schließt den Dialog.
     * @returns void
     */
    protected submit(): void {
        const title = this.draft.title.trim();
        if (!title) 
            return;

        const result: Todo = {
            id: this.todo?.id ?? (crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
            title,
            description: this.draft.description.trim() || undefined,
            completed: this.todo?.completed ?? false,
            deadline: this.draft.deadline ? this.draft.deadline.toISOString() : undefined,
        };

        this.save.emit(result);
        this.visibleChange.emit(false);
    }
}

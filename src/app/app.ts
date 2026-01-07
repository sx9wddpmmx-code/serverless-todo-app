import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodoPage } from './components/todo-page/todo-page';

@Component({
    selector: 'app-root',
    imports: [TodoPage],
    templateUrl: './app.html',
    styleUrl: './app.css'
})
export class App {
    
}

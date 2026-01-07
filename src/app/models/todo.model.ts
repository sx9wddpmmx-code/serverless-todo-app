/**
 * Die Modelklasse repräsentiert einen einzelnen Todo-Eintrag. Sie dient als
 * zentrales Datenmodell für die Darstellung im Frontend.
 * Die Felder sind so gewählt, dass sie die grundlegenden Eigenschaften
 * eines Todo-Eintrags abbilden. 
 */
export interface Todo {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    deadline?: string;
}
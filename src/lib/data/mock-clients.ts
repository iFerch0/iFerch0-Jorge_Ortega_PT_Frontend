export interface Client {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    status: "active" | "inactive" | "archived";
    lastCheckIn?: string; // ISO Date
    goal: string;
    joinedAt: string; // ISO Date
}

export const mockClients: Client[] = [
    {
        id: "1",
        firstName: "Carlos",
        lastName: "Rodriguez",
        email: "carlos.rod@example.com",
        phone: "+57 300 123 4567",
        avatar: "https://i.pravatar.cc/150?u=1",
        status: "active",
        lastCheckIn: "2024-02-10T09:00:00Z",
        goal: "Perder Peso",
        joinedAt: "2024-01-15T10:00:00Z",
    },
    {
        id: "2",
        firstName: "Ana",
        lastName: "Martinez",
        email: "ana.martinez@example.com",
        phone: "+57 300 987 6543",
        avatar: "https://i.pravatar.cc/150?u=2",
        status: "active",
        lastCheckIn: "2024-02-08T16:30:00Z",
        goal: "Ganar Músculo",
        joinedAt: "2023-11-20T14:00:00Z",
    },
    {
        id: "3",
        firstName: "Luis",
        lastName: "Gomez",
        email: "luis.gomez@example.com",
        phone: "+57 311 222 3333",
        status: "inactive",
        goal: "Mejorar Resistencia",
        joinedAt: "2023-10-05T09:15:00Z",
    },
    {
        id: "4",
        firstName: "Maria",
        lastName: "Fernandez",
        email: "maria.fer@example.com",
        phone: "+57 315 555 6666",
        avatar: "https://i.pravatar.cc/150?u=4",
        status: "active",
        lastCheckIn: "2024-02-11T08:00:00Z",
        goal: "Mantenimiento",
        joinedAt: "2024-01-02T11:00:00Z",
    },
    {
        id: "5",
        firstName: "Jorge",
        lastName: "Ortega",
        email: "jorge.ortega@example.com",
        phone: "+57 300 000 0000",
        avatar: "https://i.pravatar.cc/150?u=5",
        status: "archived",
        goal: "Ganar Fuerza",
        joinedAt: "2023-06-15T10:00:00Z",
    },
];

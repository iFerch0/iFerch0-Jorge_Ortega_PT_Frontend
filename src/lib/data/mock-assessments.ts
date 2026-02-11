export interface Assessment {
    id: string;
    clientId: string;
    date: string; // ISO Date
    weight: number;
    bodyFatPercentage?: number;
    muscleMassPercentage?: number;
    visceralFat?: number;
    notes?: string;
    photos?: string[];
}

export const mockAssessments: Assessment[] = [
    // Assessments for Carlos Rodriguez (id: "1")
    {
        id: "a1",
        clientId: "1",
        date: "2024-02-10T09:00:00Z",
        weight: 82.5,
        bodyFatPercentage: 22.5,
        muscleMassPercentage: 38.0,
        visceralFat: 8,
        notes: "Buena progrsión en fuerza. Se siente con más energía.",
    },
    {
        id: "a2",
        clientId: "1",
        date: "2024-01-15T10:00:00Z",
        weight: 83.7, // -1.2kg difference
        bodyFatPercentage: 23.2,
        muscleMassPercentage: 37.5,
        visceralFat: 8,
        notes: "Evaluación inicial. Objetivo: bajar grasa visceral.",
    },
    // Assessments for Ana Martinez (id: "2")
    {
        id: "a3",
        clientId: "2",
        date: "2024-02-08T16:30:00Z",
        weight: 60.0,
        bodyFatPercentage: 25.0,
        notes: "Aumento de carga en tren inferior.",
    },
];

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useWizardStore } from "@/store/wizard-store";
import { availabilitySchema, Availability } from "@/lib/validators/wizard-schema";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import WizardLayout from "../WizardLayout";

const daysOfWeek = [
    { id: "monday", label: "Lunes" },
    { id: "tuesday", label: "Martes" },
    { id: "wednesday", label: "Miércoles" },
    { id: "thursday", label: "Jueves" },
    { id: "friday", label: "Viernes" },
    { id: "saturday", label: "Sábado" },
    { id: "sunday", label: "Domingo" },
];

const equipmentList = [
    { id: "gym_full", label: "Gimnasio Completo" },
    { id: "dumbbells", label: "Mancuernas" },
    { id: "barbell", label: "Barra y Discos" },
    { id: "bands", label: "Bandas Elásticas" },
    { id: "bodyweight", label: "Solo Peso Corporal" },
    { id: "cardio_machine", label: "Máquina de Cardio" },
];

export default function StepAvailability() {
    const { data, setAvailability, nextStep, prevStep } = useWizardStore();

    const form = useForm<Availability>({
        resolver: zodResolver(availabilitySchema) as any,
        defaultValues: data.availability || {
            trainingDays: [],
            trainingDuration: "60_min",
            equipment: [],
        },
    });

    function onSubmit(values: Availability) {
        setAvailability(values);
        nextStep();
    }

    return (
        <WizardLayout
            title="Disponibilidad y Equipo"
            description="¿Cuándo y con qué vas a entrenar?"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    {/* Training Days */}
                    <FormField
                        control={form.control}
                        name="trainingDays"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Días de Entrenamiento</FormLabel>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {daysOfWeek.map((day) => (
                                        <FormField
                                            key={day.id}
                                            control={form.control}
                                            name="trainingDays"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={day.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(day.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, day.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== day.id
                                                                            )
                                                                        );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {day.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Duration */}
                    <FormField
                        control={form.control}
                        name="trainingDuration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duración por Sesión</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecciona" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="30_min">30 Minutos</SelectItem>
                                        <SelectItem value="45_min">45 Minutos</SelectItem>
                                        <SelectItem value="60_min">60 Minutos</SelectItem>
                                        <SelectItem value="90_min_plus">+90 Minutos</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Equipment */}
                    <FormField
                        control={form.control}
                        name="equipment"
                        render={() => (
                            <FormItem>
                                <div className="mb-4">
                                    <FormLabel className="text-base">Equipo Disponible</FormLabel>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {equipmentList.map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="equipment"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-center space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        );
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal cursor-pointer">
                                                            {item.label}
                                                        </FormLabel>
                                                    </FormItem>
                                                );
                                            }}
                                        />
                                    ))}
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-between">
                        <Button type="button" variant="outline" onClick={prevStep}>
                            Atrás
                        </Button>
                        <Button type="submit" size="lg">
                            Revisar Resumen
                        </Button>
                    </div>
                </form>
            </Form>
        </WizardLayout>
    );
}

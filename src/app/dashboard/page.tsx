export default function DashboardPage() {
    return (
        <div className="flex flex-col gap-4">
            <h1 className="text-2xl font-bold">Bienvenido al Dashboard</h1>
            <p className="text-muted-foreground">
                Desde aquí podrás gestionar tus clientes y valoraciones.
            </p>
            {/* Add summary cards or quick actions here */}
        </div>
    );
}

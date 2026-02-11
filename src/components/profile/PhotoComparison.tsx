"use client";

import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function PhotoComparison({ beforeImage, afterImage }: { beforeImage?: string; afterImage?: string }) {
    if (!beforeImage || !afterImage) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Comparativa Visual</CardTitle>
                    <CardDescription>Sube fotos para ver el antes y después.</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-center h-[300px] text-muted-foreground border-2 border-dashed m-6 rounded-lg">
                    No hay suficientes fotos para comparar.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Comparativa Visual</CardTitle>
                <CardDescription>Desliza para ver el progreso.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 overflow-hidden rounded-b-lg">
                <ReactCompareSlider
                    itemOne={<ReactCompareSliderImage src={beforeImage} alt="Antes" />}
                    itemTwo={<ReactCompareSliderImage src={afterImage} alt="Después" />}
                    style={{ height: '400px', width: '100%', objectFit: 'cover' }}
                />
            </CardContent>
        </Card>
    );
}

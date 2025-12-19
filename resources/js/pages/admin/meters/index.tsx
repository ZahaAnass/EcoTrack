import AppLayout from '@/layouts/app-layout'
import { Head, Link, router } from '@inertiajs/react'

import {
    Table, TableHeader, TableRow, TableHead,
    TableBody, TableCell,
} from '@/components/ui/table'

import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

type Meter = {
    id: number
    name: string
    serial_number: string
    unit_price: number
}

export default function Index({ meters }: { meters: Meter[] }) {
    return (
        <AppLayout>
            <Head title="Meters" />

            <Card className="m-4">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Meters</CardTitle>

                    <Button asChild>
                        <Link href="/admin/meters/create">+ Add Meter</Link>
                    </Button>
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Serial</TableHead>
                                <TableHead>Unit Price</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {meters.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-6">
                                        No meters found.
                                    </TableCell>
                                </TableRow>
                            )}

                            {meters.map(meter => (
                                <TableRow key={meter.id}>
                                    <TableCell>{meter.name}</TableCell>
                                    <TableCell>{meter.serial_number}</TableCell>
                                    <TableCell>{meter.unit_price} MAD</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button asChild size="sm" variant="outline">
                                            <Link href={`/admin/meters/${meter.id}/edit`}>
                                                Edit
                                            </Link>
                                        </Button>

                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() =>
                                                router.delete(
                                                    route('admin.meters.destroy', meter.id)
                                                )
                                            }
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </AppLayout>
    )
}

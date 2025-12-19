import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function Edit({ meter }: any) {
    const { data, setData, put, processing, errors } = useForm({
        name: meter.name,
        serial_number: meter.serial_number,
        unit_price: meter.unit_price,
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        put(route('admin.meters.update', meter.id))
    }

    return (
        <AppLayout>
            <Head title="Edit Meter" />

            <Card className="m-4 max-w-xl">
                <CardHeader>
                    <CardTitle>Edit Meter</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Serial Number</Label>
                            <Input
                                value={data.serial_number}
                                onChange={e => setData('serial_number', e.target.value)}
                            />
                        </div>

                        <div>
                            <Label>Unit Price (MAD)</Label>
                            <Input
                                type="number"
                                value={data.unit_price}
                                onChange={e => setData('unit_price', e.target.value)}
                            />
                        </div>

                        <Button disabled={processing}>Update</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    )
}

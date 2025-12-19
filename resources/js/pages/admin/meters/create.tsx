import AppLayout from '@/layouts/app-layout'
import { Head, useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        serial_number: '',
        unit_price: '',
    })

    function submit(e: React.FormEvent) {
        e.preventDefault()
        post(route('admin.meters.store'))
    }

    return (
        <AppLayout>
            <Head title="Create Meter" />

            <Card className="m-4 max-w-xl">
                <CardHeader>
                    <CardTitle>Create Meter</CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label>Name</Label>
                            <Input
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                        </div>

                        <div>
                            <Label>Serial Number</Label>
                            <Input
                                value={data.serial_number}
                                onChange={e => setData('serial_number', e.target.value)}
                            />
                            {errors.serial_number && (
                                <p className="text-red-500 text-sm">{errors.serial_number}</p>
                            )}
                        </div>

                        <div>
                            <Label>Unit Price (MAD)</Label>
                            <Input
                                type="number"
                                value={data.unit_price}
                                onChange={e => setData('unit_price', e.target.value)}
                            />
                            {errors.unit_price && (
                                <p className="text-red-500 text-sm">{errors.unit_price}</p>
                            )}
                        </div>

                        <Button disabled={processing}>Save</Button>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    )
}

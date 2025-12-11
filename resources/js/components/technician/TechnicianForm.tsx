import React from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import InputError from "@/components/input-error";
import { useForm } from "@inertiajs/react";
import type { Meter, Period } from "@/types";

type Props = { meters: Meter[]; periods: Period[]; entry?: any; onSuccess?: ()=>void };

export default function TechnicianForm({ meters, periods, entry, onSuccess }: Props) {
    const isEdit = Boolean(entry?.id);
    const { data, setData, post, put, processing, errors } = useForm({
        meter_id: entry?.meter_id?.toString() ?? "",
        period_id: entry?.period_id?.toString() ?? "",
        consumption_current: entry?.current_value?.toString() ?? "",
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit) {
            put(`/consumptions/${entry.id}`, {
                onSuccess: onSuccess
            });
        } else {
            post("/consumptions", { onSuccess: onSuccess });
        }
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <label className="block mb-1 text-sm font-medium">Meter</label>
                <Select value={data.meter_id} onValueChange={(v)=>setData("meter_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Select meter" /></SelectTrigger>
                    <SelectContent>
                        {meters.map(m=> <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <InputError message={errors.meter_id} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Period</label>
                <Select value={data.period_id} onValueChange={(v)=>setData("period_id", v)}>
                    <SelectTrigger><SelectValue placeholder="Select period" /></SelectTrigger>
                    <SelectContent>
                        {periods.map(p=> <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
                    </SelectContent>
                </Select>
                <InputError message={errors.period_id} />
            </div>

            <div>
                <label className="block mb-1 text-sm font-medium">Current Value</label>
                <Input type="number" min={0} value={data.consumption_current} onChange={(e)=>setData("consumption_current", e.target.value)} />
                <InputError message={errors.consumption_current} />
            </div>

            <Button type="submit" disabled={processing}>{isEdit ? "Update" : "Save Consumption"}</Button>
        </form>
    );
}

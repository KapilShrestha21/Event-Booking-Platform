import React, { useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

// Helper to format Date objects / ISO strings into 'YYYY-MM-THH:mm' for datetime-local inputs
const formatForDateTimeLocal = (date) => {
    if (!date) return '';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
}

const EventForm = ({
    schema,
    initialValues,
    onSubmit,
    isLoading = false,
    title = "Event Details",
    description = "Fill up the form to save event details",
    submitLabel = "Submit"
}) => {
    // State to hold live image preview (URL string or blob URL)
    const [preview, setPreview] = useState(initialValues?.image_url || initialValues?.image || '');

    const { control, handleSubmit } = useForm({
        resolver: zodResolver(schema),

        values: initialValues ?
            {
                ...initialValues, event_date: formatForDateTimeLocal(initialValues.event_date),
                image: initialValues.image_url || initialValues.image || ''
            } :
            undefined,

        defaultValues: {
            title: '',
            description: '',
            venue: '',
            total_tickets: '',
            price: '',
            status: 'published',
            event_date: '',
            image: ''
        }
    });

    useEffect(() => {
        // Store this cleanup task: React will NOT run this code now,
        // it will only run it when `preview` changes or the component unmounts.      
        return () => {
            if (preview && preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview)
            }
        }
    }, [preview]);


    // it is to show existing image in form in updateform ui
    useEffect(() => {
        if (initialValues) {
            setPreview(initialValues.image_url || initialValues.image || '');
        }
    }, [initialValues])

    return (
        <Card className="w-full max-w-xl mx-auto bg-white border-zinc-200 text-zinc-900 shadow-xl rounded-2xl overflow-hidden">
            <CardHeader className="space-y-1.5 pb-4 border-b border-zinc-100 px-4 sm:px-6">
                <CardTitle className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900">{title}</CardTitle>
                <CardDescription className="text-zinc-500 text-xs sm:text-sm">{description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-6 px-4 sm:px-6">
                <form id="event-form" onSubmit={handleSubmit(onSubmit)}>
                    <FieldGroup className="space-y-4 sm:space-y-5">

                        {/* title  */}
                        <Controller
                            name='title'
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="title" className="text-xs sm:text-sm font-medium text-zinc-700">Event Title</FieldLabel>
                                    <Input
                                        {...field}
                                        id="title"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. Tech Conference 2026"
                                        className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 rounded-xl transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                    )}
                                </Field>
                            )}
                        />

                        {/* description */}
                        <Controller
                            name="description"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="description" className="text-xs sm:text-sm font-medium text-zinc-700">Description (Optional)</FieldLabel>
                                    <Input
                                        {...field}
                                        id="description"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="Brief summary of the event"
                                        className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 rounded-xl transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                    )}
                                </Field>
                            )}
                        />

                        {/* venue */}
                        <Controller
                            name="venue"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="venue" className="text-xs sm:text-sm font-medium text-zinc-700">Venue</FieldLabel>
                                    <Input
                                        {...field}
                                        id="venue"
                                        type="text"
                                        aria-invalid={fieldState.invalid}
                                        placeholder="e.g. Grand Hall, City Center"
                                        className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 rounded-xl transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Total Tickets & Price Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <Controller
                                name="total_tickets"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="total_tickets" className="text-xs sm:text-sm font-medium text-zinc-700">Total Tickets</FieldLabel>
                                        <Input
                                            {...field}
                                            id="total_tickets"
                                            min="1"
                                            type="number"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="100"
                                            className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 rounded-xl transition-all"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                        )}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="price"
                                control={control}
                                render={({ field, fieldState }) => (
                                    <Field>
                                        <FieldLabel htmlFor="price" className="text-xs sm:text-sm font-medium text-zinc-700">Price ($)</FieldLabel>
                                        <Input
                                            {...field}
                                            id="price"
                                            type="number"
                                            min="1"
                                            step="0.01"
                                            aria-invalid={fieldState.invalid}
                                            placeholder="0.00"
                                            className="bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 rounded-xl transition-all"
                                        />
                                        {fieldState.invalid && (
                                            <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                        )}
                                    </Field>
                                )}
                            />
                        </div>

                        {/* Event Date */}
                        <Controller
                            name="event_date"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="event_date" className="text-xs sm:text-sm font-medium text-zinc-700">Event Date & Time</FieldLabel>
                                    <Input
                                        {...field}
                                        id="event_date"
                                        type="datetime-local"
                                        aria-invalid={fieldState.invalid}
                                        className="bg-white border-zinc-200 text-zinc-900 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 rounded-xl transition-all [color-scheme:light]"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Status */}
                        <Controller
                            name="status"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="status" className="text-xs sm:text-sm font-medium text-zinc-700">Status</FieldLabel>
                                    <select
                                        {...field}
                                        id="status"
                                        className="w-full h-10 px-3 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all cursor-pointer"
                                    >
                                        <option value="draft" className="bg-white text-zinc-800">Draft</option>
                                        <option value="published" className="bg-white text-zinc-800">Published</option>
                                        <option value="cancelled" className="bg-white text-zinc-800">Cancelled</option>
                                    </select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Image upload */}
                        <Controller
                            name="image"
                            control={control}
                            render={({ field, fieldState }) => (
                                <Field>
                                    <FieldLabel htmlFor="image" className="text-xs sm:text-sm font-medium text-zinc-700">Event Image</FieldLabel>

                                    {/* Preview container */}
                                    {preview && (
                                        <div className="mb-3 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-1">
                                            <img
                                                src={preview}
                                                alt="Event Preview"
                                                className="w-full h-36 sm:h-48 object-cover rounded-lg"
                                            />
                                        </div>
                                    )}

                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/jpeg, image/png, image/webp"
                                        aria-invalid={fieldState.invalid}
                                        onChange={(event) => {
                                            const file = event.target.files?.[0]; // take raw binary data of file and pass it to React hook form
                                            if (file) {
                                                field.onChange(file); // Stores File object in react-hook-form
                                                setPreview(URL.createObjectURL(file)); // Creates a temporary link in browser RAM (e.g., blob:http://localhost:5173/abc-123) so the UI can render the image before it gets uploaded.
                                            }
                                        }}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                        ref={field.ref}
                                        className="bg-white border-zinc-200 text-zinc-600 file:bg-emerald-50 file:text-emerald-700 file:border-0 file:rounded-lg file:px-3 file:py-1 file:mr-3 file:text-xs file:font-semibold hover:file:bg-emerald-100 cursor-pointer rounded-xl transition-all"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} className="text-rose-500 text-xs mt-1" />
                                    )}
                                </Field>
                            )}
                        />

                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter className="pt-2 pb-6 px-4 sm:px-6 border-t border-zinc-100 mt-2">
                <Field orientation="horizontal" className="w-full">
                    <Button 
                        type="submit" 
                        form="event-form" 
                        disabled={isLoading}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] text-white font-semibold py-2.5 rounded-xl shadow-md shadow-emerald-900/10 transition-all disabled:opacity-50"
                    >
                        {isLoading ? "Saving..." : submitLabel}
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    );
};

export default EventForm;
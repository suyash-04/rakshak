"use client"
import { sendMessage } from "../utils/twilio"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useState } from "react"

const formSchema = z.object({
    type: z.enum(["accident", "damagedroad", "landslide", "flood", "other"]),
})

interface AccidentReportFormProps {
    onClose: () => void;
    coordinates: [number, number];
}

const AccidentReportForm: React.FC<AccidentReportFormProps> = ({ onClose, coordinates }) => {
    const [isSubmitted, setIsSubmitted] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "accident",
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/report-hazard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...values,
                    latitude: coordinates[0],
                    longitude: coordinates[1],
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to submit report')
            }
            setIsSubmitted(true) // Set submission status

            const messageResponse = await sendMessage(coordinates[0], coordinates[1])
            console.log(messageResponse)

            setTimeout(onClose, 2000) // Close form after 2 seconds for feedback display
        } catch (error) {
            console.error('Error submitting form:', error)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Accident Report Form</CardTitle>
                <CardDescription>Please fill out the details of the accident below.</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Type of Accident</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select accident type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="accident">Vehicle Accident</SelectItem>
                                            <SelectItem value="damagedroad">Damaged Road / Potholes</SelectItem>
                                            <SelectItem value="landslide">Landslide</SelectItem>
                                            <SelectItem value="flood">Flood</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full">Submit Report</Button>
                        {isSubmitted && <p className="text-green-500 mt-2 px-1">Report submitted successfully!</p>}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

export default AccidentReportForm

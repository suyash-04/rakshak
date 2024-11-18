"use client"
import { sendMessage } from "../utils/twilio"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
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
import { useToast } from "@/hooks/use-toast"
import { getLocationFromCoordinates } from "../utils/getLocationFromCoordinates"

const formSchema = z.object({
    type: z.enum(["accident", "damagedroad", "landslide", "flood", "other"]),
    photo: z
        .instanceof(File)
        .refine(file => file?.type.startsWith("image/"), "Only image files are allowed")
        .refine(file => file?.size <= 5 * 1024 * 1024, "Max file size is 5MB"),
})

interface AccidentReportFormProps {
    onClose: () => void
    coordinates: [number, number]
}

const AccidentReportForm: React.FC<AccidentReportFormProps> = ({ onClose, coordinates }) => {
    const [isSubmitted, setIsSubmitted] = useState(false)
    const { toast } = useToast()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "accident",
            photo: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const formData = new FormData()
            formData.append("type", values.type)
            formData.append("latitude", String(coordinates[0]))
            formData.append("longitude", String(coordinates[1]))

            const response = await fetch("http://127.0.0.1:8000/api/report-hazard", {
                method: "POST",
                body: formData,
            })

            setIsSubmitted(true) // Set submission status

            const messageResponse = await sendMessage(coordinates[0], coordinates[1])

            console.log(messageResponse)

            setTimeout(onClose, 500) // Close form after 2 seconds for feedback display
        } catch (error) {
            console.error("Error submitting form:", error)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Hazard Report Form</CardTitle>
                <CardDescription>Please fill out the details of the hazard below.</CardDescription>
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
                                            <SelectItem value="other">Fire</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormItem>
                            <FormLabel>Upload Photo</FormLabel>
                            <FormControl>
                                <Controller
                                    name="photo"
                                    control={form.control}
                                    render={({ field }) => (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => field.onChange(e.target.files?.[0])}
                                        />
                                    )}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </CardContent>
                    <CardFooter>
                        <Button
                            type="submit"
                            className="w-full"
                            onClick={async () => {
                                try {
                                    const location = await getLocationFromCoordinates(coordinates[0], coordinates[1])
                                    toast({
                                        title: "Accident Reported",
                                        description: `Accident reported at ${location}`,
                                    })
                                } catch (error) {
                                    toast({
                                        title: "Error",
                                        description: "Failed to report the accident. Please try again.",
                                    })
                                }
                            }}
                        >
                            Submit Report
                        </Button>
                        {isSubmitted && (
                            <p className="text-green-500 mt-2 px-1">Report submitted successfully!</p>
                        )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    )
}

export default AccidentReportForm

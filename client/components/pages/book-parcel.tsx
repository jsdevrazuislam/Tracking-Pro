"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Package, MapPin, CreditCard, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import * as z from "zod";
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { bookParcel } from "@/lib/apis/parcel"
import { toast } from "sonner"
import MapboxAddressInput from "@/components/ui/autocomplete-input"
import { useState } from "react"


const parcelBookingSchema = z.object({
    pickup_address: z.object({
        place_name: z.string().min(10, { message: "Pickup address name must be at least 10 characters." }).max(255, { message: "Pickup address name is too long." }),
        lat: z.number().min(-90, "Latitude must be between -90 and 90.").max(90, "Latitude must be between -90 and 90."),
        long: z.number().min(-180, "Longitude must be between -180 and 180.").max(180, "Longitude must be between -180 and 180."),
    }, { message: "Pickup address is required and must include name, latitude, and longitude." }),

    receiver_address: z.object({
        place_name: z.string().min(10, { message: "Receiver address name must be at least 10 characters." }).max(255, { message: "Receiver address name is too long." }),
        lat: z.number().min(-90, "Latitude must be between -90 and 90.").max(90, "Latitude must be between -90 and 90."),
        long: z.number().min(-180, "Longitude must be between -180 and 180.").max(180, "Longitude must be between -180 and 180."),
    }, { message: "Receiver address is required and must include name, latitude, and longitude." }),

    parcel_type: z.enum([
        "document",
        "package",
        "fragile",
        "electronics",
        "clothing",
        "food"
    ], { message: "Please select a valid parcel type." }),
    parcel_size: z.preprocess(
        (val) => Number(val),
        z.number()
            .min(0.1, { message: "Weight must be at least 0.1 kg." })
            .max(100, { message: "Max weight is 100 kg." })
            .positive({ message: "Weight must be a positive number." })
    ),
    payment_type: z.enum(["prepaid", "cod"], { message: "Please select a payment mode." }),
});

type ParcelBookingInputs = z.infer<typeof parcelBookingSchema>;

export default function BookParcel() {
    const router = useRouter()
    const [query, setQuery] = useState("")
    const [queryDeliver, setQueryDeliver] = useState("")
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        control,
        formState: { errors },
        reset,
    } = useForm<ParcelBookingInputs>({
        resolver: zodResolver(parcelBookingSchema),
        defaultValues: {
            parcel_type: "package",
            parcel_size: 1,
            payment_type: "cod",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: bookParcel,
        onSuccess: () => {
            setQuery("")
            setQueryDeliver("")
            reset();
            router.push('/customer/dashboard')
            toast.success('Parcel Booked Successfully')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })


    const formData = watch();

    const calculatePrice = () => {
        const basePrice = 15;
        const currentWeight = Number.parseFloat(formData.parcel_size ? formData.parcel_size.toString() : "0");
        const weightPrice = currentWeight * 2;
        return basePrice + weightPrice;
    };

    const onSubmit = async (data: ParcelBookingInputs) => {
        mutate({
            ...data,
            amount: calculatePrice()
        })
    };


    return (
            <div className="max-w-4xl mx-auto space-y-6">
                <div>
                    <h1 className="text-3xl font-bold">Book New Parcel</h1>
                    <p className="text-gray-600">Fill in the details to book your parcel for pickup and delivery</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-green-600" />
                                    Pickup Details
                                </CardTitle>
                                <CardDescription>Where should we pick up your parcel?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="w-full">
                                    <Controller
                                        name="pickup_address"
                                        control={control}
                                        render={({ field }) => (
                                            <MapboxAddressInput
                                                field={field}
                                                label="Pickup Address"
                                                error={errors.pickup_address?.message}
                                                query={query}
                                                setQuery={setQuery}
                                            />
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                                    Delivery Details
                                </CardTitle>
                                <CardDescription>Where should we deliver your parcel?</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="w-full">
                                    <Controller
                                        name='receiver_address'
                                        control={control}
                                        render={({ field }) => (
                                            <MapboxAddressInput query={queryDeliver}
                                                setQuery={setQueryDeliver} field={field} label="Delivery Address" error={errors.receiver_address?.message} />
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Parcel Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="h-5 w-5 mr-2 text-purple-600" />
                                    Parcel Details
                                </CardTitle>
                                <CardDescription>Tell us about your parcel</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="parcelType">Parcel Type</Label>
                                        <Select
                                            onValueChange={(value) => setValue('parcel_type', value as ParcelBookingInputs['parcel_type'], { shouldValidate: true })}
                                            value={formData.parcel_type}
                                        >
                                            <SelectTrigger error={errors?.parcel_type?.message} id='parcelType'>
                                                <SelectValue placeholder="Select parcel type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="document">Document</SelectItem>
                                                <SelectItem value="package">Package</SelectItem>
                                                <SelectItem value="fragile">Fragile Item</SelectItem>
                                                <SelectItem value="electronics">Electronics</SelectItem>
                                                <SelectItem value="clothing">Clothing</SelectItem>
                                                <SelectItem value="food">Food Item</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Parcel Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            placeholder="0.0"
                                            {...register('parcel_size', { valueAsNumber: true })}
                                            error={errors?.parcel_size?.message}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Payment & Summary
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <Label>Payment Mode</Label>
                                    <RadioGroup
                                        onValueChange={(value) => setValue('payment_type', value as ParcelBookingInputs['payment_type'], { shouldValidate: true })}
                                        value={formData.payment_type}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="prepaid" id="prepaid" />
                                            <Label htmlFor="prepaid">Prepaid</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="cod" id="cod" />
                                            <Label htmlFor="cod">Cash on Delivery (COD)</Label>
                                        </div>
                                    </RadioGroup>
                                    {errors.payment_type && (
                                        <p className="text-red-500 text-sm">{errors?.payment_type?.message}</p>
                                    )}
                                </div>

                                <div className="border-t pt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span>Base Price</span>
                                        <span>$15.00</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between font-medium">
                                        <span>Total</span>
                                        <span>${calculatePrice().toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 space-y-2">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>Estimated Delivery: 1-2 business days</span>
                                    </div>
                                </div>

                                <Button isLoading={isPending} type="submit" className="w-full" size="lg">
                                    Book Parcel - ${calculatePrice().toFixed(2)}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </form>
            </div>
    )
}

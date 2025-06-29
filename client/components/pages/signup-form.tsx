"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/store"
import { useMutation } from "@tanstack/react-query"
import { registerUser } from "@/lib/apis/auth"
import { toast } from "sonner"
import { useTranslation } from "@/hooks/use-translation"
import axios from "axios"
import { useState } from "react"

const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    full_name: z.string().min(1, 'Full name is required'),
    phone: z.string()
        .length(11, { message: "Phone number must be exactly 11 digits." })
        .regex(/^(013|014|015|016|017|018|019)\d{8}$/, { message: "Invalid Bangladeshi phone number. Must start with 013-019 and be 11 digits long." }),
    role: z.string(),
    location: z.object({
            place_name: z.string().min(10, { message: "Receiver address name must be at least 10 characters." }).max(255, { message: "Receiver address name is too long." }),
            lat: z.number().min(-90, "Latitude must be between -90 and 90.").max(90, "Latitude must be between -90 and 90."),
            long: z.number().min(-180, "Longitude must be between -180 and 180.").max(180, "Longitude must be between -180 and 180."),
        }, { message: "Receiver address is required and must include name, latitude, and longitude." }).optional(),
});

type SignupFormInputs = z.infer<typeof registerSchema>;

export const getPlaceNameFromCoordinates = async (latitude: number, longitude: number) => {
    try {
        const { data } = await axios.post('/api/mapbox/place', { latitude, longitude });
        return data.place_name;
    } catch (error) {
        throw new Error('Failed to fetch place name');
    }
};


export default function SignupForm() {
    const router = useRouter()
    const { setLogin } = useAuthStore()
    const { t } = useTranslation()
    const [loading, setLoading] = useState(false)


    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
    } = useForm<SignupFormInputs>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            email: "",
            password: "",
            role: 'customer',
            full_name: ''
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: registerUser,
        onSuccess: ({ data, }) => {

            function callback() {
                toast.success("Login successful! Redirecting...")
                setLogin(data?.access_token, data?.user);
                reset();
            }


            const role = data.user?.role;

            let redirectTo = "/";


            switch (role) {
                case "admin":
                    callback()
                    redirectTo = "/admin/dashboard";
                    break;
                case "customer":
                    callback()
                    redirectTo = "/customer/dashboard";
                    break;
                case "agent":
                    callback()
                    redirectTo = "/agent/dashboard";
                    break;
                default:
                    redirectTo = "/";
            }

            router.push(redirectTo);
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })



    const onSubmit = async (data: SignupFormInputs) => {

        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser.");
            return;
        }

        setLoading(true)
        try {
            const position: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;
            const place_name = await getPlaceNameFromCoordinates(latitude, longitude)

            mutate({
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                role: data.role,
                phone: data.phone,
                location: {
                    latitude,
                    longitude,
                    place_name
                },
            });

        } catch (error) {
            console.log("Geolocation error:", error);
        } finally {
            setLoading(false)
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    {t('fullName')}
                </Label>
                <Input
                    id="name"
                    placeholder={t('enterYourFullEmail')}
                    {...register("full_name")}
                    className="h-11"
                    error={errors?.full_name?.message}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                    {t('emailAddress')}
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('enterYourEmail')}
                    {...register("email")}
                    error={errors?.email?.message}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                    {t('password')}
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder={t('enterYourPassword')}
                    {...register("password")}
                    error={errors?.password?.message}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                    {t('phoneNumber')}
                </Label>
                <Input
                    id="phone"
                    type="text"
                    placeholder={t('examplePhoneNumber')}
                    {...register("phone")}
                    error={errors?.phone?.message}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                    {t('accountType')}
                </Label>
                <Controller
                    name='role'
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger id='role' error={errors?.role?.message} className="h-11">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="customer">Customer</SelectItem>
                                <SelectItem value="agent">Delivery Agent</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />

            </div>
            <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                isLoading={loading ||  isPending}
            >
                Create Account
            </Button>
        </form>
    )
}

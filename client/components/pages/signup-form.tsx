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

const registerSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    full_name: z.string().min(1, 'Full name is required'),
    phone: z.string()
        .length(11, { message: "Phone number must be exactly 11 digits." })
        .regex(/^(013|014|015|016|017|018|019)\d{8}$/, { message: "Invalid Bangladeshi phone number. Must start with 013-019 and be 11 digits long." }),
    role: z.string()
});

type SignupFormInputs = z.infer<typeof registerSchema>;

export async function getPlaceNameFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
        const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

        if (!MAPBOX_ACCESS_TOKEN) {
            console.error("Mapbox Access Token is not set.");
            return null;
        }

        const apiUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&country=bd&limit=1`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.features && data.features.length > 0) {
                return data.features[0].place_name;
            } else {
                console.warn("No place name found for these coordinates.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching place name from Mapbox:", error);
            return null;
        }
    }

export default function SignupForm() {
    const router = useRouter()
    const { setLogin } = useAuthStore()


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

        try {
            const position: GeolocationPosition = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 0
                });
            });

            const { latitude, longitude } = position.coords;

            mutate({
                email: data.email,
                password: data.password,
                full_name: data.full_name,
                role: data.role,
                phone: data.phone,
                location: {
                    latitude,
                    longitude,
                    place_name: await getPlaceNameFromCoordinates(latitude, longitude)
                },
            });

        } catch (error: any) {
            if (error.code === error.PERMISSION_DENIED) {
                toast.error("Location permission is required to sign up. Please enable location services for this site.");
            } else if (error.code === error.TIMEOUT) {
                toast.error("Could not get your location. Please try again.");
            } else {
                toast.error(`Failed to get location: ${error.message || "Unknown error."}`);
            }
            console.error("Geolocation error:", error);
        }
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                    Full Name
                </Label>
                <Input
                    id="name"
                    placeholder="Enter your full name"
                    {...register("full_name")}
                    className="h-11"
                    error={errors?.full_name?.message}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    {...register("email")}
                    error={errors?.email?.message}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                    Password
                </Label>
                <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    {...register("password")}
                    error={errors?.password?.message}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                </Label>
                <Input
                    id="phone"
                    type="text"
                    placeholder="Example: 01739402788"
                    {...register("phone")}
                    error={errors?.phone?.message}
                    className="h-11"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                    Account Type
                </Label>
                <Controller
                    name='role'
                    control={control}
                    render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger error={errors?.role?.message} className="h-11">
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
                isLoading={isPending}
            >
                Create Account
            </Button>
        </form>
    )
}

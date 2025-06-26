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
    role: z.string()
});

type SignupFormInputs = z.infer<typeof registerSchema>;

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
        mutate({ email: data.email, password: data.password, full_name: data?.full_name, role: data?.role })
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

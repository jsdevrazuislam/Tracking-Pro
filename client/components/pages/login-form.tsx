"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginUser } from "@/lib/apis/auth";
import { useAuthStore } from "@/store/store";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/use-translation";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginForm() {
    const router = useRouter();
    const { setLogin } = useAuthStore()
    const { t } = useTranslation()

    const { mutate, isPending } = useMutation({
        mutationFn: loginUser,
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

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormInputs>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormInputs) => {
        mutate({ email: data.email, password: data.password })
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                    {t('emailAddress')}
                </Label>
                <Input
                    id="email"
                    type="email"
                    placeholder={t('enterYourEmail')}
                    {...register("email")}
                    className="h-11"
                    error={errors?.email?.message}
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
                    className="h-11"
                    error={errors?.password?.message}
                />
            </div>
            <Button
                type="submit"
                className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                isLoading={isPending}
            >
                {t('signIn')}
            </Button>
        </form>
    );
}
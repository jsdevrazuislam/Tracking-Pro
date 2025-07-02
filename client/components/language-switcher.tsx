"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from 'lucide-react'
import { useTranslation } from "@/hooks/use-translation"

interface LanguageData {
    code: Language
    name: string
    flag: string
}

const languages: LanguageData[] = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "bn", name: "বাংলা", flag: "🇧🇩" }
]

export function LanguageSwitcher() {

    const { setLanguage, language } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const handleLanguageChange = (language: LanguageData) => {
        setLanguage(language.code)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2 hover:bg-gray-100 transition-colors"
                >
                    <Globe className="h-4 w-4" />
                    <span className=" text-sm">{language === 'en' ? '🇺🇸' : '🇧🇩'}</span>
                    <span className=" text-sm">{language === 'en' ? 'English' : 'বাংলা'}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 border-b">
                    Select Language
                </div>
                {languages.map((lan) => (
                    <DropdownMenuItem
                        key={lan.code}
                        onClick={() => handleLanguageChange(lan)}
                        className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50"
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">{lan.flag}</span>
                            <span className="text-sm font-medium">{lan.name}</span>
                        </div>
                        {language === lan.code && (
                            <Check className="h-4 w-4 text-blue-600" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

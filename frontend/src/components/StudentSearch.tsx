'use client';

import { useState } from 'react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Loader2 } from "lucide-react"

interface StudentSearchProps {
    onSearch: (studentId: string) => void;
    isLoading?: boolean;
}

export default function StudentSearch({ onSearch, isLoading }: StudentSearchProps) {
    const [searchValue, setSearchValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchValue.trim()) {
            onSearch(searchValue.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full">
            <div className="flex gap-2">
                <div className="flex-1 relative">
                    <Input
                        placeholder="Enter Student ID (e.g., P/ND/23/94170)"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        className="w-full"
                        disabled={isLoading}
                    />
                </div>
                <Button 
                    type="submit" 
                    disabled={isLoading || !searchValue.trim()}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Searching
                        </>
                    ) : (
                        <>
                            <Search className="mr-2 h-4 w-4" />
                            Search
                        </>
                    )}
                </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 ml-1">
                Enter the full Student ID including slashes (e.g., P/ND/23/94170)
            </p>
        </form>
    );
}

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

export default function NotFound() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement your search logic here
    alert(`Searching for: ${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center">
        <h1 className="text-7xl font-extrabold text-gray-900 mb-4 tracking-tight">404</h1>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Whoops, that page is gone.</h2>
        <p className="text-gray-500 mb-8">
          While you’re here, try searching for something else below.
        </p>
      </div>
      <form onSubmit={handleSearch} className="flex justify-center mt-8 w-full max-w-md">
        <div className="relative flex w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16z" />
            </svg>
          </span>
          <Input
            type="text"
            placeholder="Search for designs or designer"
            className="pl-10 pr-4 py-2 rounded-full"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
}
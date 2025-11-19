// src/components/builds/BuildSearchInput.tsx

"use client";

interface BuildSearchInputProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function BuildSearchInput({
  search,
  onSearchChange,
}: BuildSearchInputProps) {
  return (
    <div className="w-full">
      <div className="relative w-full">
        <span className="
          pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 
          text-xs text-purple-800
        ">
          🔍
        </span>

        <input
          type="text"
          placeholder="Search by Build or Skill..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="
            h-9 w-full rounded-md border border-purple-300 
           glass bg-white/70 text-purple-950 
            shadow-lg shadow-purple-300/30
            pl-7 pr-3
            text-xs 
            placeholder:text-purple-700
            outline-none
            focus:border-purple-700
            backdrop-blur-sm
          "
        />
      </div>
    </div>
  );
}

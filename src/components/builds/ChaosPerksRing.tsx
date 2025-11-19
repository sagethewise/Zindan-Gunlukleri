// src/components/builds/ChaosPerksRing.tsx
"use client";

import Image from "next/image";
import { D4ClassId } from "@/lib/types";

interface ChaosPerksRingProps {
  classId: D4ClassId;
}

export default function ChaosPerksRing({ classId }: ChaosPerksRingProps) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-sm">
      {/* Arka plan (Barbarian chaos perk görseli) */}
      {classId === "barbarian" && (
        <Image
          src="/images/builds/barbarian-dual-basic-chaos-perk.png"
          alt="Barbarian Chaos Perks"
          fill
          className="pointer-events-none select-none object-contain"
        />
      )}

    </div>
  );
}




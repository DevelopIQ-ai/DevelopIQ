"use client"

import Image from "next/image"

export function CarouselImage({ src, alt }: { src: string, alt: string }) {
    return (
        <div className="flex flex-col items-center gap-4">
            <div className="w-24 h-24 relative">
                <Image
                src={src}
                alt={alt}
                fill
                sizes="(max-width: 96px) 100vw, 96px"
                className="object-contain opacity-50 hover:opacity-100 transition-opacity"
                />
            </div>
            {/* <span className="text-sm text-muted-foreground">{alt}</span> */}
        </div>
    );
}
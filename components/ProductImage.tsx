"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

// Muestra un placeholder con shimmer mientras la imagen carga y lo quita cuando
// la imagen real terminó de cargar. El shimmer se desactiva con
// prefers-reduced-motion vía CSS (.shimmer).
export default function ProductImage({ className, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <span className="shimmer absolute inset-0 block" aria-hidden="true" />
      )}
      <Image
        {...props}
        className={className}
        onLoad={() => setLoaded(true)}
        ref={(img) => {
          if (img?.complete) setLoaded(true);
        }}
      />
    </>
  );
}

"use client";
import { forwardRef, type ImgHTMLAttributes } from "react";

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, "src" | "srcSet"> & {src: string};
export const CenterPhoto = forwardRef<HTMLImageElement, Props>(function CenterPhoto({src, loading = "lazy", ...props}, ref) {
  const filename = src.split("/").pop();
  return <picture style={{display: "contents"}}>
    {src.startsWith("/images/center-v") && <source media="(max-width: 1023px)" srcSet={`/images/mobile-v4/${filename}`} />}
    <img {...props} ref={ref} src={src} loading={loading} decoding="async" />
  </picture>;
});

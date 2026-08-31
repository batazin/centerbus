import Image from "next/image";

type ProductTechnicalVisualProps = {
  mark: string;
  category: string;
  compact?: boolean;
  image?: string;
  imageAlt?: string;
};

export function ProductTechnicalVisual({
  mark,
  category,
  compact = false,
  image,
  imageAlt = "",
}: ProductTechnicalVisualProps) {
  return (
    <div
      className={`product-technical-visual${compact ? " is-compact" : ""}${image ? " has-product-image" : ""}`}
      aria-hidden={image ? undefined : "true"}
    >
      {image && (
        <Image
          className="product-visual-image"
          src={image}
          alt={imageAlt}
          fill
          priority={!compact}
          sizes={compact ? "(max-width: 700px) 100vw, 34vw" : "(max-width: 980px) 100vw, 52vw"}
        />
      )}
      <span className="product-visual-index">CENTER / CATÁLOGO</span>
      {!image && <strong>{mark}</strong>}
      <span className="product-visual-category">{category}</span>
      <i className="product-visual-axis" />
      <i className="product-visual-signal" />
    </div>
  );
}

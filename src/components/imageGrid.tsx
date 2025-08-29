"use client";
import ImageCard from "@/components/imageCard";

export default function ImageGrid() {
  const products = [
    { id: 1, src: "/rackets.png", name: "Racket" },
    { id: 2, src: "/rackets.png", name: "Shoes" },
    { id: 3, src: "/rackets.png", name: "Balls" },
    { id: 4, src: "/rackets.png", name: "Tennis Bag" },
    { id: 5, src: "/rackets.png", name: "Racket" },
    { id: 6, src: "/rackets.png", name: "Racket" },
    { id: 7, src: "/rackets.png", name: "Shoes" },
    { id: 8, src: "/rackets.png", name: "Balls" },
    { id: 9, src: "/rackets.png", name: "Tennis Bag" },
    { id: 10, src: "/rackets.png", name: "Racket" },
    { id: 11, src: "/rackets.png", name: "Racket" },
    { id: 22, src: "/rackets.png", name: "Shoes" },
    { id: 33, src: "/rackets.png", name: "Balls" },
    { id: 24, src: "/rackets.png", name: "Tennis Bag" },
    { id: 15, src: "/rackets.png", name: "Racket" },
    // …more
  ];
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 box-border p-5 overflow-y-scroll max-h-full">
      {products.map((p) => (
        <ImageCard key={p.id} src={p.src} name={p.name} id={p.id}></ImageCard>
      ))}
    </div>
  );
}

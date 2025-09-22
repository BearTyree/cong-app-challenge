"use client";
import ImageCard from "@/components/imageCard";

export default function ImageRow() {
  const products = [
    { id: 1, src: "/rackets.png", name: "Racket", dateListed: "Saturday"},
    { id: 2, src: "/rackets.png", name: "Shoes", dateListed: "Saturday"},
    { id: 3, src: "/rackets.png", name: "Balls", dateListed: "Saturday"},
    { id: 4, src: "/rackets.png", name: "Tennis Bag", dateListed: "Saturday"},
    { id: 5, src: "/rackets.png", name: "Tennis Bag", dateListed: "Saturday"},
    { id: 6, src: "/rackets.png", name: "Tennis Bag", dateListed: "Saturday"},
    { id: 7, src: "/rackets.png", name: "Racket", dateListed: "Saturday"},
    { id: 8, src: "/rackets.png", name: "Shoes", dateListed: "Saturday"},
    { id: 9, src: "/rackets.png", name: "Balls", dateListed: "Saturday"},
    { id: 10, src: "/rackets.png", name: "Tennis Bag", dateListed: "Saturday"},
    { id: 11, src: "/rackets.png", name: "Tennis Bag", dateListed: "Saturday"},
    { id: 12, src: "/rackets.png", name: "Tennis Bag", dateListed: "Saturday"},
    // …more
  ];
  return (
    <div className="flex gap-5 box-border p-5 overflow-x-scroll w-full">
      {products.map((p) => (
        <ImageCard key={p.id} src={p.src} name={p.name} id={p.id} dateListed={p.dateListed}></ImageCard>
      ))}
    </div>
  );
}

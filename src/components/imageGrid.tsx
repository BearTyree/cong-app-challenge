'use server';

import ImageCard from "@/components/imageCard";

export default async function ImageGrid({
  query,
  currentPage
}
  : {
    query?: string;
    currentPage?: number;
  }
) {
  // const products = await fetchFilteredProducts(query, currentPage); // Use this code when fetching api is available
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
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 box-border p-5 overflow-y-scroll w-full max-h-full">
      {products.map((p) => (
        <ImageCard key={p.id} src={p.src} name={p.name} id={p.id} dateListed={p.dateListed}></ImageCard>
      ))}
    </div>
  );
}

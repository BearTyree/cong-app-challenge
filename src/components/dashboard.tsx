"use client"
import { Banner } from "@/components/banner"
import ImageGrid from "@/components/imageGrid"

export default function Dashboard() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Banner></Banner>
            <ImageGrid></ImageGrid>
        </div>
        
    )
}
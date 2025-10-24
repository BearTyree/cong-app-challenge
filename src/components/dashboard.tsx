"use client"
import { Banner } from "@/components/banner"
import ImageRow from "@/components/imageRow"

export default function Dashboard() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Banner></Banner>
            <p className="w-full font-bold">From Top Givers</p>
            <ImageRow></ImageRow>
        </div>
        
    )
}
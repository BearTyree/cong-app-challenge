import { Banner } from "@/components/banner"
import ImageRow from "@/components/imageRow"
import { Button } from "./ui/button"
import Link from "next/link"
import { redirect } from "next/navigation"

export default function Landing() {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <Banner></Banner>
            <div className="my-2 flex flex-col justify-center items-center">
                <p className="text-4xl font-medium">
                    A donation driven marketplace for communities
                </p>
                <p className="mb-3 text-xl italic">built by communities</p>
                <Link href="/login">
                <Button className="bg-[#212121] cursor-pointer hover:bg-[#303030]">
                    Donate Now
                </Button>
                </Link>
            </div>
            <p className="w-full font-bold mb-4">Browse Available Items</p>
            <ImageRow></ImageRow>
        </div>
        
    )
}

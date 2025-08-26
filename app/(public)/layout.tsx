import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { ReactNode } from "react";


export default function PublicLayout({ children }: { children: ReactNode }) {
    return <div>
        <Navbar />
        <main className="p-2" >
            {children}
        </main>
        <Footer />
    </div>
}
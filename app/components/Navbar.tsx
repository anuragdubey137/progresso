"use client"

import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from "next-auth/react";


export function Navbar() {
    const session = useSession();
    return <div>
        <div className="flex justify-between m-2 p-2 border-b-2 border-gray-300 px-10">
            <div className="font-bold text-2xl py-1">
                progresso
            </div>
            <div>
               
                {!session.data?.user && <Button onClick={()=>signIn()}>signIn</Button>}
            </div>
        </div>
    </div>
}
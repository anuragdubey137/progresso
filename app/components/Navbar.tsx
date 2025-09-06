"use client"

import { signIn, signOut, useSession } from "next-auth/react";


export function Navbar() {
    const session = useSession();
    return <div>
        <div className="flex justify-between">
            <div>
                progresso
            </div>
            <div>
                {session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={()=>signOut()}>Logout</button>}
                {!session.data?.user && <button className="m-2 p-2 bg-blue-400" onClick={()=>signIn()}>signIn</button>}
            </div>
        </div>
    </div>
}
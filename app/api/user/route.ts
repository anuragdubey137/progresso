import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest) {
    const session = await getServerSession();
    const user = session?.user?.username;
    return NextResponse.json({ });
}

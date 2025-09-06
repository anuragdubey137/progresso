import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";



export async function POST(req:NextRequest){
    const session = await getServerSession();
    const user = await prismaClient.user.findFirst({
        where:{
            //@ts-ignore
            id : session?.user?.id
        }
    })
    if(!user){
        return NextResponse.json({
            message : "get user first"
        })
    }
    const body = await req.json();
    const projectExists = await prismaClient.project.findUnique({
  where: { id: body.projectId }
});

if (!projectExists) {
    return NextResponse.json({
        message: "Project does not exist"
    });
}

    
    const projectMember = await prismaClient.projectMember.create({
        data:{
            userId : user.id,
            projectId : body.projectId
        }

    })
    return NextResponse.json({
        message : "Member added successfully",
        projectMember
    })
}
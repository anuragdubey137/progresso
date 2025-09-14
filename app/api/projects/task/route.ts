import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req:NextRequest){
   const body = await req.json();
   const task = await prismaClient.task.create({
    data:{
        title : body.title,
        description : body.description,
        status : body.status,
        projectId : body.projectId,
        deadline : new Date(body.deadline)
    }
   })
   return NextResponse.json({
    message : "Task created successfully",
    task
   })
}
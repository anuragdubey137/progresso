import { prismaClient } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function POST (req:NextRequest){
    const body = await req.json();
    const projects = await prismaClient.project.create({
        data:{
            name : body.name ,
            deadline : new Date(body.deadline)
        }
    })
    return NextResponse.json({
        message:"Project created successfully",
        projects
    })
}

export async function GET(req:NextRequest){
    try{
    const project = await prismaClient.project.findMany();
    return NextResponse.json(project);
}   catch(error){
    return NextResponse.json({error:"Something went wrong"});
}
}

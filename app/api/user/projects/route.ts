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
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    const projects = await prismaClient.project.findMany({
      where: username ? { User: { some: { username: username } } } : {},
      include: { User: true }, 
    });

    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" });
  }
}

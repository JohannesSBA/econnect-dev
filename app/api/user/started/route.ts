import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();
  try {
    await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        gotStarted: true,
      },
    });
  } catch (error) {
    return new Response(error as string, { status: 500 });
  }

  return new Response("OK", { status: 200 });
}

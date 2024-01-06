import prisma from "@/app/lib/prisma";

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  // Create a new message in the conversation
  const getJobs = await prisma.jobListing.findMany({});

  return new Response(JSON.stringify(getJobs), { status: 201 });
}

//   await axios.post("/api/message/send", { text: input, chatId });

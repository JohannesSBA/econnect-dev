export async function POST(req: Request, res: Response) {
  const body = await req.json();
  console.log(body.prismaKey);
}

import { prisma } from "@/app/lib/prisma";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const postId = Number(params?.id);
    const post = await prisma.post.findUnique({
        where: {
            id: postId,
        },
        include: {
            author: {
                select: { name: true },
            },
        },
    });
    return {
        props: { post },
        revalidate: 10,
    };
};

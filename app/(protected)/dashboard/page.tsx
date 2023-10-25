// import SignOutButton from "@/app/components/SignOutButton";
// import { prisma } from "@/app/lib/prisma";
// import { GetStaticProps } from "next";
// import { AppProps } from "next/app";

// export const getStaticProps: GetStaticProps = async () => {
//     const feed = await prisma.post.findMany({
//         where: { published: true },
//         include: {
//             author: {
//                 select: { name: true },
//             },
//         },
//     });
//     return {
//         props: { feed },
//         revalidate: 10,
//     };
// };

import React from "react";

const page = () => {
    return <div>page</div>;
};

export default page;

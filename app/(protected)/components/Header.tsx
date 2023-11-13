// import React from "react";
// import Link from "next/link";
// import { signOut, useSession } from "next-auth/react";
// import { usePathname } from "next/navigation";
// import { getServerSession } from "next-auth";
// import { options } from "@/app/api/auth/[...nextauth]/options";
// import SignOutButton from "./SignOutButton";

// const Header: React.FC = async () => {
//   const currPath = "dashboard";
//   const isActive: (pathname: string) => boolean = (pathname) =>
//     currPath === pathname;

//   const session = await getServerSession(options);

//   let left = (
//     <div className="left">
//       <Link href="/">
//         Feed
//         {/* <a className="font-bold inline-block" data-active={isActive("/")}>
//           Feed
//         </a> */}
//       </Link>
//     </div>
//   );

//   let right = null;

//   if (1 === 1) {
//     left = (
//       <div className="left">
//         <Link href="/">
//           Feed
//           {/* <a className="font-bold" data-active={isActive("/")}>
//             Feed
//           </a> */}
//         </Link>
//       </div>
//     );
//     right = (
//       <div className="mr-auto">
//         <p>Validating session ...</p>
//       </div>
//     );
//   }

//   if (!session) {
//     right = (
//       <div className="right">
//         <Link href="/api/auth/signin">Login</Link>
//       </div>
//     );
//   }

//   if (session) {
//     left = (
//       <div className="left">
//         <Link href="/">
//           {/* <a className="bold" data-active={isActive("/")}>
//             Feed
//           </a> */}
//         </Link>
//         <Link href="/drafts">
//           {/* <a data-active={isActive("/drafts")}>My drafts</a> */}
//         </Link>
//       </div>
//     );
//     right = (
//       <div className="right">
//         <p>
//           {session.user.name} ({session.user.email})
//         </p>
//         <Link href="/create">new post</Link>
//         <SignOutButton />
//       </div>
//     );
//   }

//   return (
//     <nav>
//       {left}
//       {right}
//     </nav>
//   );
// };

// export default Header;

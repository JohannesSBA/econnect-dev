"use client";
import React from "react";
import { Section } from "../components/Section";
import HomePageMotion from "./HomePageMotion";
import { Button, Image, Link, Spacer } from "@nextui-org/react";
import { CustomCard } from "./CustomCard";
import { GiWaterDrop } from "react-icons/gi";
import { IconContext } from "react-icons";
import Footer from "./Footer";

interface MainProps {
  lang: string;
}

const Main = ({ lang }: MainProps) => {
  return (
    <div className="">
      <div className="w-full h-screen flex bg-gradient-to-b dark:from-blue-900 dark:to-blue-950 ">
        <div className="w-full md:w-1/2 p-12 flex flex-col gap-6 mt-12">
          {/* Section creates the animation to  the incoming object*/}
          <Section delay={0.2}>
            <h1 className="font-bold text-6xl md:text-8xl bg-gradient-to-r dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">
              {lang === "en"
                ? "Find Your Dream Job With Us"
                : "የህልም ስራዎን ከእኛ ጋር ያግኙ"}
            </h1>
          </Section>
          <Section delay={0.7}>
            <p className="mt-4 text-white">
              {lang == "en"
                ? "Discover a wide range of job opportunities and take the next step in your career. "
                : "ሰፊ የስራ እድሎችን ያግኙ እና ቀጣዩን እርምጃ ይውሰዱ በሙያዎ ውስጥ."}
            </p>
          </Section>
          <Section delay={1.2}>
            <div className="flex gap-2">
              <Button
                as={Link}
                color="primary"
                href="/register"
                variant="shadow"
              >
                {lang === "en" ? "Sign Up" : "ይመዝገቡ"}
              </Button>
              <Button
                as={Link}
                color="primary"
                href="/about"
                target="_blank"
                variant="ghost"
              >
                {lang === "en" ? "Learn More" : "ተጨማሪ ለመረዳት"}
              </Button>
            </div>
          </Section>
        </div>
        <div className="w-1/2 hidden md:flex overflow-visible">
          <div className="w-1/2 flex flex-col pl-24">
            <div className="w-full">
              <div className="ml-20">
                {" "}
                <HomePageMotion />
              </div>
              <div className="ml-64">
                {" "}
                <HomePageMotion />
              </div>
            </div>
            <div className="w-full justify-end items-end ml-12 -translate-y-24 -translate-x-24">
              <HomePageMotion />
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto px-6 lg:px-8 bg-gradient-to-b from-blue-950 to-blue-900">
        <h2 className="text-center text-base/7 font-semibold text-indigo-600">
          Get Employed faster
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-balance text-center text-4xl font-semibold tracking-tight text-zinc-100 sm:text-5xl">
          Everything you need to get a job in Ethiopia
        </p>
        <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Mobile friendly
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  View from any device, any where, any time. Our platfrom is
                  built to be responsive and accessible.
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <Image
                    className="size-full object-cover object-top"
                    src=""
                    alt=""
                  />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
          </div>
          <div className="relative max-lg:row-start-1">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Performance
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Hosted Locally in Ethiopia, our platform is built to be fast
                </p>
              </div>
              <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <img
                  className="w-full max-lg:max-w-xs"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-performance.png"
                  alt=""
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
          </div>
          <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
            <div className="absolute inset-px rounded-lg bg-white"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
              <div className="px-8 pt-8 sm:px-10 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Security
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Your data is safe with us. We use the latest security
                  protocols to keep your information secure.
                </p>
              </div>
              <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                <img
                  className="h-[min(152px,40cqw)] object-cover object-center"
                  src="https://tailwindui.com/plus/img/component-images/bento-03-security.png"
                  alt=""
                />
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
          </div>
          <div className="relative lg:row-span-2">
            <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
              <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
                <p className="mt-2 text-lg/7 font-medium tracking-tight text-gray-950 max-lg:text-center">
                  Talk to recruiters
                </p>
                <p className="mt-2 max-w-lg text-sm/6 text-gray-600 max-lg:text-center">
                  Chat with recruiters and get the latest job updates and have
                  industry insights by talking with company professionals
                </p>
              </div>
              <div className="relative min-h-[30rem] w-full grow">
                <div className="flex ring-1 ring-white/5">
                  <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400 border-2 p-2 m-2">
                    <Image src="/Message.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
          </div>
        </div>
      </div>
      <div className="pt-8">
        <Footer />
      </div>
    </div>
  );
};

export default Main;

// const Main = ({ lang }: MainProps) => {
//   return (
//     <div className="w-full overflow-hidden dark text-white">

//       <div className="w-full md:h-screen flex flex-col align-middle bg-gradient-to-b dark:from-blue-950 dark:to-blue-900 ">
//         <div className="mt-8">
//           <Section delay={0.5}>
//             <p className="text-center">
//               {lang === "en" ? "Simplified" : "ቀለል ያለ"}
//             </p>
//             <h1 className="text-center font-bold text-6xl md:text-8xl bg-gradient-to-r from-blue-900 to-blue-950 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">
//               {lang === "en"
//                 ? "Streamline Your Job Search with Us"
//                 : "የስራ ፍለጋዎን ከእኛ ጋር ያመቻቹ"}
//             </h1>
//             <p className="text-center px-8">
//               {lang === "en"
//                 ? "Our platform makes finding job listings easy. Simply enter yoursearch criteria and browse through a wide range of available potitions"
//                 : "የእኛ መድረክ የስራ ዝርዝሮችን ማግኘት ቀላል ያደርገዋል። በቀላሉ የእርስዎን ያስገቡ የፍለጋ መስፈርት እና የሚገኙ ሰፊ ክልል በኩል ያስሱ መጠቀሚያዎች"}
//             </p>
//           </Section>
//           <Section delay={0.7}>
//             <div className="hidden md:flex mt-4 p-4 justify-around">
//               <CustomCard
//                 image="/date1.webp"
//                 main={
//                   lang === "en"
//                     ? "Find The Perfect Job For You"
//                     : "ለእርስዎ ትክክለኛውን ሥራ ያግኙ"
//                 }
//                 text={
//                   lang === "en"
//                     ? "Filter your search results based on location, industry, and job type to find the the ideal match for youe skills and preferences"
//                     : "ለእርስዎ ችሎታዎች እና ምርጫዎች ተስማሚ የሆነ ተዛማጅ ለማግኘት የእርስዎን የፍለጋ ውጤቶች በአካባቢ፣ በኢንዱስትሪ እና በስራ አይነት ያጣሩ"
//                 }
//               />
//               <Spacer x={4} />
//               <CustomCard
//                 image="/dale2.webp"
//                 main={lang === "en" ? "Apply with Ease" : "በቀላሉ ማመልከት"}
//                 text={
//                   lang === "en"
//                     ? "Submit your application directly through our platform and track your progress all in one place"
//                     : "ማመልከቻዎን በቀጥታ በእኛ መድረክ በኩል ያስገቡ እና ሁሉንም ሂደትዎን በአንድ ቦታ ይከታተሉ"
//                 }
//               />
//               <Spacer x={4} />
//               <CustomCard
//                 image=""
//                 main={lang === "en" ? "Stay Organized" : "ተደራጅተው ይቆዩ"}
//                 text={
//                   lang === "en"
//                     ? "Keep track of your job applications, interviews, and offers, and recieve notification for any updates or new opportunities"
//                     : "የእርስዎን የስራ ማመልከቻዎች፣ ቃለመጠይቆች እና ቅናሾች ይከታተሉ እና ለማንኛውም ማሻሻያ ወይም አዲስ እድሎች ማሳወቂያ ይቀበሉ"
//                 }
//               />
//             </div>
//           </Section>
//         </div>
//       </div>
//       {/* <Section delay={0.5}>
//         <div className="w-full h-screen flex justify-between bg-gradient-to-b dark:from-blue-900 dark:to-blue-950 from-blue-600 to-indigo-400">
//           <div className="flex flex-col align-middle justify-center ml-24 w-1/2 p-4">
//             <IconContext.Provider
//               value={{
//                 className: "global-class-name hidden md:flex",
//                 size: "8em",
//               }}
//             >
//               <GiWaterDrop />
//             </IconContext.Provider>
//             <h1 className="text-4xl md:text-6xl font-bold py-4 text-center">
//               {
//                 (lang = "en"
//                   ? "Discover Exciting Job Opportunites Near You"
//                   : "በአጠገብዎ ያሉ አስደሳች የስራ እድሎችን ያግኙ")
//               }
//             </h1>
//             <p className="font-light py-4 text-center md:text-start">
//               {
//                 (lang = "en"
//                   ? "Find you Dream Job with our comprehensive job listings. We connect you with top employers in your area"
//                   : "ከአጠቃላይ የስራ ዝርዝሮቻችን ጋር ህልምህን አግኝ። እንገናኛለን እርስዎ በአካባቢዎ ካሉ ከፍተኛ አሠሪዎች ጋር")
//               }
//             </p>
//             <div className="flex gap-4 py-4">
//               <Button color="primary" href="#" variant="shadow">
//                 {(lang = "en" ? "Search" : "ሰርች")}
//               </Button>
//               <Button color="primary" href="#" variant="flat">
//                 {(lang = "en" ? "Learn More" : "ተጨማሪ እወቅ")}
//               </Button>
//             </div>
//           </div>
//           <div className="w-1/2 hidden md:flex justify-center items-center">
//             <Image src="dale.png" className="flex ml-24 w-1/2" alt="sd"></Image>
//           </div>
//         </div>
//       </Section> */}
//       <Footer />
//     </div>
//   );
// };

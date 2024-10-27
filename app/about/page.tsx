"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  NextUIProvider,
} from "@nextui-org/react";
import { ThemeProvider } from "next-themes";
import Main from "../components/Main";
import Progress from "../components/Progress";
import Nav from "../components/Nav";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "../components/Footer";

const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Resources", href: "#" },
  { name: "Company", href: "#" },
];
const stats = [
  { label: "New Job Listings Daily", value: "400+" },
  { label: "Employee to Employer Connection Stat", value: "96%" },
  { label: "New Users Daily", value: "220+" },
];
const values = [
  {
    name: "User-Friendly Interface",
    description:
      "We have Designed a intuitive platform for easy resume uploading and job searching.",
  },
  {
    name: "Networking Features",
    description:
      "Incorporate features that facilitate communication between job seekers and businesses.",
  },
  {
    name: "Robust Job Database",
    description:
      "Continuously update and expand the database of job postings to cover diverse industries and skill levels.",
  },
  {
    name: "Be supportive",
    description:
      "The connections you make on E-Connect can be the key to your success and can last a lifetime, so be supportive and help others, who knows where it might lead.",
  },
  {
    name: "Take responsibility",
    description:
      "Use E-Connect to take control of your career journey and make the most of the opportunities available to you, don't wait for things to happen, make them happen.",
  },
  {
    name: "Promotion and Outreach",
    description:
      "Implement marketing strategies to reach a wide audience, especially college students and the unemployed population in Ethiopia.",
  },
];
const blogPosts = [
  {
    id: 1,
    title: "How to Create a professional resume: A Step-by-Step Guide",
    href: "https://medium.com/@Econnect/how-to-create-a-professional-resume-a-step-by-step-guide-37087472ddbe",
    description:
      "A well-crafted resume is the foundation of a successful job search. It's through your resume that you make your first impression with a potential employer. And if it's a good first impression (and if you're a fit for the job), chances are good that you'll be called in for an interview.",
    imageUrl: "resume.png",
    date: "October 24, 2024",
    datetime: "2024-10-25",
    author: {
      name: "Mehretab Molla",
      imageUrl: "resume.png",
    },
  },
  // More posts...
];
const footerNavigation = {
  main: [
    { name: "About", href: "/about" },
    {
      name: "Blog",
      href: "https://medium.com/@Econnect/",
    },
    { name: "Press", href: "#" },
    { name: "Accessibility", href: "#" },
    { name: "Partners", href: "#" },
  ],
};

export default function Home() {
  const [lang, setLang] = useState<string>("en");

  return (
    <div className="w-full h-screen dark:bg-blue-900 bg-indigo-400 overflow-scroll about-bg">
      <NextUIProvider>
        <ThemeProvider attribute="class">
          {/* Language Changer */}
          <div className="fixed top-5 right-32 z-50">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" className="">
                  lang: {lang}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Single selection example"
                variant="flat"
                disallowEmptySelection
                selectionMode="single"
              >
                <DropdownItem
                  key="en"
                  onClick={() => setLang("en")}
                  color="primary"
                >
                  English
                </DropdownItem>
                <DropdownItem
                  key="am"
                  onClick={() => setLang("am")}
                  color="primary"
                >
                  Amharic
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
          <Nav lang={lang} />
          <main className="isolate mb-4">
            {/* Hero section */}
            <div className="relative isolate -z-10">
              <svg
                aria-hidden="true"
                className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
              >
                <defs>
                  <pattern
                    x="50%"
                    y={-1}
                    id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
                    width={200}
                    height={200}
                    patternUnits="userSpaceOnUse"
                  >
                    <path d="M.5 200V.5H200" fill="none" />
                  </pattern>
                </defs>
                <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
                  <path
                    d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
                    strokeWidth={0}
                  />
                </svg>
                <rect
                  fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
                  width="100%"
                  height="100%"
                  strokeWidth={0}
                />
              </svg>
              <div
                aria-hidden="true"
                className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
              >
                <div
                  style={{
                    clipPath:
                      "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
                  }}
                  className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                />
              </div>
              <div className="overflow-hidden">
                <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
                  <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
                    <div className="relative w-full lg:max-w-xl lg:shrink-0 xl:max-w-2xl">
                      <h1 className="text-pretty text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl">
                        We’re changing the way people get jobs in Ethiopia
                      </h1>
                      <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:max-w-md sm:text-xl/8 lg:max-w-none">
                        At E-Connect, we understand the unique challenges young
                        professionals and professionals of all ages, face when
                        entering the workforce. Navigating job opportunities can
                        be overwhelming, especially when the process feels
                        impersonal and exhausting. That is why we created
                        E-Connect—to empower you to take control of your career
                        journey with confidence and ease. Our platform allows
                        you to apply for jobs from anywhere, eliminating the
                        need for tedious resume drops and giving you the
                        flexibility to pursue opportunities on your terms. We
                        have dedicated ourselves to building a service that not
                        only simplifies the job search process but also supports
                        you in taking that crucial next step towards a bright
                        future. We believe that everyone deserves the chance to
                        showcase their potential, and we are here to help you
                        make meaningful connections that open doors to the
                        career you deserve.
                      </p>
                    </div>
                    <div className="mt-14 flex justify-end gap-8 sm:-mt-44 sm:justify-start sm:pl-20 lg:mt-0 lg:pl-0">
                      <div className="ml-auto w-44 flex-none space-y-8 pt-32 sm:ml-0 sm:pt-80 lg:order-last lg:pt-36 xl:order-none xl:pt-80">
                        <div className="relative">
                          <Image
                            alt=""
                            src={"/workPic1.jpg"}
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </div>
                      </div>
                      <div className="mr-auto w-44 flex-none space-y-8 sm:mr-0 sm:pt-52 lg:pt-36">
                        <div className="relative">
                          <Image
                            src={"/workPic2.webp"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </div>
                        <div className="relative">
                          <Image
                            src={"/workPic3.jpeg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </div>
                      </div>
                      <div className="w-44 flex-none space-y-8 pt-32 sm:pt-0">
                        <div className="relative">
                          <Image
                            src={"/workPic4.jpg"}
                            alt=""
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </div>
                        <div className="relative">
                          <Image
                            alt=""
                            src={"/workPic5.jpg"}
                            className="aspect-[2/3] w-full rounded-xl bg-gray-900/5 object-cover shadow-lg"
                          />
                          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-gray-900/10" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content section */}
            <div className="mx-auto -mt-12 max-w-7xl px-6 sm:mt-0 lg:px-8 xl:-mt-8">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Our mission
                </h2>
                <div className="mt-6 flex flex-col gap-x-8 gap-y-20 lg:flex-row">
                  <div className="lg:w-full lg:max-w-2xl lg:flex-auto">
                    <p className="text-xl leading-8 text-gray-600">
                      To empower individuals by providing a user-friendly online
                      portal for accessing job listings, enabling businesses to
                      find qualified candidates, fostering career growth, and
                      reducing unemployment in Ethiopia.
                    </p>
                    <p className="mt-10 max-w-xl text-base leading-7 text-gray-700"></p>
                  </div>
                  <div className="lg:flex lg:flex-auto lg:justify-center">
                    <dl className="w-64 space-y-8 xl:w-80">
                      {stats.map((stat) => (
                        <div
                          key={stat.label}
                          className="flex flex-col-reverse gap-y-4"
                        >
                          <dt className="text-base leading-7 text-gray-600">
                            {stat.label}
                          </dt>
                          <dd className="text-5xl font-semibold tracking-tight text-gray-900">
                            {stat.value}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            {/* Image section */}
            <div className="mt-32 sm:mt-40 xl:mx-auto xl:max-w-7xl xl:px-8">
              <Image
                alt=""
                src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2832&q=80"
                className="aspect-[5/2] w-full object-cover xl:rounded-3xl"
              />
            </div>

            {/* Values section */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0">
                <h2 className="text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  Our values
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  E-Connect bridges the gap between job seekers and businesses,
                  offering a comprehensive job search experience for individuals
                  while providing businesses with access to a pool of qualified
                  candidates, thus addressing unemployment challenges in
                  Ethiopia.
                </p>
              </div>
              <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {values.map((value) => (
                  <div key={value.name}>
                    <dt className="font-semibold text-gray-900">
                      {value.name}
                    </dt>
                    <dd className="mt-1 text-gray-600">{value.description}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {/* Logo cloud */}
            <div className="relative isolate -z-10 mt-32 sm:mt-48">
              <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
                <svg
                  aria-hidden="true"
                  className="h-[40rem] w-[80rem] flex-none stroke-gray-200"
                >
                  <defs>
                    <pattern
                      x="50%"
                      y="50%"
                      id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                      width={200}
                      height={200}
                      patternUnits="userSpaceOnUse"
                      patternTransform="translate(-100 0)"
                    >
                      <path d="M.5 200V.5H200" fill="none" />
                    </pattern>
                  </defs>
                  <svg
                    x="50%"
                    y="50%"
                    className="overflow-visible fill-gray-50"
                  >
                    <path
                      d="M-300 0h201v201h-201Z M300 200h201v201h-201Z"
                      strokeWidth={0}
                    />
                  </svg>
                  <rect
                    fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"
                    width="100%"
                    height="100%"
                    strokeWidth={0}
                  />
                </svg>
              </div>
            </div>

            {/* Blog section */}
            <div className="mx-auto mt-32 max-w-7xl px-6 sm:mt-40 lg:px-8">
              <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
                <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                  From the blog
                </h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Learn how to grow your business with our expert advice.
                </p>
              </div>
              <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {blogPosts.map((post) => (
                  <article
                    key={post.id}
                    className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
                  >
                    <Image
                      alt=""
                      src={post.imageUrl}
                      className="absolute inset-0 -z-10 h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                    <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                    <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                      <time dateTime={post.datetime} className="mr-8">
                        {post.date}
                      </time>
                      <div className="-ml-4 flex items-center gap-x-4">
                        <svg
                          viewBox="0 0 2 2"
                          className="-ml-0.5 h-0.5 w-0.5 flex-none fill-white/50"
                        >
                          <circle r={1} cx={1} cy={1} />
                        </svg>
                        <div className="flex gap-x-2.5">
                          <Image
                            alt=""
                            src={post.author.imageUrl}
                            className="h-6 w-6 flex-none rounded-full bg-white/10"
                          />
                          {post.author.name}
                        </div>
                      </div>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white">
                      <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </main>
          <Footer />
        </ThemeProvider>
      </NextUIProvider>
    </div>
  );
}

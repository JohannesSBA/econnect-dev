import React from "react";
import {Card, CardHeader, CardBody, CardFooter, Image, Button} from "@nextui-org/react";

export default function App() {
  return (
    <div className="p-12 flex justify-center items-middle bg-gradient-to-b dark:from-blue-950 dark:to-blue-900 from-indigo-400 to-blue-600 ">
    <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
    <Card className="col-span-12 sm:col-span-4 h-[300px]">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white uppercase font-bold pb-2">Professional Networking</p>
        <p className="text-white/60 font-light text-xs">Create profiles that serve as online resumes. Users can connect with colleagues, friends, and other professionals in their industry.</p>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src="dale.png"
      />
    </Card>
    <Card className="col-span-12 sm:col-span-4 h-[300px]">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white uppercase font-bold pb-2">Job Searching and Recruitment</p>
        <p className="text-white/60 font-light text-xs">Users can search for job listings, apply for positions, and companies can use it to find and recruit potential employees.</p>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src="/images/card-example-3.jpeg"
      />
    </Card>
    <Card className="col-span-12 sm:col-span-4 h-[300px]">
      <CardHeader className="absolute z-10 top-1 flex-col !items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Supercharged</p>
        <h4 className="text-white font-medium text-large">Creates beauty like a beast</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card background"
        className="z-0 w-full h-full object-cover"
        src="/images/card-example-2.jpeg"
      />
    </Card>
    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-5">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">New</p>
        <h4 className="text-black font-medium text-2xl">Acme camera</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Card example background"
        className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
        src="/images/card-example-6.jpeg"
      />
      <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
        <div>
          <p className="text-black text-tiny">Available soon.</p>
          <p className="text-black text-tiny">Get notified.</p>
        </div>
        <Button className="text-tiny" color="primary" radius="full" size="sm">
          Notify Me
        </Button>
      </CardFooter>
    </Card>
    <Card isFooterBlurred className="w-full h-[300px] col-span-12 sm:col-span-7">
      <CardHeader className="absolute z-10 top-1 flex-col items-start">
        <p className="text-tiny text-white/60 uppercase font-bold">Your day your way</p>
        <h4 className="text-white/90 font-medium text-xl">Your checklist for better sleep</h4>
      </CardHeader>
      <Image
        removeWrapper
        alt="Relaxing app background"
        className="z-0 w-full h-full object-cover"
        src="/images/card-example-5.jpeg"
      />
      <CardFooter className="absolute bg-black/40 bottom-0 z-10 border-t-1 border-default-600 dark:border-default-100">
        <div className="flex flex-grow gap-2 items-center">
          <Image
            alt="Breathing app icon"
            className="rounded-full w-10 h-11 bg-black"
            src="/images/breathing-app-icon.jpeg"
          />
          <div className="flex flex-col">
            <p className="text-tiny text-white/60">Breathing App</p>
            <p className="text-tiny text-white/60">Get a good sleep.</p>
          </div>
        </div>
        <Button radius="full" size="sm">Get App</Button>
      </CardFooter>
    </Card>
  </div>
  <div className="w-1/2">
        
      </div>
  </div>
  );
}


// Job Searching and Recruitment: LinkedIn is a popular platform for job seekers and recruiters. Users can search for job listings, apply
//                                 for positions, and companies can use it to find and recruit potential employees.

// Content Sharing and Learning: LinkedIn provides a platform for professionals to share articles, posts, 
//                              and updates related to their industry. It's also a place where users can follow companies and influencers for updates, news, and insights.

// Business and Professional Branding: Many businesses and professionals use LinkedIn to build and promote their brands. 
//                                    Companies can create LinkedIn Pages to showcase their products and services, while individuals can establish themselves as experts in their field.

// Networking Groups: LinkedIn has groups and communities that focus on various industries, interests, and topics. 
//                    These groups provide a space for like-minded professionals to connect, share knowledge, and discuss industry trends.

// Sales and Lead Generation: LinkedIn is also used by sales professionals to generate leads and connect with potential clients. It's a 
//                            valuable platform for B2B (business-to-business) sales and marketing efforts.
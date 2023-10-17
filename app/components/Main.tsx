import React from "react";
import {Section} from '../components/Section'
import HomePageMotion from "./HomePageMotion";
import {Image} from "@nextui-org/react";

const Main = () => {
  return(
    <div className="w-full overflow-hidden">
      <div className="w-full h-screen flex bg-gradient-to-b dark:from-blue-900 dark:to-blue-950 from-blue-600 to-indigo-400">
        <div className="w-1/2 p-12 flex flex-col gap-6 mt-12">
            {/* Section creates the animation to  the incoming object*/}
            <Section delay={0.2}>
                <h1 className="font-bold text-8xl bg-gradient-to-r from-blue-900 to-blue-950 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">Best Place to Look for Work</h1>
            </Section>
            <Section delay={0.7}>
                <p className="mt-4">Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus nemo commodi neque, consequatur cum consectetur nulla eveniet itaque deleniti repudiandae modi numquam, distinctio enim iure. Dolore numquam voluptate vel recusandae!</p>
            </Section>
            <Section delay={1.2}>
                <div className="w-56"><button className="btn btn-primary btn-outline">Click Here to Sign Up</button></div>
            </Section>
        </div>
        <div className="w-1/2 hidden md:flex overflow-visible">
                <div className="w-1/2 flex flex-col pl-24">
                    <div className="w-full">
                        <div className="ml-20"> <HomePageMotion /></div>
                        <div className="ml-64"> <HomePageMotion /></div>
                    </div>
                    <div className="w-full justify-end items-end p-12 ml-12 -translate-y-12">
                        <HomePageMotion />
                    </div>
                </div>
        </div>
      </div>
    </div>
  )
};

export default Main;


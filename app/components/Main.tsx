import React from "react";
import { Section } from "../components/Section";
import HomePageMotion from "./HomePageMotion";
import { Button, Image, Link, Spacer } from "@nextui-org/react";
import { CustomCard } from "./CustomCard";
import { GiWaterDrop } from "react-icons/gi";
import { IconContext } from "react-icons";
import Footer from "./Footer";

const Main = () => {
  return (
    <div className="w-full overflow-hidden">
      <div className="w-full h-screen flex bg-gradient-to-b dark:from-blue-900 dark:to-blue-950 from-blue-600 to-indigo-400">
        <div className="w-full md:w-1/2 p-12 flex flex-col gap-6 mt-12">
          {/* Section creates the animation to  the incoming object*/}
          <Section delay={0.2}>
            <h1 className="font-bold text-6xl md:text-8xl bg-gradient-to-r from-blue-900 to-blue-950 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">
              Find Your Dream Job With Us
            </h1>
          </Section>
          <Section delay={0.7}>
            <p className="mt-4">
              Discover a wide range of job opportunities and take the next step
              in your career.
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
                Sign Up
              </Button>
              <Button
                // as={Link}
                color="primary"
                href="#"
                variant="ghost"
              >
                Learn More
              </Button>
            </div>
          </Section>
          <Section delay={1.8}>
            <Image
              src="dale.png"
              alt="main page picture"
              className="flex md:hidden"
            />
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
      <div className="w-full h-screen flex flex-col align-middle bg-gradient-to-b dark:from-blue-950 dark:to-blue-900 from-indigo-400 to-blue-600">
        <div className="mt-8">
          <Section delay={0.5}>
            <p className="text-center">Simplified</p>
            <h1 className="text-center font-bold text-6xl md:text-8xl bg-gradient-to-r from-blue-900 to-blue-950 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">
              Streamline Your Job Search with Us
            </h1>
            <p className="text-center px-8">
              Our platform makes finding job listings easy. Simply enter your
              search criteria and browse through a wide range of available
              potitions
            </p>
          </Section>
          <Section delay={0.7}>
            <div className="hidden md:flex mt-4 p-4 justify-around">
              <CustomCard
                main={"Find The Perfect Job For You"}
                text={
                  "Filter your search results based on location, industry, and job type to find the the ideal match for youe skills and preferences"
                }
              />
              <Spacer x={4} />
              <CustomCard
                main={"Apply with Ease"}
                text={
                  "Submit your application directly through our platform and track your progress all in one place"
                }
              />
              <Spacer x={4} />
              <CustomCard
                main={"Stay Organized and Informed"}
                text={
                  "Keep track of your job applications, interviews, and offers, and recieve notification for any updates or new opportunities"
                }
              />
            </div>
          </Section>
        </div>
      </div>
      <Section delay={0.5}>
        <div className="w-full h-screen flex bg-gradient-to-b dark:from-blue-900 dark:to-blue-950 from-blue-600 to-indigo-400">
          <div className="flex flex-col align-middle justify-center ml-24 w-1/2 p-4">
            <IconContext.Provider
              value={{
                className: "global-class-name hidden md:flex",
                size: "8em",
              }}
            >
              <GiWaterDrop />
            </IconContext.Provider>
            <h1 className="text-4xl md:text-6xl font-bold py-4 text-center">
              Discover Exciting Job Opportunites Near You
            </h1>
            <p className="font-light py-4 text-center md:text-start">
              Find you Dream Job with our comprehensive job listings. We connect
              you with top employers in your area
            </p>
            <div className="flex gap-4 py-4">
              <Button color="primary" href="#" variant="shadow">
                Search
              </Button>
              <Button color="primary" href="#" variant="flat">
                Learn More
              </Button>
            </div>
          </div>
          <div className="w-1/2 hidden md:flex justify-center items-center">
            <Image src="dale.png" className="w-1/2" alt="sd"></Image>
          </div>
        </div>
      </Section>
      <Footer />
    </div>
  );
};

export default Main;

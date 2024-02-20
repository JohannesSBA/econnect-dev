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
    <div className="w-full overflow-hidden">
      <div className="w-full h-screen flex bg-gradient-to-b dark:from-blue-900 dark:to-blue-950 from-blue-600 to-indigo-400">
        <div className="w-full md:w-1/2 p-12 flex flex-col gap-6 mt-12">
          {/* Section creates the animation to  the incoming object*/}
          <Section delay={0.2}>
            <h1 className="font-bold text-6xl md:text-8xl bg-gradient-to-r from-blue-900 to-blue-950 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">
              {lang === "en"
                ? "Find Your Dream Job With Us"
                : "የህልም ስራዎን ከእኛ ጋር ያግኙ"}
            </h1>
          </Section>
          <Section delay={0.7}>
            <p className="mt-4">
              {lang === "en"
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
                // as={Link}
                color="primary"
                href="#"
                variant="ghost"
              >
                {lang === "en" ? "Learn More" : "ተጨማሪ ለመረዳት"}
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
            <p className="text-center">
              {lang === "en" ? "Simplified" : "ቀለል ያለ"}
            </p>
            <h1 className="text-center font-bold text-6xl md:text-8xl bg-gradient-to-r from-blue-900 to-blue-950 dark:from-blue-600 dark:to-indigo-400 text-transparent bg-clip-text mb-3">
              {lang === "en"
                ? "Streamline Your Job Search with Us"
                : "የስራ ፍለጋዎን ከእኛ ጋር ያመቻቹ"}
            </h1>
            <p className="text-center px-8">
              {lang === "en"
                ? "Our platform makes finding job listings easy. Simply enter yoursearch criteria and browse through a wide range of available potitions"
                : "የእኛ መድረክ የስራ ዝርዝሮችን ማግኘት ቀላል ያደርገዋል። በቀላሉ የእርስዎን ያስገቡ የፍለጋ መስፈርት እና የሚገኙ ሰፊ ክልል በኩል ያስሱ መጠቀሚያዎች"}
            </p>
          </Section>
          <Section delay={0.7}>
            <div className="hidden md:flex mt-4 p-4 justify-around">
              <CustomCard
                main={
                  (lang = "en"
                    ? "Find The Perfect Job For You"
                    : "ለእርስዎ ትክክለኛውን ሥራ ያግኙ")
                }
                text={
                  (lang = "en"
                    ? "Filter your search results based on location, industry, and job type to find the the ideal match for youe skills and preferences"
                    : "ለእርስዎ ችሎታዎች እና ምርጫዎች ተስማሚ የሆነ ተዛማጅ ለማግኘት የእርስዎን የፍለጋ ውጤቶች በአካባቢ፣ በኢንዱስትሪ እና በስራ አይነት ያጣሩ")
                }
              />
              <Spacer x={4} />
              <CustomCard
                main={(lang = "en" ? "Apply with Ease" : "በቀላሉ ማመልከት")}
                text={
                  (lang = "en"
                    ? "Submit your application directly through our platform and track your progress all in one place"
                    : "ማመልከቻዎን በቀጥታ በእኛ መድረክ በኩል ያስገቡ እና ሁሉንም ሂደትዎን በአንድ ቦታ ይከታተሉ")
                }
              />
              <Spacer x={4} />
              <CustomCard
                main={(lang = "en" ? "Stay Organized" : "ተደራጅተው ይቆዩ")}
                text={
                  (lang = "en"
                    ? "Keep track of your job applications, interviews, and offers, and recieve notification for any updates or new opportunities"
                    : "የእርስዎን የስራ ማመልከቻዎች፣ ቃለመጠይቆች እና ቅናሾች ይከታተሉ እና ለማንኛውም ማሻሻያ ወይም አዲስ እድሎች ማሳወቂያ ይቀበሉ")
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
              {lang === "en"
                ? "Discover Exciting Job Opportunites Near You"
                : "በአጠገብዎ ያሉ አስደሳች የስራ እድሎችን ያግኙ"}
            </h1>
            <p className="font-light py-4 text-center md:text-start">
              {lang === "en"
                ? "Find you Dream Job with our comprehensive job listings. We connect you with top employers in your area"
                : "ከአጠቃላይ የስራ ዝርዝሮቻችን ጋር ህልምህን አግኝ። እንገናኛለን እርስዎ በአካባቢዎ ካሉ ከፍተኛ አሠሪዎች ጋር"}
            </p>
            <div className="flex gap-4 py-4">
              <Button color="primary" href="#" variant="shadow">
                {lang === "en" ? "Search" : "ሰርች"}
              </Button>
              <Button color="primary" href="#" variant="flat">
                {lang === "en" ? "Learn More" : "ተጨማሪ እወቅ"}
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

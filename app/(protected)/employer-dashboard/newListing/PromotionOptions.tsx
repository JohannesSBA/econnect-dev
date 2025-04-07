import React from "react";
import { Checkbox } from "@nextui-org/react";
import { FaCheck } from "react-icons/fa";

interface PromotionOptionsProps {
  promotion: string;
  setPromotion: (promotion: string) => void;
}

const PromotionOptions: React.FC<PromotionOptionsProps> = ({ promotion, setPromotion }) => {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold leading-7 text-gray-900">Promotion</h2>
      <p className="mt-1 text-sm leading-6 text-gray-600">Promote your job listing to get more views and potential applicants for your listing</p>
      <div className="flex rounded-md p-2 m-2 gap-4">
        <div className="flex flex-col">
          <div className="flex">
            <Checkbox isSelected={promotion === "Free"} onChange={() => setPromotion("Free")} />
            <h1>Free</h1>
          </div>
          <ul>
            <li className="flex text-center items-center gap-2 pt-3">
              <FaCheck className="text-green-500" />
              <p>Shows up in search Results</p>
            </li>
          </ul>
        </div>
        <div className="inline-block h-[250px] min-h-[1em] w-0.5 self-stretch bg-white/10"></div>
        <div className="flex flex-col">
          <div className="flex">
            <Checkbox isSelected={promotion === "Promoted"} onChange={() => setPromotion("Promoted")} />
            <h1>Promoted</h1>
          </div>
          <ul>
            <p className="font-extralight text-xs">Currently Free</p>
            <li className="flex text-center items-center gap-2">
              <FaCheck className="text-green-500" />
              <p>Shows up in search Results</p>
            </li>
            <li className="flex text-center items-center gap-2 pt-3">
              <FaCheck className="text-green-500" />
              <p>Get notified when a candidate applies</p>
            </li>
            <li className="flex text-center items-center gap-2 pt-3">
              <FaCheck className="text-green-500" />
              <p>Get more qualified applicants, with no applicant limit. Top placement in search and job recommendations</p>
            </li>
            <li className="flex text-center items-center gap-2 pt-3">
              <FaCheck className="text-green-500" />
              <p>Send instant mobile alerts to qualified candidates in your location</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PromotionOptions; 
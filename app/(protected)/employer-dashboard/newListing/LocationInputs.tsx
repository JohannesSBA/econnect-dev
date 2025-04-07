import React from "react";

interface LocationInputsProps {
  city: string;
  setCity: (city: string) => void;
  country: string;
  setCountry: (country: string) => void;
  stateP: string;
  setStateP: (stateP: string) => void;
}

const LocationInputs: React.FC<LocationInputsProps> = ({ city, setCity, country, setCountry, stateP, setStateP }) => {
  return (
    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <div className="sm:col-span-2">
        <label htmlFor="city" className="block text-sm font-medium leading-6 text-gray-900">City</label>
        <div className="mt-2">
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">Country</label>
        <div className="mt-2">
          <input
            id="country"
            name="country"
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="state" className="block text-sm font-medium leading-6 text-gray-900">State / Province</label>
        <div className="mt-2">
          <input
            id="state"
            name="state"
            type="text"
            value={stateP}
            onChange={(e) => setStateP(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>
      </div>
    </div>
  );
};

export default LocationInputs; 
import React from 'react';
import { AlbumRail } from './AlbumRail';

export const WhoAmIWithoutYouSection: React.FC = () => {
  return (
    <div className="w-full max-w-[1216px] mx-auto flex flex-col">
      {/* WHO AM I WITHOUT YOU? Section Heading in Jersey 10 font */}
      <div className="w-full mt-12 sm:mt-16 md:mt-20">
        <h2 className="font-jersey text-white text-[64px] font-normal leading-none tracking-[2px] sm:tracking-[4px] uppercase select-none">
          WHO AM I WITHOUT YOU?
        </h2>
      </div>

      {/* Album Rail Effect: A fan of album sleeves */}
      <div className="w-full mt-6 sm:mt-8">
        <AlbumRail
          vinyl={false}
          vinylColor={"#b71c1c"}
          accentColor={"#cc1a1a"}
          loop={false}
          draggable={true}
          captions={false}
          backgroundColor={"transparent"}
        />
      </div>
    </div>
  );
};

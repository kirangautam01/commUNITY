import React from "react";
import { Link } from "react-router-dom";

const Event = () => {
  return (
    <div className="m-10">
      <div className="flex flex-col justify-center relative z-10 mt-10 sm:30">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold text-gray-900 mb-0 leading-tight">
          Welcome to
          <span className="text-primaryBlue font-bold">Purwanchal Academy</span>
          :
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl mt-6 font-bold text-gray-900 leading-snug pb-3">
          Shaping Young Minds with Care and Excellence.
        </h2>

        <p className="text-md sm:text-base md:text-md text-gray-700 leading-relaxed text-justify">
          Welcome to Purwanchal Academy, where young minds embark on their
          educational journey through playgroup, nursery, and kindergarten
          programs. From foundational stages to grade 10, we cultivate a
          nurturing environment for students to grow, learn, and explore. Our
          dedicated teachers and state-of-the-art facilities ensure every child
          receives personalized care and attention to excel in their studies.
        </p>

        {/* targeted portion */}
        <div className="relative flex flex-col items-center justify-center mt-5 *:m-0 *:p-0">
          <div className="flex flex-row">
            <Link to="programs">
              <button className="rounded-2xl bg-primaryBlue py-1 px-2">
                Explore
              </button>
            </Link>
            <img src="/images/hat3.png" alt="Hat Image" className="size-30 opacity-70" />
          </div>
          <img
            src="/images/school.jpeg"
            alt="Academy Image"
            className="w-3/4 bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Event;

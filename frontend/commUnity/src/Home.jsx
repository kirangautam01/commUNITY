import React from "react";

function Home() {
  return (
    <div className="flex flex-col md:flex-row items-center overflow-hidden *:w-1/2">
      <div className="box-border p-5">
        <h1 className="text-3xl font-extrabold">commUNITY</h1>
        <p className="text-justify">
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Similique
          sunt vel et fuga quos iusto, ab tempora nobis quia obcaecati veritatis
          vitae a praesentium explicabo eos porro quidem veniam. Consectetur.
        </p>
      </div>
      <img src="/images/logo1.png" alt="commUNITY_logo" className="object-cover order-first md:order-last" />
    </div>
  );
}

export default Home;

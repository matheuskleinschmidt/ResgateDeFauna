"use client";

import React from "react";

import { Spinner } from "@nextui-org/react";

const Loader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Spinner size="lg" />
    </div>
  );
};

export default Loader;

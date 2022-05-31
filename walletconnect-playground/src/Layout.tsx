import type { ReactNode } from "react";
import imgBeams from "./imgs/beams.jpg";

export default function Layout({
  Header,
  Body,
  Footer,
}: {
  Header: ReactNode;
  Body: ReactNode;
  Footer: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
      <img
        src={imgBeams}
        alt=""
        className="absolute top-1/2 left-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        width="1308"
      />
      <div
        className={`absolute inset-0 bg-[url(/public/imgs/grid.svg)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]`}
      ></div>
      <div
        className="relative  px-6 pt-10 pb-8 shadow-xl ring-2 ring-gray-900/5 
        bg-white/30
        backdrop-blur-sm
      sm:mx-auto 
      sm:max-w-lg 
      sm:rounded-lg 
      sm:px-10 
      lg:min-w-max"
      >
        <div className="mx-auto max-w-md">
          <div className="divide-y divide-gray-300/50">
            <header className="pt-8 text-base font-semibold leading-7">
              {Header}
            </header>
            <main className="space-y-6 py-8 text-base leading-7 text-gray-600">
              {Body}
            </main>
            <footer className="pt-8 text-base font-semibold leading-7">
              {Footer}
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}

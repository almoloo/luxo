"use client";
import { Player, Controls } from "@lottiefiles/react-lottie-player";

export default function Home() {
  return (
    <div className="flex flex-col md:grid grid-cols-12 grid-rows-1 m-auto gap-7 items-center">
      <div className="col-start-3 col-end-6 bg-indigo-300 rounded-lg overflow-hidden">
        <Player src="/animation.json" loop autoplay />
      </div>
      <div className="col-start-6 col-end-10">
        <h2 className="font-bold text-3xl text-slate-800">Welcome to Luxo</h2>
        <p className="text-slate-700 leading-relaxed text-sm mt-3">
          Luxo is a decentralized profile viewer on the L2.
          <br />
          It allows you to edit and showcase your Lukso Universal Profile. You
          can also share it with others.
        </p>
        <p className="text-slate-700 leading-relaxed text-sm mt-3">
          Feel free to add your Luxo URL to your social media bios.
        </p>
      </div>
    </div>
  );
}

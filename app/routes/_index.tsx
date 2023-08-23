import { useState } from "react";
import type { V2_MetaFunction } from "@remix-run/node";
import { TestComponent } from "~/components/test.tsx";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-blue-3 color-black">
      <button
        className="min-w-40px rounded p1"
        onClick={() => setCount((c) => c + 1)}
      >
        {count.toString(10)}
      </button>
      <div>ba</div>
      <TestComponent />
    </div>
  );
}

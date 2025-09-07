import { Navbar } from "./components/Navbar";
import { Redirect } from "./components/Redirect";

export default function Home() {
  return (
    <div>
      <Navbar />
      <Redirect />
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to Progresso
          </h1>
          <p className="text-xl font-medium text-gray-600 max-w-md">
            Collaborate. Organize. Crush Deadlines
          </p>
        </div>
      </div>
    </div>
  );
}
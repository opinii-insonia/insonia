import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to InsônIA</h1>
        <p className="text-xl text-gray-600">
          Sua plataforma inteligente de avaliação de sono.
        </p>
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Index;
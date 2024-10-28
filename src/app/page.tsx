import { CurriculumForm } from "@/components/curriculum-form";
import { ToggleTheme } from "@/components/toggle-theme";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 items-center h-screen justify-center">
      <ToggleTheme />

      <CurriculumForm />
    </main>
  );
}

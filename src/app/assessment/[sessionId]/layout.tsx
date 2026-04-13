import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strengths Assessment | I-Goal",
  description: "Discover your unique strengths profile",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      {children}
    </div>
  );
}

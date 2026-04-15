import React, { useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { DocsLayout } from "@/components/docs/DocsLayout";
import { 
  IntroSection, 
  FormulaSection, 
  LogisticsSection, 
  ReportingSection 
} from "@/components/docs/DocSections";

export default function DocsPage() {
  const { sectionId } = useParams();

  // Scroll to top on section change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [sectionId]);

  const renderContent = () => {
    switch (sectionId) {
      case undefined:
      case "introduction":
      case "philosophy":
        return <IntroSection />;
      case "formulas":
      case "material-mass":
      case "embodied-carbon":
        return <FormulaSection />;
      case "machine-impact":
      case "transport":
      case "processing":
        return <LogisticsSection />;
      case "projections":
      case "recycling":
      case "data-quality":
      case "master-formula":
        return <ReportingSection />;
      default:
        return <Navigate to="/docs" replace />;
    }
  };

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto">
        {renderContent()}
      </div>
    </DocsLayout>
  );
}

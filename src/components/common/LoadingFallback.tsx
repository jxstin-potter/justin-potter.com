import React from "react";
import PageSkeleton from "./PageSkeleton";

const LoadingFallback: React.FC = () => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        padding: "var(--spacing-lg)",
      }}
      aria-label="Loading content"
      role="status"
    >
      <PageSkeleton />
    </div>
  );
};

export default LoadingFallback;

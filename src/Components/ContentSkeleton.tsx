import React from "react";
import Skeleton from "react-loading-skeleton";

export const ContentSkeleton = () => {
  return (
    <div>
      <Skeleton width={256} height={160} style={{ marginBottom: "10px" }} />
      <Skeleton width={256} height={20} style={{ marginBottom: "5px" }} />
      <Skeleton width={256} height={15} />
    </div>
  );
};

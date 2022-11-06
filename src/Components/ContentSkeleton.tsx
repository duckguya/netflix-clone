import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

const SkeletonWrapper = styled.div<{ typeName?: string }>`
  margin-top: ${(props) => (props.typeName === "search" ? "0" : "650px")};
`;

const BodySkeleton = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  .skeleton_box {
    width: 256px;
    height: 160px;
    margin-bottom: 64px;
    @media screen and (max-width: 1200px) {
      width: 13rem;
      height: 8rem;
    }
  }
`;

interface IProps {
  type?: string;
}

export const ContentSkeleton = ({ type }: IProps) => {
  return (
    <SkeletonWrapper typeName={type}>
      <Skeleton width={100} height={15} style={{ marginBottom: "10px" }} />
      <BodySkeleton>
        {[...new Array(15)].map((_, index) => (
          <Skeleton
            className="skeleton_box"
            key={index}
            // width={256}
            // height={160}
            // style={{ marginBottom: "10px" }}
          />
        ))}
      </BodySkeleton>
      {/* <Skeleton width={256} height={20} style={{ marginBottom: "5px" }} /> */}
    </SkeletonWrapper>
  );
};

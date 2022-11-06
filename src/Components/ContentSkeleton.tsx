import React from "react";
import Skeleton from "react-loading-skeleton";
import styled from "styled-components";

const Wrapper = styled.div`
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

export const ContentSkeleton = () => {
  return (
    <div>
      <Skeleton width={100} height={15} style={{ marginBottom: "10px" }} />
      <Wrapper>
        {[...new Array(15)].map((_, index) => (
          <Skeleton
            className="skeleton_box"
            key={index}
            // width={256}
            // height={160}
            // style={{ marginBottom: "10px" }}
          />
        ))}
      </Wrapper>
      {/* <Skeleton width={256} height={20} style={{ marginBottom: "5px" }} /> */}
    </div>
  );
};

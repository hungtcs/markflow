import React, { PropsWithChildren } from "react";

export default function Hello(props: PropsWithChildren<{ name: string }>) {
  return (
    <p>Hello { props.name }!</p>
  );
}

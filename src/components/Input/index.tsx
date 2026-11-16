import React from "react";
import styles from "./styles.module.css";

type InputProps = {
  id: string;
  labelText?: string;
} & React.ComponentProps<"input">;

export function Input({ id, type, labelText, ...rest }: InputProps) {
  return (
    <React.Fragment>
      {Boolean(labelText) && <label htmlFor={id}>{labelText}</label>}
      <input id={id} type={type} className={styles.input} {...rest} />
    </React.Fragment>
  );
}

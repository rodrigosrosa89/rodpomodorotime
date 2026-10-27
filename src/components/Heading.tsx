import styles from "./Heading.module.css";

export function Heading() {
  console.log("estilos: ", styles);
  return (
    <>
      <h1 className={styles.heading}>Olá mundooooo</h1>
    </>
  );
}

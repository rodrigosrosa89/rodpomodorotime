import { Container } from "./components/Container";
import { CountDown } from "./components/CountDown";
import { Input } from "./components/Input";
import { Logo } from "./components/Logo";
import { Menu } from "./components/Menu";
import "./styles/global.css";
import "./styles/theme.css";
import React from "react";
import { FormCadastro } from "./Cadastro/components/FormCadastro.component";
import { FormHeaderCadastro } from "./Cadastro/components/FormHeaderCadastro.component";

export function App() {
  const cadastroOk = false;

  if (!cadastroOk) {
    return (
      <React.Fragment>
        <div className="form">
          <FormHeaderCadastro />
          <FormCadastro />
        </div>
      </React.Fragment>
    );
  }

  if (cadastroOk) {
    return (
      <>
        <Container>
          <Logo />
        </Container>

        <Container>
          <Menu />
        </Container>

        <Container>
          <CountDown />
        </Container>

        <Container>
          <form className="form">
            <div className="formRow">
              <Input id="meuInput" type="text" />
            </div>

            <div className="formRow">
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </div>

            <div className="formRow">
              <p>Ciclos.</p>
              <p>0 0 0 0 0 </p>
            </div>

            <div className="formRow">
              <button>Enviar</button>
            </div>
          </form>
        </Container>
      </>
    );
  }
}

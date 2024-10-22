import React from "react";
import { Card, CardBody, Link } from "@nextui-org/react";

export default function App() {
  return (
    <div className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md">
      <Card  className="w-full max-w-xs mb-4">
        <CardBody>
        <Link href="/pages/rescue/addRescue"><p>Adicionar resgate</p></Link>
        </CardBody>
      </Card>
      <Card  className="w-full max-w-xs mb-4">
        <CardBody>
        <Link href="/pages/rescue"><p>Listar resgates</p></Link>
        </CardBody>
      </Card>
      <Card  className="w-full max-w-xs mb-4">
        <CardBody>
        <Link href="/pages/reports"><p>Relatórios</p></Link>
        </CardBody>
      </Card>
      <Card  className="w-full max-w-xs mb-4">
        <CardBody>
        <Link href="/pages/configurations"><p>Configurações</p></Link>
        </CardBody>
      </Card>
    </div>
    );
}

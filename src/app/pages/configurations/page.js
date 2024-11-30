'use client';
import React from "react";
import { Card, CardBody, Link } from "@nextui-org/react";
import { useSession } from 'next-auth/react';

export default function ConfigurationsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <div className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md">
        <Card className="w-full max-w-xs mb-4">
          <CardBody>
            <Link href="/pages/configurations/species">
              <p>Species</p>
            </Link>
          </CardBody>
        </Card>
        <Card className="w-full max-w-xs mb-4">
          <CardBody>
            <Link href="/pages/configurations/animalgroups">
              <p>Grupo de Animais</p>
            </Link>
          </CardBody>
        </Card>
        {session?.user?.role === 'admin' && (
          <Card className="w-full max-w-xs mb-4">
            <CardBody>
              <Link href="/pages/configurations/users">
                <p>Usuários</p>
              </Link>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { Card, CardBody, Link } from "@nextui-org/react";

export default function configurationsPage() {
  return (
    <div>
      <div className="flex flex-col items-center justify-center max-w-full px-4 mx-auto sm:max-w-md">
        <Card className="w-full max-w-xs mb-4">
          <CardBody>
            <Link href="/pages/configurations/species">
              <p>teste</p>
            </Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

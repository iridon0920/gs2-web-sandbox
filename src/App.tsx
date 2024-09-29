import React, { useEffect, useState } from "react";
import "./App.css";
import axios, { AxiosRequestConfig } from "axios";
import { Gs2AccountRestClient } from "gs2/account";
import { DescribeNamespacesRequest } from "gs2/account/request";
import { Gs2RestSession, ProjectTokenGs2Credential } from "gs2/core/model";

function App() {
  const [namespaces, setNamespaces] = useState<(string | null)[]>([]);

  useEffect(() => {
    const initClient = async () => {
      const clientId = process.env.REACT_APP_GS2_CLIENT_ID as string;
      const region = "ap-northeast-1";

      const config: AxiosRequestConfig = {
        url: process.env.REACT_APP_GET_GS2_TOKEN_URL,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        data: { clientId, region },
      };
      const result = await axios.request(config);
      const session = new Gs2RestSession(
        new ProjectTokenGs2Credential(clientId, result.data.projectToken),
        region,
      );
      await session.connect();

      const gs2Account = new Gs2AccountRestClient(session);
      const namespacesResult = await gs2Account.describeNamespaces(
        new DescribeNamespacesRequest().withLimit(10),
      );

      const fetchedNamespaces = namespacesResult.getItems();
      if (fetchedNamespaces) {
        setNamespaces(
          fetchedNamespaces.map((namespace) => namespace.getName()),
        );
      }
    };
    initClient().catch((err) => console.log(err));
  }, []);

  return (
    <div>
      <h1>Namespaces</h1>
      <ul>
        {namespaces.map((namespace, index) => (
          <li key={index}>{namespace}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;

import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebar: SidebarsConfig = {
  apisidebar: [
    {
      type: "doc",
      id: "api/example-api-v-1",
    },
    {
      type: "category",
      label: "UNTAGGED",
      items: [
        {
          type: "doc",
          id: "api/check-api-health-status",
          label: "Check API Health Status",
          className: "api-method get",
        },
      ],
    },
  ],
};

export default sidebar.apisidebar;

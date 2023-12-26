/* eslint-disable @typescript-eslint/ban-types */

import { AllVariantsType, Button } from "@/components/ui/button";
import { Config } from "@measured/puck";
import { ReactNode } from "react";
import { Flex, FlexProps } from "./blocks/Flex";
import { Columns, ColumnsProps } from "./blocks/Columns";

type RootProps = {};

export const LOCAL_STORAGE_DATA_KEY = "_page_data";

type Components = {
  ContentBlock: {
    title: string;
    description: string;
  };
  Button: {
    text: string;
    variant: AllVariantsType;
  };
  Flex: FlexProps;
  Columns: ColumnsProps;
};

// Create Puck component config
export const config: Config<Components, RootProps, "content" | "layout"> = {
  root: {
    render: ({ children }: { children: ReactNode }) => {
      return <div className="my-6 mx-3 grid gap-4">{children}</div>;
    },
  },
  categories: {
    content: {
      components: ["ContentBlock", "Button"],
    },
    layout: {
      components: ["Columns", "Flex"],
    },
  },
  components: {
    ContentBlock: {
      fields: {
        title: { type: "text" },
        description: {
          type: "textarea",
        },
      },
      defaultProps: {
        title: "<title here>",
        description: "<description here>",
      },
      render: ({
        title,
        description,
      }: {
        title: string;
        description: string;
      }) => {
        return (
          <div>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              {title}
            </h1>
            <p className="leading-7 [&:not(:first-child)]:mt-6">
              {description}
            </p>
          </div>
        );
      },
    },
    Button: {
      fields: {
        text: {
          type: "text",
        },
        variant: {
          type: "select",
          options: [
            { label: "default", value: "default" },
            { label: "destructive", value: "destructive" },
            { label: "outline", value: "outline" },
            { label: "secondary", value: "secondary" },
            { label: "ghost", value: "ghost" },
            { label: "link", value: "link" },
          ],
        },
      },
      defaultProps: {
        text: "<content here>",
        variant: "default",
      },
      render: ({
        text,
        variant,
      }: {
        text: string;
        variant: AllVariantsType;
      }) => {
        return <Button variant={variant}>{text}</Button>;
      },
    },

    Flex,
    Columns,
  },
};

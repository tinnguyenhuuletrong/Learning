import { cn } from "@/lib/utils";
import { ComponentConfig, DropZone } from "@measured/puck";
import { ClassNameValue } from "tailwind-merge";

export type FlexProps = {
  items: { minItemWidth?: number }[];
  minItemWidth: number;
  justify: "center" | "begin" | "end";
  direction: "row" | "column";
};

export const Flex: ComponentConfig<FlexProps> = {
  fields: {
    items: {
      type: "array",
      arrayFields: {
        minItemWidth: {
          label: "Minimum Item Width",
          type: "number",
        },
      },
      getItemSummary: (_, id) => `Item ${String(id) + 1}`,
    },
    minItemWidth: {
      label: "Minimum Item Width",
      type: "number",
    },
    direction: {
      label: "Direction",
      type: "radio",
      options: [
        {
          label: "row",
          value: "row",
        },
        {
          label: "column",
          value: "column",
        },
      ],
    },
    justify: {
      label: "Align item",
      type: "radio",
      options: [
        {
          label: "begin",
          value: "begin",
        },
        {
          label: "center",
          value: "center",
        },
        {
          label: "end",
          value: "end",
        },
      ],
    },
  },
  defaultProps: {
    items: [{}, {}],
    minItemWidth: 356,
    justify: "center",
    direction: "row",
  },
  render: function ({
    items,
    minItemWidth,
    justify,
    direction,
  }: FlexProps): JSX.Element {
    const justifyClass = computeJustify(justify);
    const directionClass = computeDirection(direction);

    return (
      <div className={cn("flex gap-2 flex-wrap", justifyClass, directionClass)}>
        {items.map((item, idx) => (
          <div
            key={idx}
            className="grid"
            style={{ minWidth: item.minItemWidth || minItemWidth }}
          >
            <DropZone zone={`item-${idx}`} />
          </div>
        ))}
      </div>
    );
  },
};

function computeJustify(justify: FlexProps["justify"]): ClassNameValue {
  switch (justify) {
    case "center":
      return "justify-center";

    case "begin":
      return "justify-begin";

    case "end":
      return "justify-end";

    default:
      return "";
  }
}
function computeDirection(direction: FlexProps["direction"]): ClassNameValue {
  switch (direction) {
    case "row":
      return "flex-row";

    case "column":
      return "flex-col";

    default:
      return "";
  }
}

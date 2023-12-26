import { ComponentConfig, DropZone } from "@measured/puck";

export type ColumnsProps = {
  distribution: "auto" | "manual";
  columns: {
    span?: number;
  }[];
};

export const Columns: ComponentConfig<ColumnsProps> = {
  fields: {
    distribution: {
      type: "radio",
      options: [
        {
          value: "auto",
          label: "Auto",
        },
        {
          value: "manual",
          label: "Manual",
        },
      ],
    },
    columns: {
      type: "array",
      getItemSummary: (col, id) =>
        `Column ${(id ?? 0) + 1}, span ${
          col.span ? Math.max(Math.min(col.span, 12), 1) : "auto"
        }`,
      arrayFields: {
        span: {
          label: "Span (1-12)",
          type: "number",
        },
      },
    },
  },
  defaultProps: {
    distribution: "auto",
    columns: [{}, {}],
  },
  render: ({ columns, distribution }) => {
    return (
      <div
        className="flex flex-col md:grid gap-4"
        style={{
          gridTemplateColumns:
            distribution === "manual"
              ? "repeat(12, 1fr)"
              : `repeat(${columns.length}, 1fr)`,
        }}
      >
        {columns.map(({ span }, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              gridColumn:
                span && distribution === "manual"
                  ? `span ${Math.max(Math.min(span, 12), 1)}`
                  : "",
            }}
          >
            <DropZone zone={`column-${idx}`} />
          </div>
        ))}
      </div>
    );
  },
};

import { Render } from "@measured/puck";
import { LOCAL_STORAGE_DATA_KEY, config } from "../configs/puckConfig";
import { useWithTitle } from "@/hooks/useWithTitle";

export function PagePuckViewer() {
  useWithTitle("WYSIWYG Puck Play | Viewer");
  const data = window.localStorage.getItem(LOCAL_STORAGE_DATA_KEY);
  if (!data)
    return (
      <>
        <h1>Empty data !</h1>
      </>
    );
  const renderData = JSON.parse(data);

  return <Render config={config} data={renderData} />;
}

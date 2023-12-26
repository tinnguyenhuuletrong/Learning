import { Data, Puck } from "@measured/puck";
import "@measured/puck/puck.css";
import { LOCAL_STORAGE_DATA_KEY, config } from "../configs/puckConfig";
import { useWithTitle } from "@/hooks/useWithTitle";

// Describe the initial data
const initialData = {
  content: [],
  root: {},
};

// Save the data to your database
const save = (data: Data) => {
  console.log(data);
  window.localStorage.setItem(LOCAL_STORAGE_DATA_KEY, JSON.stringify(data));
};

// Render Puck editor
export function PagePuckEditor() {
  useWithTitle("WYSIWYG Puck Play | Editor");
  return <Puck config={config} data={initialData} onPublish={save} />;
}

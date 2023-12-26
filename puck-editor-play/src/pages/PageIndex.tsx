import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useWithTitle } from "@/hooks/useWithTitle";

export default function PageIndex() {
  useWithTitle("WYSIWYG Puck Play");
  return (
    <div className="flex justify-center items-center gap-2 mt-5 ">
      <Button variant="link" asChild>
        <Link to="/editor">Editor</Link>
      </Button>

      <Button variant="link" asChild>
        <Link to="/view">View</Link>
      </Button>
    </div>
  );
}

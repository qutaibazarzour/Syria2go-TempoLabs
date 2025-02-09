import { X } from "lucide-react";
import { Button } from "./button";
import { DialogClose } from "./dialog";

export function DialogCloseButton() {
  return (
    <DialogClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-gray-100 rounded-full absolute right-4 top-4"
      >
        <X className="h-5 w-5" />
      </Button>
    </DialogClose>
  );
}

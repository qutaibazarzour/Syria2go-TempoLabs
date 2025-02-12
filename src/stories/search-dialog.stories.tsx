import SearchDialog from "../components/SearchDialog";
import { Button } from "../components/ui/button";

const meta = {
  title: "Components/SearchDialog",
  component: SearchDialog,
  parameters: {
    layout: "centered",
  },
};

export default meta;

export const Default = () => {
  return <SearchDialog isOpen={true} onClose={() => {}} onSearch={() => {}} />;
};

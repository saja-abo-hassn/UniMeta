
import figma from "figma";

const instance = figma.selectedInstance;

const label = instance.getString("Label");
const variant = instance.getEnum("Variant", {
  Primary: "primary",
  Secondary: "secondary",
  Outline: "outline",
  Ghost: "ghost",
  Danger: "danger",
});

const size = instance.getEnum("Size", {
  Small: "sm",
  Medium: "md",
  Large: "lg",
});

const disabled = instance.getBoolean("Disabled");
const isLoading = instance.getBoolean("Loading");
const fullWidth = instance.getBoolean("Full Width");

const buttonCodeConnect = {
  example: figma.code`
    <Button
      variant="${variant}"
      size="${size}"
      ${disabled ? "disabled" : ""}
      ${isLoading ? "isLoading" : ""}
      ${fullWidth ? "fullWidth" : ""}
    >
      ${label}
    </Button>
  `,
  imports: ['import { Button } from "@/components/shared"'],
  id: "button",
  metadata: {
    nestable: true,
  },
};

export default buttonCodeConnect;


import * as React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    ref={ref}
    {...props}
    className={cn(
      "bg-[#302F2F] peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors",
      className,
    )}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        "group pointer-events-none flex items-center justify-center h-4 w-4 rounded-full shadow-lg ring-0 transition-transform",
        "data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        "data-[state=unchecked]:bg-[#27b1ff] data-[state=checked]:bg-[#FFDE39]",
      )}
    >
      <p className="font-oswald hidden group-data-[state=unchecked]:block text-[10px]">
        I
      </p>
      <p className="font-oswald hidden group-data-[state=checked]:block text-[10px]">
        M
      </p>
    </SwitchPrimitives.Thumb>
  </SwitchPrimitives.Root>
));

Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };

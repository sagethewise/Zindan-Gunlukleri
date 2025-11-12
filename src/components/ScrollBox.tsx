import React from "react";
import clsx from "clsx";

export default function ScrollBox({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <div className={clsx("rounded-xl border border-gray-200 bg-white shadow-sm", className)}>
      {title ? <div className="px-4 pt-4 pb-2 text-sm font-semibold">{title}</div> : null}
      <div className="px-4 pb-4">
        {/* tek scroll kaynağı */}
        <div className="overflow-y-auto overscroll-contain max-h-[65vh] lg:max-h-[66vh] xl:max-h-[68vh]">
          {children}
        </div>
      </div>
    </div>
  );
}

import { PropsWithChildren } from "react";

export const GlassBar = (props: PropsWithChildren) => {
	return (
		<div className="z-20 flex w-full flex-row gap-4 bg-base-100/30 p-4 backdrop-blur-sm">
			{props.children}
		</div>
	);
};

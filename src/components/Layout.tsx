import { type PropsWithChildren } from "react";
import Menu from "./Menu";
import Sidebar from "./Sidebar";
import { Card } from "./ui/card";

export const PageLayout = (props: PropsWithChildren) => {
	return (
		<>
			<div className="hidden sm:flex sticky top-0 h-fit">
				<Menu />
			</div>
			<div className="min-h-full min-w-0 max-w-2xl grow sm:shrink lg:max-w-2xl">
				<Card className="z-100 flex sm:hidden h-fit w-full sticky top-0">
					<Menu />
				</Card>
				{props.children}
			</div>
			<Sidebar />
		</>
	);
};

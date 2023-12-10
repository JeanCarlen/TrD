import React, { useEffect, useState, useCallback} from "react";
import Cookies from "js-cookie";
import decodeToken from "../helpers/helpers";

export type Achievement = {
	achievment_data: {
		id: number,
		title: string,
		description: string,
		objective: number,
		type: string
	},
	achievment_id: number,
	completed: boolean,
	current: number,
	id: number,
	type: string,
	user_id: number
}

export type achiProps = {
	display: Achievement
}

const LayoutAchievements: React.FunctionComponent<achiProps> = ({
	display
}: achiProps) => {
	return (
		<div className="">
			<div className="box" style={{fontSize: "25px"}}>
				{display.achievment_data.title}
			</div>
			<div className="box">
				{display.achievment_data.description}
			</div>
		</div>
	)
}

export default LayoutAchievements;
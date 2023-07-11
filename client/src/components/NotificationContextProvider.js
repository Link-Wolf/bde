import React, {createContext, useState} from "react";

export const NotificationContext = createContext();

/**
 * @brief Provider for the notification context
 */
const NotificationContextProvider = ({children}) => {
	const [notif, setNotif] = useState({
		prompt: "",
		color: "secondary",
		printed: false
	});

	return (
		<NotificationContext.Provider value={[notif, setNotif]}>
			{children}
		</NotificationContext.Provider>
	);
};

export default NotificationContextProvider;

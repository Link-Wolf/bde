import React from "react";

const UserContext = React.createContext({
	user: {},
	setUser: () => {},
	token: "",
	setToken: () => {}
});

export default UserContext;

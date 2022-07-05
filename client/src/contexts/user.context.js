import React from "react";

const UserContext = React.createContext({
	user: null,
	setUser: () => {},
	token: "",
	setToken: () => {}
});

export default UserContext;

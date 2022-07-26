import React from "react";
import {useParams} from "react-router-dom";

import UserProfile from "../../components/UserProfile";

const Profile = () => {
	const param = useParams();

	return <UserProfile login={param.login} />;
};

export default Profile;

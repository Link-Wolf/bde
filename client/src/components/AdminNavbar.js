import React, { useState, useEffect } from "react";
import useConfirm from "./useConfirm";
import { NotificationManager } from "react-notifications";
import style from "../style/AdminNavbar.module.scss";
import burger from "../assets/logos/burger.png";

/**
 * @brief Navbar for the admin panel
 * @returns The admin navbar
 */
const AdminNavbar = () => {
    const [session, setSession] = useState({ clearance: 0 });

    /**
     * @brief Fetch the session data from the API and store it in the state
     */
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/session`, {
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then((data) => {
                setSession(data);
            })
            .catch(function () {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, []);

    return (
        <div className={style.adminNavbarContainer}>
            <a
                id={style.expendButton}
                onClick={() => {
                    document.getElementById(style.panel).style.left = "0px";
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                    <g>
                        <line
                            x1={13.5}
                            y1={2}
                            x2={0.5}
                            y2={2}
                            fill="none"
                            stroke="var(--black)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <line
                            x1={13.5}
                            y1={7}
                            x2={0.5}
                            y2={7}
                            fill="none"
                            stroke="var(--black)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <line
                            x1={13.5}
                            y1={12}
                            x2={0.5}
                            y2={12}
                            fill="none"
                            stroke="var(--black)"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </g>
                </svg>
            </a>
            <div id={style.panel}>
                <a
                    id={style.expendButton}
                    onClick={() => {
                        document.getElementById(style.panel).style.left =
                            "-100vw";
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14">
                        <g>
                            <line
                                x1={13.5}
                                y1={0.5}
                                x2={0.5}
                                y2={13.5}
                                fill="none"
                                stroke="var(--white)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <line
                                x1={0.5}
                                y1={0.5}
                                x2={13.5}
                                y2={13.5}
                                fill="none"
                                stroke="var(--white)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                </a>
                <a href="/admin">
                    <h2>Admin </h2>
                </a>
                <a href="/admin/students">
                    <h3>Utilisateurs</h3>
                </a>
                <a href="/admin/pingpong">
                    <h3>Ping Pong</h3>
                </a>
                <a href="/admin/events/gestion">
                    <h3>Évènements</h3>
                </a>
                <a href="/admin/events/subscribtions">
                    <h3>Inscriptions</h3>
                </a>

                <a href="/admin/shop">
                    <h3>Produits</h3>
                </a>
                <a href="/admin/logs">
                    <h3>Logs</h3>
                </a>
                {session.clearance >= 21 && (
                    <>
                        <a href="/admin/teammanagement">
                            <h3>Gestion admins</h3>
                        </a>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdminNavbar;

import { useState, useEffect, React } from "react";
import usePagination from "../../components/Pagination";
import { Pagination } from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import CheckSet from "../../components/CheckSet";
import { NotificationManager } from "react-notifications";
import ToggleButton from "../../components/ToggleButton";

import yellowStar from "../../assets/logos/yellow_star.svg";
import greyStar from "../../assets/logos/grey_star.svg";

import style from "../../style/AdminStudents.module.scss";

const AdminStudents = () => {
    const PER_PAGE = 21;
    const [data, setData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const viewData = usePagination(data, PER_PAGE);
    const [filter, setFilter] = useState({
        sortField: "login",
        asc: false,
    });

    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_API_URL}/stud?sort=${JSON.stringify(
                filter
            )}`,
            {
                credentials: "include",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
                return response.json();
            })
            .then((actualData) => {
                setData(actualData);
                setCount(Math.ceil(actualData.length / PER_PAGE));
                viewData.updateData(actualData);
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, [filter]);

    const handleFormChange = (event) => {
        let tempFilter = { ...filter };
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        tempFilter[name] = value;
        setFilter(tempFilter);
    };

    const filterHanddler = () => {
        if (document.getElementById(style.dropdown).style.display === "block")
            document.getElementById(style.dropdown).style.display = "none";
        else document.getElementById(style.dropdown).style.display = "block";
        if (document.getElementById(style.dropdownBg).style.display === "block")
            document.getElementById(style.dropdownBg).style.display = "none";
        else document.getElementById(style.dropdownBg).style.display = "block";
    };

    const handleChangePage = (e, p) => {
        setPage(p);
        viewData.jump(p);
    };

    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <AdminNavbar />
            <div className={style.studListContainer}>
                <div id={style.tittle}>
                    Gestion des <br /> utilisateurs
                </div>
                <div className={style.dropdownContainer}>
                    <button id={style.dropdownButton} onClick={filterHanddler}>
                        Trier
                    </button>
                    <div id={style.dropdownBg} onClick={filterHanddler}></div>
                    <div id={style.dropdown}>
                        <div>
                            <input
                                type="radio"
                                name="sortField"
                                value="login"
                                checked={filter.sortField === "login"}
                                onChange={handleFormChange}
                                id="login"
                            />
                            <label>Login</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="sortField"
                                value="firstname"
                                checked={filter.sortField === "firstname"}
                                onChange={handleFormChange}
                                id="firstname"
                            />
                            <label>Prénom</label>
                        </div>
                        <div>
                            {" "}
                            <input
                                type="radio"
                                name="sortField"
                                value="lastname"
                                checked={filter.sortField === "lastname"}
                                onChange={handleFormChange}
                                id="lastname"
                            />
                            <label>Nom</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="sortField"
                                value="joinDate"
                                checked={filter.sortField === "joinDate"}
                                onChange={handleFormChange}
                                id="joinDate"
                            />
                            <label>Inscription</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="sortField"
                                value="last_co"
                                checked={filter.sortField === "last_co"}
                                onChange={handleFormChange}
                                id="last_co"
                            />
                            <label>Connexion</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="sortField"
                                value="clearance"
                                checked={filter.sortField === "clearance"}
                                onChange={handleFormChange}
                                id="role"
                            />
                            <label>Autorisations</label>
                        </div>
                        <hr />
                        <div>
                            <label id={style.tri}>Inverser l'ordre</label>
                        </div>
                        <ToggleButton
                            name="asc"
                            checked={filter.asc}
                            onChange={handleFormChange}
                            id="asc"
                        />
                    </div>
                    <div id={style.results}>{data.length} résultats</div>
                </div>
                <div>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th className={style.Desclogin}>Login</th>
                                <th className={style.Descname}>Nom Prénom</th>
                                <th className={style.Descpriv} hidden>
                                    Privilège
                                </th>
                                <th className={style.Descauth}>
                                    Autorisations
                                </th>
                                <th className={style.DesclastCo}>
                                    Dernières <br />
                                    connexions
                                </th>
                                <th className={style.DescjoinDate}>
                                    Inscriptions
                                </th>
                            </tr>
                        </thead>
                        {data.length > 0 ? (
                            viewData.currentData().map(
                                (user) =>
                                    (!isFiltered || user.isPremium) && (
                                        <tr
                                            key={user.login}
                                            id={style.eachLine}
                                        >
                                            <td className={style.login}>
                                                <a
                                                    href={`/profile/${user.login}`}
                                                >
                                                    {user.login}
                                                </a>
                                            </td>
                                            <td className={style.name}>
                                                {user.firstname}{" "}
                                                <label id={style.lastname}>
                                                    {user.lastname}
                                                </label>
                                            </td>
                                            <td className={style.priv} hidden>
                                                <img
                                                    alt=""
                                                    src={
                                                        user.isPremium
                                                            ? yellowStar
                                                            : greyStar
                                                    }
                                                />
                                            </td>
                                            <td className={style.auth}>
                                                {
                                                    {
                                                        [2]: "Autre Campus",
                                                        [5]: "Piscineux",
                                                        [7]: "Student",
                                                        [9]: "Bénévole",
                                                        [11]: "Admin",
                                                        [21]: "Capitaine",
                                                        [42]: "Webmaster",
                                                    }[user.clearance]
                                                }
                                            </td>
                                            <td className={style.lastCo}>
                                                {new Date(
                                                    user.last_co
                                                ).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}{" "}
                                                <br />
                                                {new Date(
                                                    user.last_co
                                                ).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                            <td className={style.joinDate}>
                                                {new Date(
                                                    user.joinDate
                                                ).toLocaleDateString("fr-FR", {
                                                    year: "numeric",
                                                    month: "2-digit",
                                                    day: "2-digit",
                                                })}{" "}
                                                <br />
                                                {new Date(
                                                    user.joinDate
                                                ).toLocaleTimeString("fr-FR", {
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                })}
                                            </td>
                                        </tr>
                                    )
                            )
                        ) : (
                            <tr>
                                <td colSpan={4}>Aucuns utilisateurs</td>
                            </tr>
                        )}
                    </table>
                    <div id={style.pagination}>
                        <Pagination
                            count={count}
                            page={page}
                            onChange={handleChangePage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminStudents;

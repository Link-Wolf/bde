import { useState, useEffect, React } from "react";
import usePagination from "../../components/Pagination";
import { Pagination } from "@mui/material";
import AdminNavbar from "../../components/AdminNavbar";
import CheckSet from "../../components/CheckSet";
import { NotificationManager } from "react-notifications";
import ToggleButton from "../../components/ToggleButton";
import useConfirm from "../../components/useConfirm";

import style from "../../style/AdminPingPongGame.module.scss";

const AdminStudents = () => {
    const { isConfirmed } = useConfirm();
    const PER_PAGE = 21;
    const [data, setData] = useState([]);
    const [isFiltered, setIsFiltered] = useState(false);
    const [page, setPage] = useState(1);
    const [count, setCount] = useState(0);
    const viewData = usePagination(data, PER_PAGE);
    const [filter, setFilter] = useState({
        sortField: "date",
        asc: false,
    });

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/pingPongGame/all`, {
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
    }, []);

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

    const deleteGame = async (id) => {
        if (!(await isConfirmed(`Désires tu supprimer ce match ?`))) return;
        await fetch(`${process.env.REACT_APP_API_URL}/pingPongGame/${id}`, {
            method: "DELETE",
            credentials: "include",
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
            })
            .then(() => {
                setData(data.filter((game) => game.id !== id));
                setCount(Math.ceil(data.length / PER_PAGE));
                viewData.updateData(data);
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    };

    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <AdminNavbar />
            <div className={style.pingPongGameContainer}>
                <div id={style.tittle}>
                    Gestion des <br /> parties de Ping Pong
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
                                value="score"
                                checked={filter.sortField === "score"}
                                onChange={handleFormChange}
                                id="score"
                            />
                            <label>Score</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                name="sortField"
                                value="date"
                                checked={filter.sortField === "date"}
                                onChange={handleFormChange}
                                id="date"
                            />
                            <label>Date</label>
                        </div>
                        <hr />
                        <label id={style.login}>Filtrer par login :</label>
                        <input
                            autoFocus={true}
                            placeholder="Login"
                            name="login"
                            onChange={handleFormChange}
                        />
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
                    <div id={style.results}>
                        {data.length} parties jouées au total
                    </div>
                </div>
                <div>
                    <table className={style.table}>
                        <thead>
                            <tr>
                                <th className={style.DescPublisher}>Joueur1</th>
                                <th className={style.DescScorePublisher}>
                                    Points1
                                </th>
                                <th className={style.DescScoreAdversary}>
                                    Points2
                                </th>
                                <th className={style.DescAdversary}>Joueur2</th>
                                <th className={style.DescDate}>Date</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length > 0 ? (
                                viewData
                                    .currentData()
                                    .sort((a, b) => {
                                        if (filter.sortField === "date") {
                                            if (filter.asc) {
                                                return (
                                                    new Date(a.date) -
                                                    new Date(b.date)
                                                );
                                            } else {
                                                return (
                                                    new Date(b.date) -
                                                    new Date(a.date)
                                                );
                                            }
                                        } else {
                                            if (filter.asc) {
                                                return (
                                                    a.publisher_score +
                                                    a.adversary_score -
                                                    (b.publisher_score +
                                                        b.adversary_score)
                                                );
                                            } else {
                                                return (
                                                    b.publisher_score +
                                                    b.adversary_score -
                                                    (a.publisher_score +
                                                        a.adversary_score)
                                                );
                                            }
                                        }
                                    })
                                    .filter((game) => {
                                        if (filter.login) {
                                            return (
                                                game.publisher_login
                                                    .toLowerCase()
                                                    .includes(
                                                        filter.login.toLowerCase()
                                                    ) ||
                                                game.adversary_login
                                                    .toLowerCase()
                                                    .includes(
                                                        filter.login.toLowerCase()
                                                    )
                                            );
                                        } else return true;
                                    })
                                    .map((game) => (
                                        <tr key={game.id} id={style.eachLine}>
                                            <td className={style.player}>
                                                <a
                                                    href={`/profile/${game.publisher_login}`}
                                                >
                                                    {game.publisher_login}
                                                </a>
                                            </td>
                                            <td className={style.score}>
                                                {game.publisher_score}
                                            </td>
                                            <td className={style.score}>
                                                {game.adversary_score}
                                            </td>
                                            <td className={style.player}>
                                                <a
                                                    href={`/profile/${game.adversary_login}`}
                                                >
                                                    {game.adversary_login}
                                                </a>
                                            </td>
                                            <td className={style.date}>
                                                {new Date(
                                                    game.date
                                                ).toLocaleString()}
                                            </td>
                                            <td className={style.delete}>
                                                <button
                                                    id={style.delGame}
                                                    onClick={() => {
                                                        deleteGame(game.id);
                                                    }}
                                                >
                                                    ❌
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                            ) : (
                                <tr>
                                    <td colSpan={4}>
                                        Aucune partie enregistrée snif snif :'
                                        {"("}
                                    </td>
                                </tr>
                            )}
                        </tbody>
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

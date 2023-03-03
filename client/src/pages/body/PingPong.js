import { React, useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import FormField from "../../components/FormField";
import Loading from "../../components/Loading";
import style from "../../style/PingPong.module.scss";

import default_face from "../../assets/logos/unknown.webp";
import first from "../../assets/logos/first.webp";
import second from "../../assets/logos/second.webp";
import third from "../../assets/logos/third.webp";
import versusLogo from "../../assets/logos/versus.webp";

const PingPong = () => {
    const [session, setSession] = useState(0);
    const [score1, setScore1] = useState(undefined);
    const [score2, setScore2] = useState(undefined);
    const [player1, setPlayer1] = useState(undefined);
    const [player2, setPlayer2] = useState(undefined);
    const [ranking, setRanking] = useState(undefined);
    const [isValidForm, setIsValidForm] = useState(false);
    const [adversary_face, setAdversary_face] = useState(undefined);
    const [studList, setStudList] = useState(undefined);
    const [sortThing, setSortThing] = useState("date");
    const [sortOrder, setSortOrder] = useState("desc");
    const top_img = [first, second, third];

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
                if (data.clearance < global.config.clearance.other_campus)
                    window.location.href = "/home";
                setSession(data);
                setPlayer1(data.login);
            })
            .catch((error) => {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/stud/login`, {
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
                setStudList(data);
            })
            .catch((error) => {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, []);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/pingPongGame`, {
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
                setRanking(data);
            })
            .catch((error) => {
                console.log(error);
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, []);

    useEffect(() => {
        setIsValidForm(
            player1 !== -42 &&
                player1 !== undefined &&
                player2 !== undefined &&
                isValidLogin(player2) &&
                score1 !== undefined &&
                score2 !== undefined &&
                score1 >= 0 &&
                score2 >= 0 &&
                ((Math.max(score1, score2) == 11 &&
                    Math.abs(score1 - score2) >= 2) ||
                    (Math.max(score1, score2) > 11 &&
                        Math.abs(score1 - score2) == 2))
        );
    }, [score1, score2, player1, player2]);

    useEffect(() => {
        if (isValidLogin(player2)) {
            fetch(`${process.env.REACT_APP_API_URL}/stud/${player2}`, {
                credentials: "include",
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(
                            `This is an HTTP error: The status is ${response.status}`
                        );
                    }
                    if (response.length === 0) throw new Error("No data found");
                    return response.json();
                })
                .then((data) => {
                    setAdversary_face(data.img_small);
                })
                .catch((error) => {
                    console.log(error);
                    NotificationManager.error(
                        "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                        "Erreur",
                        5000
                    );
                });
        } else {
            setAdversary_face(default_face);
        }
    }, [player2]);

    const isValidLogin = (login) => {
        if (studList === undefined) return false;
        if (login === undefined) return false;
        return studList.includes(login);
    };

    const pushGame = async () => {
        if (!isValidForm) {
            NotificationManager.console.warning(
                "Vous ne pouvez pas enregistrer une partie avec ces valeurs !",
                "Atention",
                5000
            );
            return;
        }

        const requestOptions = {
            headers: {
                "Content-Type": "application/json",
            },
            method: "post",
            credentials: "include",
            body: JSON.stringify({
                publisher_login: player1,
                adversary_login: player2,
                publisher_score: score1,
                adversary_score: score2,
                date: new Date(Date.now()).toISOString(),
            }),
        };
        await fetch(
            `${process.env.REACT_APP_API_URL}/pingPongGame`,
            requestOptions
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is ${response.status}`
                    );
                }
            })
            .then(() => {
                NotificationManager.success(
                    "Partie enregistrée avec succès",
                    "Validation",
                    5000
                );
                setScore1("");
                setScore2("");
                setPlayer2("");
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });

        await fetch(`${process.env.REACT_APP_API_URL}/pingPongGame`, {
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
                setRanking(data);
            })
            .catch((error) => {
                console.log(error);
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    };

    return (
        <div>
            <datalist id="stud_list">
                {studList !== undefined &&
                    studList.map((login, i) => {
                        return <option key={i} value={login} />;
                    })}
            </datalist>
            <div>
                <div className={style.intro}>
                    <h1>Tournoi permanent de Ping Pong</h1>
                    <p>
                        Renseignez vos matchs jour après jour et gravissez le
                        classement avec vos victoires ! Ou partez à la conquête
                        des classements secondaires :
                        <ul>
                            <li>Affronter le plus d'adversaires différents</li>
                            <li>Cumuler le plus grand score</li>
                            <li>
                                Participer au plus de parties ! (sans oublier
                                votre blackhole)
                            </li>
                        </ul>
                        {/* Rappeler les regles, le fonctionnement, prevenir des
                        interdiction de poster des scores en cas d'abus ect */}
                    </p>
                    <p>
                        Les règles standards s'appliquent (11 points et 2 points
                        d'écarts minimum, etc)
                    </p>
                    <p id={style.tos}>
                        (En cas d'abus, de renseignement de faux matchs n'ayant
                        pas eu lieu, ou de mauvais renseignement de score
                        répétés, La Fregate se réserve le droit de supprimer des
                        scores, de bannir des joueurs, ou de supprimer des
                        joueurs du classement. Pour toute question, erreur ou
                        signalement, référez vous à la page de{" "}
                        <a href="/conatc">contact</a>)
                    </p>
                </div>
                {session != undefined &&
                session.clearance >= global.config.clearance.other_campus ? (
                    <>
                        {/* <ul>
                            <li>yay</li>
                            <li>yay2</li>
                            <li>yay3</li>
                        </ul> */}
                    </>
                ) : (
                    <></>
                )}
            </div>
            <form className={style.submitForm}>
                <div className={style.row}>
                    <img src={session.image_url} className={style.pp_desktop} />
                    <FormField
                        label=""
                        name="1"
                        value={player1}
                        type="text"
                        onChange={(e) => setPlayer1(e.target.value)}
                        disabled={true}
                        labelPosition="left"
                        className={style.playerField}
                    />
                    <img
                        className={style.vs}
                        src={versusLogo}
                        alt="versus logo"
                    />

                    <FormField
                        label=""
                        name="2"
                        value={player2}
                        type="text"
                        onChange={(e) => setPlayer2(e.target.value)}
                        labelPosition="right"
                        className={style.playerField}
                        placeholder="Ton adversaire"
                        list="stud_list"
                    />
                    <img src={adversary_face} className={style.pp_desktop} />
                </div>
                <div className={style.row}>
                    <FormField
                        label=""
                        name="3"
                        value={score1}
                        type="number"
                        min="0"
                        onChange={(e) => setScore1(e.target.value)}
                        labelPosition="left"
                        className={style.scoreField}
                    />
                    <div className={style.scoreText}>SCORE</div>
                    <FormField
                        label=""
                        name="4"
                        value={score2}
                        type="number"
                        min="0"
                        onChange={(e) => setScore2(e.target.value)}
                        labelPosition="right"
                        className={style.scoreField}
                    />
                </div>
                <div className={style.row}>
                    <img src={session.image_url} className={style.pp_mobile} />
                    <button
                        type="button"
                        onClick={() => pushGame()}
                        disabled={!isValidForm}
                    >
                        Game
                    </button>
                    <img src={adversary_face} className={style.pp_mobile} />
                </div>
            </form>
            <div className={style.rankingContainer}>
                <table>
                    <thead>
                        <tr>
                            <th className={style.head_rank}></th>
                            <th className={style.head_pp}></th>
                            <th className={style.head_player}>
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "player") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("asc");
                                            setSortThing("player");
                                        }
                                    }}
                                >
                                    Joueur
                                </a>
                            </th>
                            <th className={style.head_wins}>
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "win") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("desc");
                                            setSortThing("win");
                                        }
                                    }}
                                >
                                    Victoires{" "}
                                </a>
                                (
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "ratio") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("desc");
                                            setSortThing("ratio");
                                        }
                                    }}
                                >
                                    winrate
                                </a>
                                )
                            </th>
                            <th className={style.head_played_games}>
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "nb_games") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("desc");
                                            setSortThing("nb_games");
                                        }
                                    }}
                                >
                                    Parties jouées
                                </a>
                            </th>
                            <th className={style.head_total_pts}>
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "score") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("desc");
                                            setSortThing("score");
                                        }
                                    }}
                                >
                                    Score cumulé
                                </a>
                            </th>
                            <th className={style.head_unique_opponents}>
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "nb_adv") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("desc");
                                            setSortThing("nb_adv");
                                        }
                                    }}
                                >
                                    Adversaires uniques
                                </a>
                            </th>
                            <th className={style.head_last_match}>
                                <a
                                    onClick={() => {
                                        {
                                            if (sortThing == "last_match") {
                                                if (sortOrder == "asc")
                                                    setSortOrder("desc");
                                                else setSortOrder("asc");
                                            } else setSortOrder("desc");
                                            setSortThing("last_match");
                                        }
                                    }}
                                >
                                    Dernier match
                                </a>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking === undefined || ranking.length <= 0 ? (
                            <></>
                        ) : (
                            ranking
                                .sort((a, b) => {
                                    if (sortThing == "player") {
                                        if (sortOrder == "asc")
                                            return a.login.localeCompare(
                                                b.login
                                            );
                                        else
                                            return b.login.localeCompare(
                                                a.login
                                            );
                                    } else if (sortThing == "win") {
                                        if (sortOrder == "asc")
                                            return a.nb_win - b.nb_win;
                                        else return b.nb_win - a.nb_win;
                                    } else if (sortThing == "ratio") {
                                        if (sortOrder == "asc")
                                            return a.ratio - b.ratio;
                                        else return b.ratio - a.ratio;
                                    } else if (sortThing == "nb_games") {
                                        if (sortOrder == "asc")
                                            return a.nb_game - b.nb_game;
                                        else return b.nb_game - a.nb_game;
                                    } else if (sortThing == "score") {
                                        if (sortOrder == "asc")
                                            return (
                                                a.total_score - b.total_score
                                            );
                                        else
                                            return (
                                                b.total_score - a.total_score
                                            );
                                    } else if (sortThing == "nb_adv") {
                                        if (sortOrder == "asc")
                                            return (
                                                a.nb_adversary - b.nb_adversary
                                            );
                                        else
                                            return (
                                                b.nb_adversary - a.nb_adversary
                                            );
                                    } else if (sortThing == "last_match") {
                                        if (sortOrder == "asc")
                                            return a.last_match - b.last_match;
                                        else return b.last_match - a.last_match;
                                    }
                                })
                                .map((player, i) => (
                                    <tr key={player.login}>
                                        <td className={style.rank}>
                                            {i > 2 ? (
                                                i + 1
                                            ) : (
                                                <img src={top_img[i]} alt="" />
                                            )}
                                        </td>
                                        <td
                                            className={`${style.player_field} ${style.pp}`}
                                        >
                                            <img alt="" src={player.pp}></img>
                                        </td>
                                        <td className={style.head_player}>
                                            <a
                                                aria-label={`vers le profil intranet 42 de ${player.login}`}
                                                href={`https://profile.intra.42.fr/users/${player.login}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {player.login}
                                            </a>
                                        </td>
                                        <td className={style.head_wins}>
                                            {player.nb_win} (
                                            {player.ratio.toFixed(2)}%)
                                        </td>
                                        <td className={style.head_played_games}>
                                            {player.nb_game}
                                        </td>
                                        <td className={style.head_total_pts}>
                                            {player.total_score}
                                        </td>
                                        <td
                                            className={
                                                style.head_unique_opponents
                                            }
                                        >
                                            {player.nb_adversary}
                                        </td>
                                        <td className={style.head_last_match}>
                                            {new Date(
                                                player.last_match
                                            ).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PingPong;

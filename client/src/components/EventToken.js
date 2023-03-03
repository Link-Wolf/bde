import { useEffect, useState } from "react";
import { NotificationManager } from "react-notifications";
import styleBasic from "../style/EventToken.module.scss";
import styleUser from "../style/EventTokenUser.module.scss";
import conso from "../assets/logos/consos.svg";
import sponso from "../assets/logos/sponso.svg";
import pool from "../assets/logos/pool.svg";
import fadedConso from "../assets/logos/fadedConsos.svg";
import fadedSponso from "../assets/logos/fadedSponso.svg";
import fadedPool from "../assets/logos/fadedPool.svg";
import dateTime from "../assets/logos/date.svg";

const EventToken = (param) => {
    const [imgSrc, setImgSrc] = useState(null);
    let style;
    if (param.user) style = styleUser;
    else style = styleBasic;
    useEffect(() => {
        fetch(
            `${process.env.REACT_APP_API_URL}/event/${param.event.id}/thumbnail`,
            {
                credentials: "include",
            }
        )
            .then((response) => {
                if (!response.ok) {
                    throw new Error(
                        `This is an HTTP error: The status is` +
                            ` ${response.status}`
                    );
                }
                return response.blob();
            })
            .then((blob) => {
                setImgSrc(URL.createObjectURL(blob));
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, []);

    return (
        <>
            <a
                onClick={() => {
                    param.setPopUpEvent(param.event.id);
                }}
            >
                <div className={style.eventTokenContainer}>
                    <img alt="" src={imgSrc} />
                    <div>
                        <h1>{param.event.name}</h1>
                        <div>
                            {!param.event.end_date ? (
                                <label>Permanent</label>
                            ) : (
                                new Intl.DateTimeFormat("fr-FR", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }).format(new Date(param.event.begin_date))
                            )}
                        </div>
                        <ul>
                            <li>
                                <img
                                    alt=""
                                    src={
                                        param.event.consos ? conso : fadedConso
                                    }
                                />
                            </li>
                            <li>
                                <img
                                    alt=""
                                    src={
                                        param.event.for_pool ? pool : fadedPool
                                    }
                                />
                            </li>
                            <li>
                                <img
                                    alt=""
                                    src={
                                        param.event.sponso
                                            ? sponso
                                            : fadedSponso
                                    }
                                />
                            </li>
                        </ul>
                    </div>
                </div>
                <hr />
            </a>
        </>
    );
};

export default EventToken;

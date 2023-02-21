import { React, useState, useEffect } from "react";
import EventList from "../../components/EventList";
import EventListPublic from "../../components/EventListPublic";
import { NotificationManager } from "react-notifications";
import CheckSet from "../../components/CheckSet";
import { LoadingSmall, LoadingMicro } from "../../components/Loading";

import style from "../../style/Home.module.scss";
import frontImage from "../../assets/images/front.webp";
import blank from "../../assets/placeholders/tmp_profile.png";
import Product from "../../components/Product.js";

import aguemazi from "../../assets/images/aguemazi.webp";
import bcheronn from "../../assets/images/bcheronn.webp";
import llion from "../../assets/images/llion.webp";
import Link from "../../assets/images/Link.webp";
import iCARUS from "../../assets/images/iCARUS.webp";
import ddelacou from "../../assets/images/ddelacou.webp";
import agallet from "../../assets/images/agallet.webp";
import isitbon from "../../assets/images/isitbon.webp";
import dmuller from "../../assets/images/dmuller.webp";
import ggiboury from "../../assets/images/ggiboury.webp";

const Home = () => {
    const [session, setSession] = useState(0);
    const [filter, setFilter] = useState({
        current: true,
        free: false,
        available: false,
        food: false,
        unlimited: false,
        outside: false,
        sponso: false,
        sort: "begin_date",
        asc: false,
        available_date: true,
    });

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
            .then((json) => {
                setSession(json);
            });
    }, []);

    return (
        <div className={style.homeContainer}>
            <HeaderHome />
            <div className={style.lists}>
                <div>
                    <h2>Nos évènements</h2>
                    <hr />
                    {session !== 0 ? (
                        session.clearance >= 2 ? (
                            <>
                                <EventList
                                    filter={filter}
                                    className={style.col}
                                />
                                <Filter filter={filter} setFilter={setFilter} />
                            </>
                        ) : (
                            <EventListPublic />
                        )
                    ) : (
                        <></>
                    )}
                </div>
                <ProductList session={session} />
            </div>
            <Presentation />
        </div>
    );
};

const HeaderHome = () => {
    return (
        <div className={style.frontImage}>
            <img alt="" src={frontImage} />
            <div className={style.color} />
            <div className={style.text}>
                <h1>BDE 42 Mulhouse</h1>
                <span>
                    <p>
                        Bienvenue sur le site de La Frégate, l'association
                        auto-gérée remplissant le rôle du BDE de 42 Mulhouse !
                    </p>
                    <p>
                        Vous y retrouverez les évènements à venir ainsi que la
                        possibilité de vous y inscrire,
                    </p>
                    <p>
                        Mais aussi les informations sur les goodies que nous
                        vous proposons{" "}
                        {
                            //ou encore les clubs de l'école !
                        }
                        et plus encore à l'avenir !
                    </p>
                </span>
            </div>
        </div>
    );
};

const Filter = (param) => {
    const handleFormChange = (event) => {
        let tempFilter = { ...param.filter };
        const target = event.target;
        const value =
            target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;
        tempFilter[name] = value;
        param.setFilter(tempFilter);
    };

    const filterHanddler = () => {
        if (
            document.getElementById(style.dropdownMenu).style.display ===
            "block"
        )
            document.getElementById(style.dropdownMenu).style.display = "none";
        else
            document.getElementById(style.dropdownMenu).style.display = "block";
        if (document.getElementById(style.dropdownBg).style.display === "block")
            document.getElementById(style.dropdownBg).style.display = "none";
        else document.getElementById(style.dropdownBg).style.display = "block";
    };

    return (
        <div className={`${style.eventFilter} ${style.col}`}>
            <button onClick={filterHanddler} id={style.dropdownButton}>
                Filtrer
            </button>
            <div id={style.dropdownBg} onClick={filterHanddler}></div>

            <div id={style.dropdownMenu}>
                <CheckSet
                    set={[
                        {
                            label: "Gratuit",
                            name: "free",
                            checked: param.filter.free,
                        },
                        {
                            label: "Places restantes",
                            name: "available",
                            checked: param.filter.available,
                        },
                        {
                            label: "Consommations",
                            name: "food",
                            checked: param.filter.food,
                        },
                        {
                            label: "A l'extérieur",
                            name: "outside",
                            checked: param.filter.outside,
                        },
                        {
                            label: "Places illimitées",
                            name: "unlimited",
                            checked: param.filter.unlimited,
                        },
                        {
                            label: "Sponsorisé",
                            name: "sponso",
                            checked: param.filter.sponso,
                        },
                    ]}
                    onChange={handleFormChange}
                    type="checkbox"
                />
            </div>
        </div>
    );
};

const ProductList = (param) => {
    const [products, setProducts] = useState([]);
    const [thumbnailHoodies, setThumbnailHoodies] = useState(blank);
    const [thumbnailTshirt, setThumbnailTshirt] = useState(blank);
    const [thumbnailCap, setThumbnailCap] = useState(blank);
    const [popUp, setPopUp] = useState(-1);

    useEffect(() => {
        if (products[2] === undefined || products[2] === null) return;
        fetch(
            `${process.env.REACT_APP_API_URL}/goodies/${products[2].id}/thumbnail`,
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
                setThumbnailCap(URL.createObjectURL(blob));
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, [products]);

    useEffect(() => {
        if (products[0] === undefined || products[0] === null) return;
        fetch(
            `${process.env.REACT_APP_API_URL}/goodies/${products[0].id}/thumbnail`,
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
                setThumbnailHoodies(URL.createObjectURL(blob));
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, [products]);

    useEffect(() => {
        if (products[1] === undefined || products[1] === null) return;
        fetch(
            `${process.env.REACT_APP_API_URL}/goodies/${products[1].id}/thumbnail`,
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
                setThumbnailTshirt(URL.createObjectURL(blob));
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, [products]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/goodies`, {
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
                setProducts(data);
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
        <div className={style.ProductListContainer}>
            <h2>NOS PRODUITS</h2>
            <hr />
            <div className={style.thumbnailsContainer}>
                <img
                    alt=""
                    src={thumbnailHoodies}
                    onClick={() => {
                        setPopUp(products[0].id);
                    }}
                />
                <div className={style.miniThumbnailsContainer}>
                    <img
                        alt=""
                        src={thumbnailTshirt}
                        onClick={() => {
                            setPopUp(products[1].id);
                        }}
                    />
                    <img
                        alt=""
                        src={thumbnailCap}
                        onClick={() => {
                            setPopUp(products[2].id);
                        }}
                    />
                </div>
            </div>
            {popUp !== -1 && (
                <>
                    <div id={style.filter}>
                        <div
                            id={style.outArea}
                            onClick={() => {
                                setPopUp(-1);
                            }}
                        ></div>
                        <Product
                            session={param.session}
                            id={popUp}
                            setPopUp={setPopUp}
                            closeEvent={() => {
                                setPopUp(-1);
                            }}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

const EquipePicture = (props) => {
    return (
        <>
            <a
                aria-label={`vers le profil intranet 42 de ${props.login}`}
                href={`https://profile.intra.42.fr/users/${props.login}`}
                target="_blank"
                rel="noopener noreferrer"
            >
                <img alt="" src={props.img} height={100} width="auto" />
            </a>
        </>
    );
};

const Presentation = () => {
    return (
        <div className={style.presentationContainer}>
            <hr />
            <h2>Notre Équipe</h2>
            <div className={style.bureauFaces}>
                <div className={style.pole}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="bcheronn" img={bcheronn} />
                    </div>
                    <h3>Capitaine</h3>
                </div>
                <div className={style.pole}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="ggiboury" img={ggiboury} />
                    </div>
                    <h3>Lieutenant</h3>
                </div>
                <div className={style.pole}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="Link" img={Link} />
                    </div>
                    <h3>Trésorier</h3>
                </div>
                <div className={style.pole}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="iCARUS" img={iCARUS} />
                    </div>
                    <h3>Secrétaire</h3>
                </div>
                <div className={style.pole}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="agallet" img={agallet} />
                    </div>
                    <h3>
                        Responsable
                        <br />
                        partenariats
                    </h3>
                </div>
                <div className={style.pole}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="dmuller" img={dmuller} />
                        <EquipePicture login="isitbon" img={isitbon} />
                    </div>
                    <h3>
                        Responsables
                        <br />
                        communication
                    </h3>
                </div>
                <div className={style.pole} style={{ width: "450px" }}>
                    <div className={style.equipePictureContainer}>
                        <EquipePicture login="ddelacou" img={ddelacou} />
                        <EquipePicture login="llion" img={llion} />
                        <EquipePicture login="aguemazi" img={aguemazi} />
                    </div>
                    <h3>Events et animation</h3>
                </div>
            </div>
        </div>
    );
};

export default Home;

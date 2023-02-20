import { useState, useEffect } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NotificationManager } from "react-notifications";
import "react-lazy-load-image-component/src/effects/blur.css";
import burger from "../assets/logos/burger.png";
//import noyel from "../assets/logos/noyel_bonnet.png";
import noyel from "../assets/placeholders/tmp_profile.png";

import DropdownUser from "../components/DropdownUser";

import style from "../style/Header.module.scss";

import new_thing from "../assets/logos/new.png";
import bde_logo from "../assets/logos/fregate_white.png";

function Header() {
    const [leftButton, setLeftButton] = useState(<></>);
    const [rightButton, setRightButton] = useState(<></>);

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
                if (data.clearance === global.config.clearance.default) {
                    setLeftButton(
                        <>
                            <a href="/pingpong">
                                <h1>Ping Pong</h1>
                            </a>
                            <a href="/contact">
                                <h1>Contact</h1>
                            </a>
                            <a href="https://www.paypal.com/donate/?hosted_button_id=D7XUHP2EYCESS">
                                <h1>Soutenir</h1>
                            </a>
                            <img alt="" src={new_thing} />
                        </>
                    );
                }
                if (data.clearance > global.config.clearance.default) {
                    setLeftButton(
                        <>
                            {
                                // <a href="/clubs">
                                // 	<h1>Clubs</h1>
                                // </a>
                            }
                            <a href="/pingpong">
                                <h1>Ping Pong</h1>
                            </a>
                            <a href="/contact">
                                <h1>Contact</h1>
                            </a>
                            <a href="https://www.paypal.com/donate/?hosted_button_id=D7XUHP2EYCESS">
                                <h1>Soutenir</h1>
                            </a>
                            <img alt="" src={new_thing} />
                        </>
                    );
                }
                if (data.clearance >= global.config.clearance.admin) {
                    setRightButton(
                        <a href="/admin" className={style.hrbefore}>
                            <hr />
                            <h1>Admin</h1>
                        </a>
                    );
                }
            })
            .catch(function (error) {
                NotificationManager.error(
                    "Une erreur est survenue, réessayez plus tard (si le problème subsiste contactez nous)",
                    "Erreur",
                    5000
                );
            });
    }, []);

    const toggleBurgerMenu = () => {
        if (document.getElementById(style.burgerMenu).style.left === "0px") {
            document.getElementById(style.burgerMenu).style.width = "0";
            document.getElementById(style.burgerMenu).style.left = "100vw";
            document.getElementById(style.burgerMenu).style.padding = "0";
        } else {
            document.getElementById(style.burgerMenu).style.left = "0";
            document.getElementById(style.burgerMenu).style.width = "100vw";
            document.getElementById(style.burgerMenu).style.padding =
                " 0 0 0 40px";
        }
    };

    return (
        <header className={style.container}>
            <div className={`${style.burger}`} id={style.burgerMenu}>
                <div id={style.x}>
                    <a onClick={toggleBurgerMenu}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 14 14"
                        >
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
                </div>
                {leftButton}
                {rightButton}
                <hr />

                <DropdownUser mobile />
            </div>

            <div className={style.leftContainer}>
                <div>
                    <a className={style.logoContainer} href="/home">
                        <svg
                            viewBox="0 0 500 500"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fill="var(--white)"
                                d="M 155.502 437.919 C 153.418 438.963 151.332 440.006 149.245 441.047 C 144.521 431.511 141.797 421.026 141.254 410.398 C 147.424 410.13 153.595 409.818 159.765 409.585 C 159.532 402.861 160.346 396.11 162.337 389.679 C 156.524 387.751 150.666 385.965 144.843 384.063 C 148.085 373.935 153.425 364.523 160.453 356.549 C 165.017 360.575 169.562 364.638 174.126 368.675 C 178.841 363.469 184.44 359.093 190.638 355.781 C 187.861 350.351 185.048 344.938 182.243 339.517 C 191.692 334.67 202.114 331.802 212.704 331.114 C 213.097 337.213 213.438 343.313 213.813 349.413 C 220.876 349.056 227.94 350.002 234.708 352.011 C 235.403 349.838 236.094 347.663 236.783 345.485 L 238.164 341.132 C 238.853 338.956 239.545 336.779 240.237 334.606 C 250.347 337.866 259.751 343.205 267.716 350.226 C 263.688 354.834 259.589 359.397 255.535 363.988 C 260.892 368.873 265.322 374.731 268.609 381.187 C 274.146 378.437 279.664 375.65 285.202 372.892 C 289.872 382.437 292.667 392.885 293.186 403.522 C 286.978 403.816 280.782 404.102 274.574 404.361 C 274.772 411.372 273.771 418.381 271.627 425.07 C 277.548 427.017 283.46 428.991 289.372 430.966 C 285.97 441.038 280.468 450.353 273.342 458.238 C 268.733 454.015 264.089 449.826 259.474 445.61 C 254.882 450.496 249.471 454.568 243.568 457.737 C 246.452 463.302 249.355 468.866 252.221 474.447 C 242.774 479.296 232.352 482.154 221.752 482.842 C 221.386 476.591 221.01 470.33 220.644 464.079 C 213.393 464.401 206.114 463.489 199.201 461.293 C 197.229 467.222 195.256 473.143 193.282 479.074 C 183.225 475.68 173.893 470.205 166.027 463.078 C 170.196 458.479 174.412 453.916 178.556 449.29 C 173.428 444.531 169.134 438.912 165.928 432.706 C 163.841 433.748 161.757 434.79 159.671 435.834 L 155.502 437.919 Z M 71.757 385.956 C 94.361 385.832 116.953 385.634 139.556 385.421 C 139.664 385.768 139.868 386.456 139.967 386.804 C 145.602 388.974 151.478 390.475 157.193 392.432 C 156.256 396.744 155.695 401.146 155.507 405.566 C 149.299 405.817 143.103 406.111 136.904 406.397 C 136.968 420.445 140.636 434.367 147.38 446.681 C 152.986 443.887 158.586 441.075 164.195 438.27 C 166.659 442.28 169.517 446.021 172.724 449.469 C 171.84 450.389 170.983 451.335 170.135 452.29 C 150.988 452.361 131.805 453.263 112.685 451.997 C 92.404 451.63 72.096 452.755 51.833 451.37 C 61.55 443.468 67.685 431.92 70.704 419.91 C 73.517 408.845 73.855 397.181 71.757 385.956 Z M 226.511 418.919 C 225.118 421.32 223.734 423.712 222.349 426.116 C 220.019 424.767 217.696 423.429 215.375 422.088 C 210.302 430.876 205.221 439.663 200.157 448.46 C 208.695 451.835 218.233 452.826 227.199 450.646 C 237.371 448.396 246.533 442.369 252.91 434.162 C 244.112 429.08 235.316 423.99 226.511 418.919 Z M 294.088 383.947 C 340.508 383.536 386.918 382.973 433.329 382.501 C 415.504 401.218 395.599 418.097 373.611 431.742 C 361.762 438.841 349.126 445.451 335.292 447.389 C 318.61 448.307 301.91 449.103 285.21 449.575 C 289.336 442.949 292.374 435.715 294.668 428.277 C 288.712 426.321 282.772 424.321 276.816 422.364 C 277.896 417.775 278.584 413.113 278.79 408.408 C 285.04 408.093 291.301 407.835 297.562 407.541 C 297.364 399.565 296.355 391.6 294.088 383.947 Z M 223.894 431.858 C 225.278 429.456 226.664 427.053 228.056 424.659 C 234.173 428.206 240.317 431.724 246.426 435.288 C 236.263 445.78 220.421 450.085 206.346 446.174 C 209.839 440.047 213.393 433.948 216.911 427.839 C 219.232 429.169 221.564 430.51 223.894 431.858 Z M 172.688 411.926 C 173.956 423.955 180.404 435.224 189.977 442.602 C 195.049 433.805 200.131 425.017 205.203 416.22 C 202.73 414.783 200.265 413.354 197.792 411.934 C 199.175 409.533 200.559 407.13 201.944 404.736 C 193.238 399.708 184.538 394.672 175.822 389.662 C 173.055 396.699 171.758 404.379 172.688 411.926 Z M 178.091 395.842 C 184.136 399.289 190.166 402.79 196.193 406.282 C 194.809 408.675 193.433 411.069 192.049 413.47 C 194.514 414.9 196.987 416.328 199.462 417.747 C 195.934 423.884 192.397 430.009 188.843 436.126 C 178.332 425.892 174.072 409.952 178.091 395.842 Z M 229.494 397.476 C 231.834 398.834 234.182 400.191 236.541 401.547 C 235.147 403.941 233.762 406.353 232.388 408.755 C 241.174 413.819 249.954 418.9 258.741 423.964 C 261.555 416.748 262.759 408.845 261.652 401.146 C 260.197 389.456 253.82 378.606 244.559 371.391 C 239.523 380.07 234.504 388.777 229.494 397.476 Z M 235.227 395.94 C 238.711 389.911 242.166 383.884 245.668 377.883 C 256.054 388.028 260.312 403.771 256.455 417.775 C 250.328 414.274 244.23 410.728 238.121 407.21 C 239.505 404.808 240.881 402.414 242.299 400.039 C 239.943 398.663 237.586 397.298 235.227 395.94 Z M 214.804 397.923 C 212.589 401.744 210.383 405.566 208.186 409.39 C 212 411.604 215.822 413.801 219.643 416.015 C 221.849 412.194 224.056 408.37 226.261 404.549 C 222.448 402.334 218.616 400.129 214.804 397.923 Z M 208.213 363.086 C 197.783 365.148 188.317 371.177 181.743 379.508 C 190.424 384.535 199.122 389.538 207.812 394.564 C 209.196 392.162 210.58 389.77 211.972 387.384 C 214.419 388.786 216.875 390.198 219.34 391.582 C 224.332 382.874 229.379 374.203 234.379 365.505 C 226.118 362.228 216.929 361.202 208.213 363.086 Z M 188.263 378.418 C 198.433 368.033 214.214 363.889 228.2 367.783 C 224.735 373.819 221.251 379.839 217.768 385.866 C 215.321 384.446 212.874 383.036 210.428 381.625 C 209.043 384.027 207.66 386.421 206.276 388.822 C 200.274 385.348 194.264 381.893 188.263 378.418 Z M 261.357 363.764 C 265.064 359.576 268.779 355.405 272.484 351.227 C 333.175 351.253 393.858 351.173 454.539 351.271 C 453.931 354.165 452.968 357.005 451.413 359.54 C 447.315 366.585 442.001 372.819 436.644 378.919 C 388.364 378.49 340.097 377.864 291.828 377.437 C 290.381 373.972 288.756 370.595 287.077 367.255 C 281.496 370.015 275.941 372.838 270.368 375.598 C 267.779 371.356 264.769 367.381 261.357 363.764 Z M 45.984 351.243 C 83.84 351.207 121.696 351.234 159.552 351.227 C 152.801 358.513 147.164 366.854 143.289 376.025 C 118.419 375.776 93.555 375.598 68.693 375.419 C 64.658 364.8 56.754 355.405 45.984 351.243 Z M 160.82 351.234 C 168.402 351.217 175.975 351.217 183.566 351.234 C 184.047 352.19 184.547 353.155 185.056 354.111 C 181.055 356.647 177.306 359.567 173.884 362.843 C 169.527 358.978 165.169 355.111 160.82 351.234 Z M 220.09 140.227 C 230.513 150.158 239.54 161.392 248.658 172.493 C 260.491 187.031 272.512 201.49 286.105 214.44 C 308.599 236.176 335.061 253.58 363.324 266.87 C 395.447 282.113 429.642 292.49 464.184 300.617 C 426.498 307.556 388.24 310.71 350.027 313.03 C 309.858 315.316 269.628 316.112 229.395 316.013 C 233.78 311.128 235.727 304.699 237.736 298.59 C 243.613 278.925 245.926 258.296 245.907 237.81 C 245.774 203.839 237.943 169.394 220.09 140.227 Z M 161.74 10.649 C 163.222 10.148 164.722 9.657 166.213 9.157 C 172.429 25.277 178.626 41.396 184.833 57.514 C 192.96 78.376 200.461 99.478 208.721 120.296 C 210.311 125.162 213.357 129.726 213.259 135.022 C 215.313 178.762 215.491 222.557 215.563 266.334 C 215.527 282.846 215.473 299.358 215.206 315.87 C 157.193 307.056 98.673 302.064 40.171 297.857 C 35.089 299.072 29.856 297.305 24.721 297.233 C 23.73 295.785 22.729 294.348 21.738 292.919 C 25.917 292.241 29.588 288.776 34.008 290.052 C 36.214 290.365 38.009 291.74 39.573 293.249 C 42.393 293.437 45.233 293.535 48.073 293.643 C 55.888 277.399 57.397 258.108 51.368 241.043 C 89.778 250.331 128.162 259.716 166.659 268.647 C 172.188 269.844 177.67 271.254 183.289 272.032 C 166.579 266.343 149.372 262.252 132.43 257.35 C 99.236 248.572 66.336 238.524 32.589 232.023 C 32.848 230.46 33.097 228.897 33.348 227.344 C 40.662 228.835 47.976 230.299 55.281 231.79 C 65.809 213.913 68.284 191.649 62.175 171.841 C 93.966 186.416 125.731 201.07 157.766 215.1 C 163.284 217.422 168.733 219.931 174.421 221.824 C 168.464 217.984 161.971 215.109 155.695 211.859 C 119.427 193.926 82.786 176.779 46.261 159.41 C 46.985 158.008 47.716 156.624 48.458 155.231 C 55.102 158.24 61.79 161.152 68.408 164.241 C 81.768 153.704 90.725 137.763 92.573 120.813 C 117.043 140.291 141.324 160.027 166.213 178.968 C 169.134 181.155 172.044 183.37 175.161 185.282 C 164.267 174.646 152.202 165.287 140.575 155.464 C 120.481 138.808 100.183 122.395 79.901 105.962 C 80.937 104.783 81.991 103.614 83.036 102.444 C 88.617 106.409 94.226 110.329 99.772 114.348 C 118.159 106.301 132.181 89.253 136.779 69.749 C 146.701 88.414 156.756 107.007 167.098 125.448 C 171.751 133.317 175.859 141.578 181.376 148.89 C 179.046 142.47 175.671 136.495 172.608 130.404 C 158.14 102.738 142.593 75.661 126.83 48.718 C 128.144 47.727 129.456 46.736 130.779 45.744 C 135.207 51.684 139.636 57.622 144.075 63.552 C 156.122 57.39 165.919 47.022 171.26 34.582 C 167.866 26.688 164.794 18.667 161.74 10.649 Z"
                                style={{ "fill-rule": "nonzero" }}
                            />
                        </svg>
                        <img
                            alt=""
                            id={style.noyel}
                            src={noyel}
                            height="200"
                            width="200"
                        />
                        <h1>La Frégate</h1>
                    </a>
                </div>
                <div className={style.buttonContainer}>{leftButton}</div>
            </div>
            <div className={style.rightContainer}>
                <div className={style.admin}>{rightButton}</div>
                <div className={`${style.dropdownContainer}`}>
                    <DropdownUser />
                </div>
                <div className={style.burger}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 14 14"
                        onClick={toggleBurgerMenu}
                    >
                        <g>
                            <line
                                x1={13.5}
                                y1={2}
                                x2={0.5}
                                y2={2}
                                fill="none"
                                stroke="var(--white)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <line
                                x1={13.5}
                                y1={7}
                                x2={0.5}
                                y2={7}
                                fill="none"
                                stroke="var(--white)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <line
                                x1={13.5}
                                y1={12}
                                x2={0.5}
                                y2={12}
                                fill="none"
                                stroke="var(--white)"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>
                    </svg>
                </div>
            </div>
        </header>
    );
}

export default Header;

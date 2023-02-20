import { React, useEffect, useState } from "react";

const PingPong = () => {
    const [session, setSession] = useState(0);

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
            .then((json) => {
                setSession(json);
            });
    }, []);

    return (
        <>
            <div>
                <h1>
                    Ping Pong things {`>`} TODO: parler du design avec un resp
                    ping pong
                </h1>
                <p>
                    {" "}
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    elementum enim id tellus blandit, vel sagittis eros feugiat.
                    Sed auctor eros id molestie egestas. Maecenas ac placerat
                    turpis. Nullam iaculis urna eu turpis porttitor, non
                    pellentesque erat ornare. Sed aliquet odio leo, in
                    vestibulum nibh suscipit quis. Cras quis viverra ex. Ut nec
                    diam tincidunt, dictum erat at, scelerisque metus. Duis eu
                    consequat velit. Class aptent taciti sociosqu ad litora
                    torquent per conubia nostra, per inceptos himenaeos. Etiam
                    finibus ultrices ligula, ut dapibus lorem convallis sit
                    amet. Praesent blandit efficitur felis, eget rutrum nulla
                    placerat in. Vestibulum suscipit viverra laoreet. Cras
                    sagittis fermentum elit vel eleifend. Fusce in porta metus.
                    Morbi consectetur, ipsum a luctus lobortis, est tortor
                    pretium diam, cursus placerat est tellus vel velit. Donec
                    finibus id nunc eget tempus. Sed tristique eget nisi sed
                    semper. Nam quis auctor elit, quis dignissim odio. Duis et
                    suscipit dui, in lacinia nulla. Quisque cursus lorem nec
                    pellentesque auctor. Morbi non libero risus. Morbi at risus
                    placerat, ornare lectus ac, fringilla nibh. Praesent non
                    justo mi. Nullam sollicitudin at ante non scelerisque. Sed
                    sed dolor ac urna interdum rutrum ut et elit. Donec pretium
                    maximus ipsum in convallis. Ut at varius neque, et
                    scelerisque augue. Maecenas congue, nulla sagittis cursus
                    sodales, magna tellus interdum enim, in vulputate odio leo
                    non ligula. Donec eu sodales ipsum. Aenean quis suscipit
                    augue.{" "}
                </p>
                {session != undefined &&
                session.clearance >= global.config.clearance.other_campus ? (
                    <>
                        <ul>
                            <li>yay</li>
                            <li>yay2</li>
                            <li>yay3</li>
                        </ul>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </>
    );
};

export default PingPong;

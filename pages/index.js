import React from "react";
import config from "../config.json";
import styled from "styled-components"
import Menu from "../src/components/Menu";
import { StyledTimeline } from "../src/components/Timeline";
import { videoService } from "../src/services/videoService";

function HomePage() {
    const service = videoService();
    const [valorFiltro, setValorFiltro] = React.useState("");
    const [playlists, setPlaylists] = React.useState({});

    React.useEffect(() => {
        service
            .getAllVideos()
            .then((dados) => {
                const novasPlaylists = { ...playlists };
                dados.data.forEach((video) => {
                    if (!novasPlaylists[video.playlist]) novasPlaylists[video.playlist] = [];
                    novasPlaylists[video.playlist] = [
                        video,
                        ...novasPlaylists[video.playlist],
                    ];
                });
                setPlaylists(novasPlaylists);
            });
    }, []);


    return (
        <>
            <div style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
            }}>
                <Menu
                    valorFiltro={valorFiltro}
                    setValorFiltro={setValorFiltro}
                />
                <Header />
                <Timeline
                    searchValue={valorFiltro}
                    playlists={playlists}
                    favoritos={config.favorites}
                />
            </div>
        </>
    );
}

export default HomePage

const StyledHeader = styled.div`
    background-color: ${({ theme }) => theme.backgroundLevel1};
    
    section img {
        width: 80px;
        height: 80px;
        border-radius: 50%;
    }
    .user-info {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 16px 32px;
        gap: 16px;
    }
`;
const StyledBanner = styled.div`
    background-color: blue;
    background-image: url(${({ banner }) => banner});
    height: 230px;
`
function Header() {
    return (
        <StyledHeader>
            <StyledBanner banner={config.banner} />
            <section className="user-info">
                <img src={`https://github.com/${config.github}.png`} />
                <div>
                    <h2>
                        {config.name}
                    </h2>
                    <p>
                        {config.job}
                    </p>
                </div>
            </section>
        </StyledHeader>
    );
}

function Timeline({ searchValue, ...props }) {
    const playlistNames = Object.keys(props.playlists);

    const favoritosObj = Object.keys(props.favoritos);

    return (
        <StyledTimeline>
            {playlistNames.map((playlistName) => {
                const videos = props.playlists[playlistName];
                return (
                    <section key={playlistName} className="playlists">
                        <h2>{playlistName}</h2>
                        <div>
                            {videos
                                .filter((video) => {
                                    const titleNormalized = video.title.toLowerCase();
                                    const searchValueNormalized = searchValue.toLowerCase();
                                    return titleNormalized.includes(searchValueNormalized);
                                })
                                .map((video) => {
                                    return (
                                        <a key={video.url} href={video.url}>
                                            <img src={video.thumb} />
                                            <span>
                                                {video.title}
                                            </span>
                                        </a>
                                    )
                                })}
                        </div>
                    </section>
                )
            })}
            <section className="favoritos">
                <h2>Favoritos</h2>
                <div>
                    {favoritosObj.map((favorito) => {
                        const favoritos = props.favoritos[favorito];
                        return (
                            <a key={favoritos.url} href={favoritos.url}>
                                <img src={favoritos.profile} />
                                <span>
                                    {favoritos.name}
                                </span>
                            </a>
                        )
                    })}
                </div>
            </section>
        </StyledTimeline>
    )
}
import {
    IonApp,
    IonLabel,
    IonRouterOutlet,
    IonTabBar,
    IonTabButton,
    IonTabs,
    setupIonicReact,
    useIonRouter,
} from "@ionic/react";
import {IonReactRouter} from "@ionic/react-router";
import {Redirect, Route, useLocation} from "react-router-dom";
import Aktifitas from "./pages/Aktifitas/Aktifitas";
import Beranda from "./pages/Beranda";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
// import "@ionic/react/css/normalize.css";
// import "@ionic/react/css/structure.css";
// import "@ionic/react/css/typography.css";
/* Optional CSS utils that can be commented out */
// import "@ionic/react/css/display.css";
// import "@ionic/react/css/flex-utils.css";
// import "@ionic/react/css/float-elements.css";
// import "@ionic/react/css/padding.css";
// import "@ionic/react/css/text-alignment.css";
// import "@ionic/react/css/text-transformation.css";
/* Theme variables */
import {BackgroundGeolocationPlugin} from "@capacitor-community/background-geolocation";
import {App} from "@capacitor/app";
import {registerPlugin} from "@capacitor/core";
import {Geolocation} from "@capacitor/geolocation";
import {ContactIcon, FingerprintIcon, HistoryIcon, HomeIcon,} from "lucide-react";
import "moment/locale/id";
import {useEffect, useLayoutEffect} from "react";
import {QueryClient, QueryClientProvider} from "react-query";
import Absensi from "./pages/Absensi";
import CreateCuti from "./pages/Aktifitas/CreateCuti";
import CreateIzin from "./pages/Aktifitas/CreateIzin";
import DetailAktivitas from "./pages/Aktifitas/DetailAktivitas";
import EditCuti from "./pages/Aktifitas/EditCuti";
import EditIzin from "./pages/Aktifitas/EditIzin";
import DetailGaji from "./pages/Gaji/DetailGaji";
import Gaji from "./pages/Gaji/Gaji";
import Login from "./pages/Login/login";
import CreateDokumen from "./pages/Profil/DataDokumen/CreateDokumen";
import DataDokumen from "./pages/Profil/DataDokumen/DataDokumen";
import CreateKeluarga from "./pages/Profil/DataKeluarga/CreateKeluarga";
import DataKeluarga from "./pages/Profil/DataKeluarga/DataKeluarga";
import EditKeluarga from "./pages/Profil/DataKeluarga/EditKeluarga";
import CreatePelatihan from "./pages/Profil/DataPelatihan/CreatePelatihan";
import DataPelatihan from "./pages/Profil/DataPelatihan/DataPelatihan";
import EditPelatihan from "./pages/Profil/DataPelatihan/EditPelatihan";
import CreatePendidikan from "./pages/Profil/DataPendidikan/CreatePendidikan";
import DataPendidikan from "./pages/Profil/DataPendidikan/DataPendidikan";
import EditPendidikan from "./pages/Profil/DataPendidikan/EditPendidikan";
import DataRekening from "./pages/Profil/DataRekening";
import InformasiDasar from "./pages/Profil/InformasiDasar/InformasiDasar";
import Profil from "./pages/Profil/Profil";
import UbahPassword from "./pages/Profil/UbahPassword";
import {AuthProvider, useAuth} from "./providers/AuthProvider";
import {ProtectedRoute} from "./route/ProtectedRoute";
import {useDistanceStore} from "./store/DistanceStore";
import {distanceInMeters} from "./utils/distanceCalculator";
import {StatusBar, Style} from "@capacitor/status-bar";

registerPlugin<BackgroundGeolocationPlugin>("BackgroundGeolocation");
setupIonicReact();

const PagesWithoutNavBar = [
    "/login",
    "/ubah-password",
    "/informasi-dasar",
    "/data-keluarga",
    "/data-pendidikan",
    "/data-pelatihan",
    "/data-dokumen",
    "/create-dokumen",
    "/data-rekening",
    "/create-aktivitas",
    "/edit-aktivitas",
    "/create-pendidikan",
    "/edit-pendidikan",
    "/create-pelatihan",
    "/edit-pelatihan",
    "/create-cuti",
    "/create-izin",
];
const MainTabs: React.FC = () => {
    const ionRouter = useIonRouter();
    const location = useLocation();
    const auth = useAuth();
    const pathname = location.pathname;

    useLayoutEffect(() => {
        const e = document.querySelector("ion-tab-bar");
        if (!e) return;
        const hideNavBar = PagesWithoutNavBar.includes(pathname);
        e.style.display = hideNavBar ? "none" : "flex";
    }, [pathname]);

    useEffect(() => {
        document.addEventListener("ionBackButton", (ev: any) => {
            ev.detail.register(-1, () => {
                if (!ionRouter.canGoBack()) {
                    App.exitApp();
                }
            });
        });
    }, [ionRouter]);

    const styles = {
        tabBar: `p-2 bg-zinc-50 rounded-full my-2 mx-2  `,
        tabButton: `bg-zinc-50`, //`font-black text-black focus:text-red-700`,
        tabLabel: ` text-xs mt-1`,
    };

    return (
        <IonTabs>
            <IonRouterOutlet>
                <Route exact path="/" render={() => <Redirect to="/beranda"/>}/>
                <Route
                    exact
                    path="/login"
                    render={() => (auth.user ? <Redirect to="/"/> : <Login/>)}
                />

                <Route
                    path="/beranda"
                    render={() => (
                        <ProtectedRoute>
                            <Beranda/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/aktifitas"
                    render={() => (
                        <ProtectedRoute>
                            <Aktifitas/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/aktifitas/:id"
                    render={() => (
                        <ProtectedRoute>
                            <DetailAktivitas/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/absensi"
                    render={() => (
                        <ProtectedRoute>
                            <Absensi/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/profil"
                    render={() => (
                        <ProtectedRoute>
                            <Profil/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/ubah-password"
                    render={() => (
                        <ProtectedRoute>
                            <UbahPassword/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-pelatihan"
                    render={() => (
                        <ProtectedRoute>
                            <DataPelatihan/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-pelatihan/:id"
                    render={() => (
                        <ProtectedRoute>
                            <EditPelatihan/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/create-pelatihan"
                    render={() => (
                        <ProtectedRoute>
                            <CreatePelatihan/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/informasi-dasar"
                    render={() => (
                        <ProtectedRoute>
                            <InformasiDasar/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-keluarga"
                    render={() => (
                        <ProtectedRoute>
                            <DataKeluarga/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-keluarga/:id"
                    render={() => (
                        <ProtectedRoute>
                            <EditKeluarga/>
                        </ProtectedRoute>
                    )}
                />
                <Route
                    exact
                    path="/create-keluarga"
                    render={() => (
                        <ProtectedRoute>
                            <CreateKeluarga/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-dokumen"
                    render={() => (
                        <ProtectedRoute>
                            <DataDokumen/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/create-dokumen"
                    render={() => (
                        <ProtectedRoute>
                            <CreateDokumen/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-pendidikan"
                    render={() => (
                        <ProtectedRoute>
                            <DataPendidikan/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-pendidikan/:id"
                    render={() => (
                        <ProtectedRoute>
                            <EditPendidikan/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/create-pendidikan"
                    render={() => (
                        <ProtectedRoute>
                            <CreatePendidikan/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/data-rekening"
                    render={() => (
                        <ProtectedRoute>
                            <DataRekening/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/gaji"
                    render={() => (
                        <ProtectedRoute>
                            <Gaji/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/gaji/:id"
                    render={() => (
                        <ProtectedRoute>
                            <DetailGaji/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/create-cuti"
                    render={() => (
                        <ProtectedRoute>
                            <CreateCuti/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/create-izin"
                    render={() => (
                        <ProtectedRoute>
                            <CreateIzin/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/aktifitas/:id/edit-izin"
                    render={() => (
                        <ProtectedRoute>
                            <EditIzin/>
                        </ProtectedRoute>
                    )}
                />

                <Route
                    exact
                    path="/aktifitas/:id/edit-cuti"
                    render={() => (
                        <ProtectedRoute>
                            <EditCuti/>
                        </ProtectedRoute>
                    )}
                />
            </IonRouterOutlet>

            <IonTabBar slot="bottom" className={styles.tabBar}>
                <IonTabButton
                    tab="beranda"
                    href="/beranda"
                    className={styles.tabButton}
                >
                    <HomeIcon strokeWidth={1}/>
                    <IonLabel className={styles.tabLabel}>Beranda</IonLabel>
                </IonTabButton>

                <IonTabButton
                    tab="check-lock"
                    href="/check-lock"
                    className={styles.tabButton}
                >
                    <FingerprintIcon strokeWidth={1}/>
                    <IonLabel className={styles.tabLabel}>Presensi</IonLabel>
                </IonTabButton>

                <IonTabButton
                    tab="absensi"
                    href="/absensi"
                    className={styles.tabButton}
                >
                    <HistoryIcon strokeWidth={1}/>
                    <IonLabel className={styles.tabLabel}>Riwayat</IonLabel>
                </IonTabButton>

                <IonTabButton tab="profil" href="/profil" className={styles.tabButton}>
                    <ContactIcon strokeWidth={1}/>
                    <IonLabel className={styles.tabLabel}>Profil</IonLabel>
                </IonTabButton>
            </IonTabBar>
        </IonTabs>
    );
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        },
    },
});

const InitApp: React.FC = () => {
    const {setDistance} = useDistanceStore();

    useEffect(() => {
        const setStatusBarStyleLight = async () => {
            await StatusBar.setStyle({style: Style.Light});
        };
        setStatusBarStyleLight();
        const showStatusbar = async () => {
            await StatusBar.show();
        };
        showStatusbar();
        StatusBar.setBackgroundColor({
            color: '#fafafa'
        })
    }, []);

    useEffect(() => {
        (async () => {

            const printCurrentPosition = async () => {
                const nobelLatlng = {
                    latitude: -5.1901967,
                    longitude: 119.4776626,
                };
                await Geolocation.watchPosition(
                    {
                        enableHighAccuracy: true,
                    },
                    (data) => {
                        if (data) {
                            const {latitude, longitude} = data.coords;
                            const distance = distanceInMeters(
                                nobelLatlng.latitude,
                                nobelLatlng.longitude,
                                latitude,
                                longitude
                            );
                            setDistance(distance);
                        }
                    }
                );
            };
            printCurrentPosition();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        })();
    }, [setDistance]);

    return (
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <IonApp>
                    <IonReactRouter>
                        <MainTabs/>
                    </IonReactRouter>
                </IonApp>
            </QueryClientProvider>
        </AuthProvider>
    );
};

export default InitApp;

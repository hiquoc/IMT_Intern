import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    layout("../layouts/ProtectedLayout.tsx", [
        index("./routes/home.tsx"),
        route("profile", "./routes/profile.tsx"),
    ]),
    layout("../layouts/GuestLayout.tsx", [
        route("login", "./routes/login.tsx"),
        route("register", "./routes/register.tsx"),
    ]),
] satisfies RouteConfig;

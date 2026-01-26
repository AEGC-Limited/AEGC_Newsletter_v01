import { Login } from "@/app/components/auth/login"
import { PublicRoute } from "@/app/components/auth/PublicProtectedRoute";

const page = () => {
    return <PublicRoute><Login/></PublicRoute>
}

export default page;
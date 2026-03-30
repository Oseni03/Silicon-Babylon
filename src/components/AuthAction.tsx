import { ModeToggle } from "@/components/ModeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export const AuthAction = ({ setIsAuthOpen }: { setIsAuthOpen: (open: boolean) => void }) => {
    const { user, loading, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Signed out successfully");
        } catch (error) {
            toast.error("Error signing out");
        }
    };

    return (
        <div className="flex items-center gap-4">
            {loading ? (
                <div className="w-8 h-8 bg-black/5 animate-pulse" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center gap-2 group outline-none">
                            <div className="w-8 h-8 border border-black flex items-center justify-center bg-black text-white text-[10px] font-black group-hover:bg-white group-hover:text-black transition-all">
                                {(user.username?.[0] || "U").toUpperCase()}
                            </div>
                            <span className="text-[10px] uppercase tracking-widest font-bold hidden lg:block">
                                {user.username || "Account"}
                            </span>
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-none border-black p-1 shadow-none">
                        <DropdownMenuItem 
                            onClick={handleSignOut}
                            className="rounded-none text-[10px] uppercase tracking-widest font-black focus:bg-black focus:text-white cursor-pointer"
                        >
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <button
                    onClick={() => setIsAuthOpen(true)}
                    className="text-[10px] uppercase tracking-[0.2em] font-black hover:text-primary transition-colors border-b border-black pb-0.5"
                >
                    Sign In
                </button>
            )}
            <div className="hidden sm:block">
                <ModeToggle />
            </div>
        </div>
    )
}

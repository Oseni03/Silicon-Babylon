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

export const AuthAction = ({ setIsAuthOpen }) => {
    const { user, loading, signOut } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success("Signed out successfully");
        } catch (error) {
            toast.error("Error signing out", {
                description: "There was a problem signing you out.",
            });
        }
    };
    return (
        <div className="flex justify-between md:justify-normal items-center gap-2">
            <ModeToggle />
            {loading ? (
                <div className="w-8 h-8 rounded-full bg-secondary animate-pulse" />
            ) : user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                            <Avatar>
                                <AvatarImage
                                    src={undefined}
                                    alt={user.username || "User avatar"}
                                />
                                <AvatarFallback>
                                    {(user.username?.[0] || "U").toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleSignOut}>
                            Sign Out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAuthOpen(true)}
                >
                    Sign In
                </Button>
            )}
        </div>
    )
}

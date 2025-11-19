import { Link } from "react-router";
import { Button } from "./ui/button";

export default function Footer({ version }: {
    version: string;
}) {
    const year = new Date().getFullYear();
    return (
        <footer className="mt-auto border-t bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row">
                <div className="flex items-center gap-2">
                    <span>© {year} <Link to="https://utils.fborges.dev" target="_blank">
                        <Button variant={"link"} className="p-0 cursor-pointer text-xs text-muted-foreground font-normal">
                            utils.fborges.dev
                        </Button>
                    </Link></span>
                    <span aria-hidden>•</span>
                    <Link to="https://github.com/Franciscoborges2002/utils.fborges.dev" target="_blank">
                        <Button variant={"link"} className="p-0 cursor-pointer text-xs text-muted-foreground font-normal">
                            github
                        </Button>
                    </Link>
                    <span aria-hidden>•</span>
                    <span>{version}</span>
                </div>
                <div className="flex items-center gap-3">
                    <span>Built with ❤️ by <Link to="https://fborges.dev" target="_blank">
                        <Button variant={"link"} className="p-0 cursor-pointer">
                            Francisco Borges
                        </Button>
                    </Link>.
                    </span>
                </div>
            </div>
        </footer>
    );
}
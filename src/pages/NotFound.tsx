import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";

export default function NotFound404() {
    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="w-full max-w-xl shadow-sm">
                <CardHeader className="text-center">
                    <CardTitle className="flex flex-col items-center gap-2 text-3xl font-bold">
                        <span role="img" aria-label="lost">🧭</span>
                        <span>404 • Page not found</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center text-muted-foreground">
                    <p>The page you’re looking for doesn’t exist or has moved.</p>
                    <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => (window.location.href = "/")}>
                            Go home
                        </Button>
                        <Button variant="secondary" onClick={() => window.history.back()}>
                            Go back
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
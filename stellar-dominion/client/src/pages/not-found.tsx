import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-2">
            <Link href="/">
              <Button className="w-full">Go to Dashboard</Button>
            </Link>
            <Link href="/universe">
              <Button variant="outline" className="w-full">Open Universe Map</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
